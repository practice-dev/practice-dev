import type { Page, HTTPRequest } from 'puppeteer';
import Url from 'url';
import { TestError } from './TestError';
import { StepNotifier } from './types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RespondFnResult {
  defer?: Defer;
  status: number;
  json?: any;
}

type RespondFn = (count: number) => Promise<RespondFnResult> | RespondFnResult;

interface Defer {
  promise: Promise<void>;
  resolve(): void;
}

class ReqMock {
  private isBlocked = false;
  private fn: RespondFn | null = null;
  private count = 0;
  private error: TestError | null = null;
  private request: HTTPRequest | null = null;

  constructor(
    private name: string,
    private stepNotifier: StepNotifier,
    private defaultTimeout: number
  ) {}

  private _getDisplayName() {
    return `"${this.name}"`;
  }

  block() {
    this.isBlocked = true;
  }

  unblock() {
    this.isBlocked = false;
  }

  respond(fn: RespondFn) {
    this.fn = fn;
  }

  async process(request: HTTPRequest) {
    this.request = request;
    this.stepNotifier.notify(`Processing request ${this._getDisplayName()}`);
    if (this.isBlocked) {
      this.error = new TestError(
        `The request ${this._getDisplayName()} was not allowed to be invoked yet.`
      );
      request.abort();
      return;
    }
    if (!this.fn) {
      throw new Error('Respond fn not set');
    }
    const id = ++this.count;
    const ret = await this.fn(id);
    if (ret.defer) {
      await ret.defer.promise;
    }
    const body = ret.json ? JSON.stringify(ret.json) : undefined;
    await new Promise(resolve => setTimeout(resolve, 10));

    await request.respond({
      contentType: 'application/json',
      status: ret.status,
      body,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
    });
    await this.stepNotifier.notify(
      `Return response for ${this._getDisplayName()}`,
      {
        status: ret.status,
        body: ret.json,
      }
    );
  }

  async expectToBeCalled(expected: number) {
    if (this.error) {
      throw this.error;
    }
    let start = Date.now();
    while (
      this.count !== expected &&
      Date.now() - start < this.defaultTimeout
    ) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    if (this.count !== expected) {
      throw new TestError(
        `Expected ${this._getDisplayName()} to be called ${expected} times, but was called ${
          this.count
        } times.`
      );
    }
  }
  async expectToBeCancelled() {
    if (this.request?.failure()?.errorText !== 'net::ERR_ABORTED') {
      throw new TestError(`Expected ${this._getDisplayName()} to be canceled.`);
    }
  }
}

function _getRequestKey(domain: string, method: string, path: string | null) {
  return [domain, method, path ?? '/'].join('|');
}

export class RequestMocker {
  private mocks: Record<string, ReqMock> = {};

  constructor(
    private stepNotifier: StepNotifier,
    private page: Page,
    private defaultTimeout: number
  ) {}

  async init() {
    await this.page.removeAllListeners();
    await this.page.setRequestInterception(true);
    this.page.on('request', async request => {
      const url = Url.parse(request.url());
      const mock =
        this.mocks[
          _getRequestKey(
            url.protocol + '//' + url.host!,
            request.method().toUpperCase(),
            url.path
          )
        ];
      if (mock) {
        mock.process(request);
      } else {
        request.continue();
      }
    });
  }

  mock(baseUrl: string, method: HttpMethod, path: string) {
    const req = new ReqMock(
      `${method} ${baseUrl}${path}`,
      this.stepNotifier,
      this.defaultTimeout
    );
    this.mocks[_getRequestKey(baseUrl, method, path)] = req;
    return req;
  }

  createDefer() {
    const defer = {} as Defer;
    defer.promise = new Promise(resolve => {
      defer.resolve = resolve;
    });
    return defer;
  }
}
