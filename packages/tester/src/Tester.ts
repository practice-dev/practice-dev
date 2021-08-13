import * as R from 'remeda';
import http from 'http';
import Url from 'url';
import crypto from 'crypto';
import { Schema, Convert, getValidateResult } from '@pvd/schema';
import { TestError } from './TestError';
import { formatErrors } from '@pvd/schema/src/utils';
import { makeUrl, getRequest, tryParse } from './helper';
import { Test, StepNotifier, PageFactory } from './types';
import { TesterPage } from './TesterPage';

export interface MakeRequestOptions {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  params?: any;
  query?: any;
}

const maxBodyLength = 1 * 1024 * 1024;

const defaultApiTimeout = 3500;

const defaultTimeout = process.env.DEFAULT_WAIT_TIME
  ? Number(process.env.DEFAULT_WAIT_TIME)
  : 3500;

export const defaultWaitOptions = { visible: true, timeout: defaultTimeout };

export class Tester {
  tests: Test[] = [];
  baseApiUrl: string | null = null;
  private nextId = 1;
  private pageMap: Record<string, TesterPage> = {};

  constructor(
    private stepNotifier: StepNotifier,
    private createBrowserPage: PageFactory
  ) {}

  async createPage(
    name: string | number = 'default',
    contextId?: number | string
  ) {
    this.pageMap[name] = new TesterPage(
      this.stepNotifier,
      await this.createBrowserPage(contextId),
      defaultTimeout
    );
  }

  async closePage(name: string | number = 'default') {
    const page = this.getPage(name);
    await page.close();
    delete this.pageMap[name];
  }

  getPage(name: string | number = 'default') {
    if (!this.pageMap[name]) {
      throw new Error(
        `Page "${name}" is not created. Use "createPage" function first.`
      );
    }
    return this.pageMap[name];
  }

  setBaseApiUrl(baseApiUrl: string) {
    this.baseApiUrl = baseApiUrl.replace(/\/$/, '');
  }

  private getBaseApiUrl() {
    if (!this.baseApiUrl) {
      throw new Error('baseApiUrl not set');
    }
    return this.baseApiUrl;
  }

  test(name: string, fn: () => Promise<void>) {
    const test: Test = {
      id: this.tests.length + 1,
      name,
      result: 'pending',
      exec: fn,
    };
    this.tests.push(test);
  }

  async makeRequest(options: MakeRequestOptions) {
    const id = this.nextId++;
    const url = makeUrl({
      baseUrl: this.getBaseApiUrl(),
      path: options.path,
      params: options.params,
      query: options.query,
    });
    await this.stepNotifier.notify(
      `Make request ${id} ${options.method} ${url}`,
      options.body && {
        body: options.body,
      }
    );

    return new Promise<[unknown, http.IncomingMessage]>((resolve, reject) => {
      const makeRequest = getRequest(url);
      const serializedBody = options.body ? JSON.stringify(options.body) : null;
      const headers: any = {};
      if (serializedBody) {
        headers['Content-Type'] = 'application/json';
        headers['Content-Length'] = serializedBody.length;
      }
      let timeoutId: any = null;
      const parsed = new Url.URL(url);
      const req = makeRequest(
        {
          host: parsed.hostname,
          port: parsed.port,
          path: parsed.pathname,
          search: parsed.search,
          method: options.method,
          headers,
        },
        res => {
          let body = '';
          res.on('data', chunk => {
            body += chunk;
            if (body.length > maxBodyLength) {
              clearTimeout(timeoutId);
              reject(new TestError('Max response size exceeded: 1MB'));
              req.abort();
            }
          });
          res.on('end', () => {
            clearTimeout(timeoutId);
            resolve([tryParse(body), res]);
          });
        }
      );
      if (serializedBody) {
        req.write(serializedBody);
      }
      req.on('error', e => {
        reject(new TestError('Cannot connect to server: ' + e.message));
      });
      req.end();

      timeoutId = setTimeout(() => {
        reject(new TestError(`Timeout exceeded: ${defaultApiTimeout}ms`));
        try {
          req.abort();
        } catch (ignore) {}
      }, defaultApiTimeout);
    }).then(async ret => {
      await this.stepNotifier.notify(`Response from request ${id}`, {
        status: ret[1].statusCode,
        body: ret[0],
      });
      return ret;
    });
  }

  async expectStatus(res: http.IncomingMessage, status: number) {
    await this.stepNotifier.notify(`Expect status to equal "${status}"`);
    if (res.statusCode !== status) {
      throw new TestError(
        `Expected status to equal "${status}". Actual: "${res.statusCode}".`
      );
    }
  }

  async expectEqual<T>(actual: T, expected: T, name: string) {
    const serialized = JSON.stringify(expected);
    await this.stepNotifier.notify(
      `Expect "${name}" to equal \`${serialized}\``
    );
    if (!R.equals(actual, expected)) {
      throw new TestError(
        `Expected "${name}" to equal \`${serialized}\`. Actual: \`${JSON.stringify(
          actual
        )}\`.`
      );
    }
  }

  async expectSchema<T extends Schema>(
    data: unknown,
    schema: T,
    sourceName: string,
    schemaName: string
  ): Promise<Convert<T>> {
    await this.stepNotifier.notify(
      `Expect "${sourceName}" to match "${schemaName}" schema.`
    );

    const { value: newValue, errors } = getValidateResult(data, schema, [
      sourceName,
    ]);
    if (errors.length) {
      throw new TestError(formatErrors(errors));
    }
    return newValue;
  }

  async randomInt() {
    return crypto.randomBytes(4).readUInt32BE(0);
  }

  notify(text: string, data?: any) {
    return this.stepNotifier.notify(text, data);
  }
}
