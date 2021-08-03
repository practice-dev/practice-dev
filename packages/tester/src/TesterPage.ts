import URL from 'url';
import {
  Page,
  WaitForSelectorOptions,
  ElementHandle,
  KeyInput,
} from 'puppeteer';
import {
  checkHasSelectorMatches,
  getSelectorMatchResult,
  isPuppeteerTimeout,
} from './helper';
import { RequestMocker } from './RequestMocker';
import { TestError } from './TestError';
import { StepNotifier } from './types';

function rethrowNonTimeout(error: Error) {
  if (!isPuppeteerTimeout(error)) {
    throw error;
  }
}

function convertSelector(selector: string) {
  return selector
    .replace(/\@\^([a-zA-Z0-9_-]+)/g, '[data-test^="$1"]')
    .replace(/\@([a-zA-Z0-9_-]+)/g, '[data-test="$1"]');
}

function getNumSuffix(n: number) {
  if (n === 1) {
    return 'st';
  }
  if (n === 2) {
    return 'nd';
  }
  if (n === 3) {
    return 'rd';
  }
  return 'th';
}

const waitNavigationOptions = {
  timeout: 5000,
  waitUntil: 'domcontentloaded',
} as const;

export class TesterPage {
  private waitOptions: WaitForSelectorOptions;

  constructor(
    private stepNotifier: StepNotifier,
    private page: Page,
    private defaultTimeout: number
  ) {
    this.waitOptions = {
      visible: true,
      timeout: defaultTimeout,
    };
  }

  private async _assertTag(
    input: string,
    handle: ElementHandle<Element>,
    expectedTagName: string
  ) {
    const tagName = await handle
      .getProperty('tagName')
      .then(x => x!.jsonValue())
      .then(x => (x as string).toLowerCase());
    if (tagName !== expectedTagName) {
      throw new TestError(`"${input}" is not a <${expectedTagName}> element`);
    }
  }

  private async _throwSelectOptionError(
    input: string,
    handle: ElementHandle<Element>,
    text: string
  ) {
    const isDisabled = await this.page.evaluate(
      (handle, text) => {
        const options = [...handle.querySelectorAll('option')];
        const option = options.find(option => (option.text ?? '') === text);
        if (option && option.disabled) {
          return true;
        }
        return false;
      },
      handle,
      text
    );
    if (isDisabled) {
      throw new TestError(`Option with text "${text}" is disabled`);
    }
    throw new TestError(`Option with text "${text}" not found in "${input}"`);
  }

  async navigate(url: string) {
    await this.stepNotifier.notify(`Navigate to "${url}"`);
    await this.page.goto(url, waitNavigationOptions);
  }

  async expectToBeVisible(selector: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(`Expect "${input}" to be visible`);
    await this.page.waitForSelector(input, this.waitOptions);
  }

  async expectToBeHidden(selector: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(`Expect "${input}" to be hidden`);
    await this.page.waitForSelector(input, {
      ...this.waitOptions,
      visible: false,
      hidden: true,
    });
  }

  async expectToMatch(selector: string, expected: string, exact = false) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(
      `Expect "${input}" to ${exact ? 'equal' : 'contain'} "${expected}"`
    );
    await this.page.waitForSelector(input, this.waitOptions);

    const handle = await this.page.evaluateHandle(() => document);
    try {
      await this.page.waitForFunction(
        checkHasSelectorMatches,
        {
          timeout: this.defaultTimeout,
        },
        handle,
        input,
        expected as any,
        exact
      );
    } catch (error) {
      rethrowNonTimeout(error);
      const actual = await this.page.evaluate(
        getSelectorMatchResult,
        handle,
        input
      );
      if (typeof actual === 'object' && actual.error === 'multiple') {
        throw new TestError(
          `Found ${actual.count} elements with selector "${input}". Expected only 1.`
        );
      } else {
        throw new TestError(
          exact
            ? `Expected "${input}" to equal "${expected}". Actual: "${actual}".`
            : `Expected "${input}" to include "${expected}". Actual: "${actual}".`
        );
      }
    }
  }

  async click(selector: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(`Click on "${input}"`);
    await this.page.waitForSelector(input, this.waitOptions);
    await this.page.click(input);
  }

  async type(selector: string, text: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(`Type "${text}" to "${input}"`);
    await this.page.waitForSelector(input, this.waitOptions);
    await this.page.type(input, text, { delay: 10 });
  }

  async keyboardType(text: string) {
    await this.stepNotifier.notify(`Press keyboard text "${text}"`);
    await this.page.keyboard.type(text, { delay: 10 });
  }
  async keyboardPress(key: string) {
    await this.stepNotifier.notify(`Press keyboard key "${key}"`);
    await this.page.keyboard.press(key as KeyInput, { delay: 10 });
  }

  async focus(selector: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(`Focus "${input}"`);
    await this.page.waitForSelector(input, this.waitOptions);
    await this.page.focus(input);
  }

  async expectToBeEnabled(selector: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(`Expect "${input}" to be enabled`);
    await this.page.waitForSelector(input, this.waitOptions);
    const handle = await this.page.evaluateHandle(() => document);
    try {
      await this.page.waitForFunction(
        (handle: any, input: any) => {
          const elements = [...handle.querySelectorAll(input)];
          if (elements.length !== 1) {
            return null;
          }
          const element = elements[0];
          return element.getAttribute('disabled') === null;
        },
        {
          timeout: this.defaultTimeout,
        },
        handle,
        input
      );
    } catch (error) {
      rethrowNonTimeout(error);
      const actual = await this.page.evaluate(
        (handle, input) => {
          const elements = [...handle.querySelectorAll(input)];
          if (elements.length !== 1) {
            return { error: 'multiple', count: elements.length };
          }
          return null;
        },
        handle,
        input
      );
      if (actual?.error === 'multiple') {
        throw new TestError(
          `Found ${actual.count} elements with selector '${selector}'. Expected only 1.`
        );
      }
      throw new TestError(
        `Expected "${input}" to be enabled, but it's still disabled`
      );
    }
  }

  async expectToBeDisabled(selector: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(`Expect "${input}" to be disabled`);
    await this.page.waitForSelector(input, this.waitOptions);
    const handle = await this.page.evaluateHandle(() => document);
    try {
      await this.page.waitForFunction(
        (handle: any, input: any) => {
          const elements = [...handle.querySelectorAll(input)];
          if (elements.length !== 1) {
            return null;
          }
          const element = elements[0];
          return element.getAttribute('disabled') !== null;
        },
        {
          timeout: this.defaultTimeout,
        },
        handle,
        input
      );
    } catch (error) {
      rethrowNonTimeout(error);
      const actual = await this.page.evaluate(
        (handle, input) => {
          const elements = [...handle.querySelectorAll(input)];
          if (elements.length !== 1) {
            return { error: 'multiple', count: elements.length };
          }
          return null;
        },
        handle,
        input
      );
      if (actual?.error === 'multiple') {
        throw new TestError(
          `Found ${actual.count} elements with selector '${selector}'. Expected only 1.`
        );
      }
      throw new TestError(
        `Expected "${input}" to be disabled, but it's still enabled`
      );
    }
  }

  async close() {
    await this.page.close();
  }

  async reload() {
    await this.stepNotifier.notify(`Reloading page`);
    await this.page.reload();
  }

  async clear(selector: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(`Clear "${input}"`);
    await this.page.waitForSelector(input, this.waitOptions);
    await this.page.click(input, { clickCount: 3 });
    await this.page.keyboard.press('Backspace');
  }

  async expectOrder(groupSelector: string, selector: string, order: number) {
    const group = convertSelector(groupSelector);
    const input = convertSelector(selector);
    await this.stepNotifier.notify(
      `Expect "${input}" to be ${order}${getNumSuffix(
        order
      )} in group "${group}"`
    );
    const handle = await this.page.evaluateHandle(() => document);
    try {
      await this.page.waitForFunction(
        (handle: any, group: any, input: any, order: any) => {
          const elements = [...handle.querySelectorAll(group)];
          const target = handle.querySelector(input);
          if (!target) {
            return null;
          }
          return elements.indexOf(target) + 1 === order;
        },
        {
          timeout: this.defaultTimeout,
        },
        handle,
        group,
        input,
        order
      );
    } catch (error) {
      rethrowNonTimeout(error);
      const actual = await this.page.evaluate(
        (handle, group, input) => {
          const elements = [...handle.querySelectorAll(group)];
          const target = handle.querySelector(input);
          return elements.indexOf(target);
        },
        handle,
        group,
        input
      );

      if (actual === -1) {
        throw new TestError(`"${input}" not found in group "${group}"`);
      }
      throw new TestError(`Expected order: ${order}. Actual: ${actual + 1}`);
    }
  }

  async select(selector: string, text: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(`Select "${text}" option in "${input}"`);
    const handle = await this.page.waitForSelector(input, this.waitOptions);
    await this._assertTag(input, handle!, 'select');

    try {
      await this.page.waitForFunction(
        (handle: any, text: any) => {
          const options = [...handle.querySelectorAll('option')];
          const option = options.find(option => (option.text ?? '') === text);
          if (option && !option.disabled) {
            option.selected = true;
            const evt = document.createEvent('HTMLEvents');
            evt.initEvent('change', true, true);
            handle.dispatchEvent(evt);
            return true;
          }
          return false;
        },
        {
          timeout: this.defaultTimeout,
        },
        handle,
        text
      );
    } catch (error) {
      rethrowNonTimeout(error);
      await this._throwSelectOptionError(input, handle!, text);
    }
  }

  async goBack() {
    await this.stepNotifier.notify(`Navigating back`);
    await this.page.goBack(waitNavigationOptions);
  }

  async goForward() {
    await this.stepNotifier.notify(`Navigating forward`);
    await this.page.goForward(waitNavigationOptions);
  }

  async expectToHaveOption(selector: string, text: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(
      `Expect "${input}" to have an option "${text}"`
    );

    const handle = await this.page.waitForSelector(input, this.waitOptions);
    await this._assertTag(input, handle!, 'select');
    try {
      await this.page.waitForFunction(
        (handle: any, text: any) => {
          const options = [...handle.querySelectorAll('option')];
          const option = options.find(
            option => (option.text ?? '').trim() === text
          );
          if (option && !option.disabled) {
            return true;
          }
          return false;
        },
        {
          timeout: this.defaultTimeout,
        },
        handle,
        text
      );
    } catch (error) {
      rethrowNonTimeout(error);
      await this._throwSelectOptionError(input, handle!, text);
    }
  }

  async expectToNotHaveOption(selector: string, text: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(
      `Expect "${input}" to not have an option "${text}"`
    );

    const handle = await this.page.waitForSelector(input, this.waitOptions);
    await this._assertTag(input, handle!, 'select');
    try {
      await this.page.waitForFunction(
        (handle: any, text: any) => {
          const options = [...handle.querySelectorAll('option')];
          const option = options.find(
            option => (option.text ?? '').trim() === text
          );
          if (option) {
            return false;
          }
          return true;
        },
        {
          timeout: this.defaultTimeout,
        },
        handle,
        text
      );
    } catch (error) {
      rethrowNonTimeout(error);
      throw new TestError(`Option with text "${text}" found in "${input}"`);
    }
  }

  async expectSelectedText(selector: string, text: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(
      `Expect "${input}" to have selected text "${text}"`
    );
    const handle = await this.page.waitForSelector(input, this.waitOptions);
    await this._assertTag(input, handle!, 'select');
    try {
      await this.page.waitForFunction(
        (handle: any, text: any) => {
          const options = [...handle.querySelectorAll('option')];
          const option = options[handle.selectedIndex];
          return (option?.text ?? '').trim() === text;
        },
        {
          timeout: this.defaultTimeout,
        },
        handle,
        text
      );
    } catch (error) {
      rethrowNonTimeout(error);
      const actual = await this.page.evaluate(handle => {
        const options = [...handle.querySelectorAll('option')];
        const option = options[handle.selectedIndex];
        return (option?.text ?? '').trim();
      }, handle);
      throw new TestError(
        `Expected selected text: "${text}". Actual: "${actual}".`
      );
    }
  }

  async enableRequestMocking() {
    const reqMocking = new RequestMocker(
      this.stepNotifier,
      this.page,
      this.defaultTimeout
    );
    await reqMocking.init();
    return reqMocking;
  }

  async expectUrlToMatch(url: string) {
    const start = Date.now();
    await this.stepNotifier.notify(`Expect URL to equal "${url}"`);
    return new Promise<void>((resolve, reject) => {
      const intId = setInterval(() => {
        let current = URL.parse(this.page.url()).path;
        if (current === url) {
          clearInterval(intId);
          resolve();
        } else if (Date.now() - start > this.defaultTimeout) {
          clearInterval(intId);
          reject(
            new TestError(`Expected URL to equal ${url}, but got ${current}`)
          );
        }
      }, 10);
    });
  }
}
