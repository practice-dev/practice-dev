import http from 'http';
import { launch } from '../puppeteer';
import { Page, Browser } from 'puppeteer';
import { initFrontendServer, TEST_PORT } from './helper';
import { TesterPage } from '../TesterPage';
import { TestNotifier } from './TestNotifier';

let page: Page;
let server: http.Server;
let browser: Browser;
let tester: TesterPage;
let notifier: TestNotifier;

function getBaseUrl() {
  return 'http://localhost:' + TEST_PORT;
}

beforeAll(async () => {
  browser = await launch({
    headless: true,
  });
  page = await browser.newPage();
  server = await initFrontendServer(TEST_PORT);
  await page.goto(getBaseUrl());
});

afterAll(async () => {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
});

beforeEach(async () => {
  notifier = new TestNotifier();
  tester = new TesterPage(notifier, page, 100);
  await page.evaluate(() => {
    document.body.innerHTML = '';
  });
});

describe('click', () => {
  it('should click properly', async () => {
    await page.evaluate(() => {
      const btn = document.createElement('button');
      let count = 0;
      btn.addEventListener('click', () => {
        count++;
        btn.value = 'clicks ' + count;
      });
      btn.setAttribute('data-test', 'foo');
      document.body.appendChild(btn);
    });
    await tester.click('@foo');
    const result = await page.evaluate(() => {
      const btn = document.querySelector('button');
      return btn!.value;
    });
    expect(result).toMatch('clicks 1');
  });

  it('should throw an error if not found', async () => {
    await expect(tester.click('@foo')).rejects.toThrow(
      'waiting for selector `[data-test="foo"]` failed'
    );
  });
});

describe('navigate', () => {
  it('should navigate properly', async () => {
    await tester.navigate('http://localhost:' + TEST_PORT + '/bar');
    expect(notifier.actions).toEqual([
      'Navigate to "http://localhost:6899/bar"',
    ]);
  });
});

describe('expectToBeVisible', () => {
  it('should expected to be visible properly', async () => {
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.setAttribute('data-test', 'foo');
      document.body.appendChild(btn);
    });
    await tester.expectToBeVisible('@foo');
    expect(notifier.actions).toEqual([
      'Expect "[data-test="foo"]" to be visible',
    ]);
  });

  it('should throw an error if does not exist', async () => {
    await expect(tester.expectToBeVisible('@foo')).rejects.toThrow(
      'waiting for selector `[data-test="foo"]` failed'
    );
  });

  it('should throw an error if hidden', async () => {
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.setAttribute('data-test', 'foo');
      btn.style.display = 'none';
      document.body.appendChild(btn);
    });
    await expect(tester.expectToBeVisible('@foo')).rejects.toThrow(
      'waiting for selector `[data-test="foo"]` failed'
    );
  });
});

describe('expectToBeHidden', () => {
  it('should expected to be hidden properly (not exists)', async () => {
    await tester.expectToBeHidden('@foo');
    expect(notifier.actions).toEqual([
      'Expect "[data-test="foo"]" to be hidden',
    ]);
  });

  it('should expected to be hidden properly (hidden)', async () => {
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.setAttribute('data-test', 'foo');
      btn.style.display = 'none';
      document.body.appendChild(btn);
    });
    await tester.expectToBeHidden('@foo');
    expect(notifier.actions).toEqual([
      'Expect "[data-test="foo"]" to be hidden',
    ]);
  });

  it('should throw an error if exists', async () => {
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.setAttribute('data-test', 'foo');
      document.body.appendChild(btn);
    });
    await expect(tester.expectToBeHidden('@foo')).rejects.toThrow(
      'waiting for selector `[data-test="foo"]` to be hidden failed'
    );
  });
});

describe('expectToMatch', () => {
  function addDiv() {
    return page.evaluate(() => {
      const div = document.createElement('div');
      div.setAttribute('data-test', 'foo');
      div.textContent = 'lorem';
      document.body.appendChild(div);
    });
  }
  describe('partial', () => {
    it('should match properly', async () => {
      await addDiv();
      await tester.expectToMatch('@foo', 'lor');
      expect(notifier.actions).toEqual([
        'Expect "[data-test="foo"]" to contain "lor"',
      ]);
    });
    it('should throw an error if does not match', async () => {
      await addDiv();
      await expect(tester.expectToMatch('@foo', 'qwe')).rejects.toThrow(
        'Expected "[data-test="foo"]" to include "qwe". Actual: "lorem".'
      );
    });
    it('should throw an error if does not exist', async () => {
      await expect(tester.expectToMatch('@foo', 'qwe')).rejects.toThrow(
        'waiting for selector `[data-test="foo"]` failed'
      );
    });
    it('should throw an error if multiple results', async () => {
      await addDiv();
      await addDiv();
      await expect(tester.expectToMatch('@foo', 'qwe')).rejects.toThrow(
        'Found 2 elements with selector "[data-test="foo"]". Expected only 1.'
      );
    });
  });
  describe('exact', () => {
    it('should match properly', async () => {
      await addDiv();
      await tester.expectToMatch('@foo', 'lorem', true);
      expect(notifier.actions).toEqual([
        'Expect "[data-test="foo"]" to equal "lorem"',
      ]);
    });
    it('should throw an error if does not match', async () => {
      await addDiv();
      await expect(tester.expectToMatch('@foo', 'lor', true)).rejects.toThrow(
        'Expected "[data-test="foo"]" to equal "lor". Actual: "lorem".'
      );
    });
  });
});

describe('type', () => {
  it('should type properly', async () => {
    await page.evaluate(() => {
      const div = document.createElement('input');
      div.setAttribute('data-test', 'foo');
      document.body.appendChild(div);
    });
    await tester.type('@foo', 'bar');
    expect(notifier.actions).toEqual(['Type "bar" to "[data-test="foo"]"']);
    const value = await page.evaluate(() => {
      return document.querySelector('input')!.value;
    });
    expect(value).toEqual('bar');
  });
});

describe('expectToBeEnabled', () => {
  it('should match properly', async () => {
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.setAttribute('data-test', 'foo');
      document.body.appendChild(btn);
    });
    await tester.expectToBeEnabled('@foo');
    expect(notifier.actions).toEqual([
      'Expect "[data-test="foo"]" to be enabled',
    ]);
  });

  it('should throw if disabled', async () => {
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.setAttribute('data-test', 'foo');
      btn.setAttribute('disabled', '');
      document.body.appendChild(btn);
    });
    await expect(tester.expectToBeEnabled('@foo')).rejects.toThrow(
      'Expected "[data-test="foo"]" to be enabled, but it\'s still disabled'
    );
  });
});

describe('expectToBeDisabled', () => {
  it('should match properly', async () => {
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.setAttribute('data-test', 'foo');
      btn.setAttribute('disabled', '');
      document.body.appendChild(btn);
    });
    await tester.expectToBeDisabled('@foo');
    expect(notifier.actions).toEqual([
      'Expect "[data-test="foo"]" to be disabled',
    ]);
  });

  it('should throw if enabled', async () => {
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.setAttribute('data-test', 'foo');
      document.body.appendChild(btn);
    });
    await expect(tester.expectToBeDisabled('@foo')).rejects.toThrow(
      'Expected "[data-test="foo"]" to be disabled, but it\'s still enabled'
    );
  });
});

describe('clear', () => {
  it('should clear properly', async () => {
    await page.evaluate(() => {
      const div = document.createElement('input');
      div.setAttribute('data-test', 'foo');
      div.value = 'value';
      document.body.appendChild(div);
    });
    await tester.clear('@foo');
    expect(notifier.actions).toEqual(['Clear "[data-test="foo"]"']);
    const value = await page.evaluate(() => {
      return document.querySelector('input')!.value;
    });
    expect(value).toEqual('');
  });
});

describe('expectOrder', () => {
  beforeEach(async () => {
    await page.evaluate(() => {
      document.body.innerHTML = `
      <div data-test="group">
        <div data-test="item-a"></div>
        <div data-test="item-b"></div>
        <div data-test="item-c"></div>
        <div data-test="item-d"></div>
      </div>`;
    });
  });

  it('should expect order properly', async () => {
    await tester.expectOrder('@group @^item-', '@item-a', 1);
    await tester.expectOrder('@group @^item-', '@item-b', 2);
    await tester.expectOrder('@group @^item-', '@item-c', 3);
    await tester.expectOrder('@group @^item-', '@item-d', 4);
    expect(notifier.actions).toEqual([
      'Expect "[data-test="item-a"]" to be 1st in group "[data-test="group"] [data-test^="item-"]"',
      'Expect "[data-test="item-b"]" to be 2nd in group "[data-test="group"] [data-test^="item-"]"',
      'Expect "[data-test="item-c"]" to be 3rd in group "[data-test="group"] [data-test^="item-"]"',
      'Expect "[data-test="item-d"]" to be 4th in group "[data-test="group"] [data-test^="item-"]"',
    ]);
  });

  it('should throw an error if invalid order', async () => {
    await expect(
      tester.expectOrder('@group @^item-', '@item-a', 2)
    ).rejects.toThrow('Expected order: 2. Actual: 1');
  });

  it('should throw an error if not found', async () => {
    await expect(
      tester.expectOrder('@group @^item-', '@item-z', 2)
    ).rejects.toThrow(
      '"[data-test="item-z"]" not found in group "[data-test="group"] [data-test^="item-"]"'
    );
  });
});

describe('select', () => {
  beforeEach(async () => {
    await page.evaluate(() => {
      document.body.innerHTML = `
      <select data-test="foo">
        <option value="" disabled>Select</option>
        <option value="1">opt a</option>
        <option value="2">opt b</option>
        <option value="3">opt c</option>
      </select>`;
    });
  });

  it('should select properly', async () => {
    await tester.select('@foo', 'opt a');
    expect(notifier.actions).toEqual([
      'Select "opt a" option in "[data-test="foo"]"',
    ]);
  });

  it('should throw an error if select not found', async () => {
    await expect(tester.select('@bar', 'opt a')).rejects.toThrow(
      'waiting for selector `[data-test="bar"]` failed'
    );
  });

  it('should throw an error if option not found', async () => {
    await expect(tester.select('@foo', '1')).rejects.toThrow(
      'Option with text "1" not found in "[data-test="foo"]"'
    );
  });

  it('should throw an error if option is disabled', async () => {
    await expect(tester.select('@foo', 'Select')).rejects.toThrow(
      'Option with text "Select" is disabled'
    );
  });

  it('should throw an error if not a select tag', async () => {
    await page.evaluate(() => {
      document.body.innerHTML = `
      <div data-test="foo"></div>`;
    });
    await expect(tester.select('@foo', 'opt a')).rejects.toThrow(
      '"[data-test="foo"]" is not a <select> element'
    );
  });
});

describe('expectToHaveOption', () => {
  beforeEach(async () => {
    await page.evaluate(() => {
      document.body.innerHTML = `
      <select data-test="foo">
        <option value="" disabled>Select</option>
        <option value="1">opt a</option>
        <option value="2">opt b</option>
        <option value="3">opt c</option>
      </select>`;
    });
  });

  it('should assert successfully', async () => {
    await tester.expectToHaveOption('@foo', 'opt a');
    expect(notifier.actions).toEqual([
      'Expect "[data-test="foo"]" to have an option "opt a"',
    ]);
  });

  it('should throw an error if option not found', async () => {
    await expect(tester.expectToHaveOption('@foo', '1')).rejects.toThrow(
      'Option with text "1" not found in "[data-test="foo"]"'
    );
  });

  it('should throw an error if option is disabled', async () => {
    await expect(tester.select('@foo', 'Select')).rejects.toThrow(
      'Option with text "Select" is disabled'
    );
  });
});

describe('expectToNotHaveOption', () => {
  beforeEach(async () => {
    await page.evaluate(() => {
      document.body.innerHTML = `
      <select data-test="foo">
        <option value="" disabled>Select</option>
        <option value="1">opt a</option>
        <option value="2">opt b</option>
        <option value="3">opt c</option>
      </select>`;
    });
  });

  it('should assert successfully', async () => {
    await tester.expectToNotHaveOption('@foo', '1');
    expect(notifier.actions).toEqual([
      'Expect "[data-test="foo"]" to not have an option "1"',
    ]);
  });

  it('should throw an error if option found', async () => {
    await expect(tester.expectToNotHaveOption('@foo', 'opt a')).rejects.toThrow(
      'Option with text "opt a" found in "[data-test="foo"]"'
    );
  });
});

describe('expectSelectedText', () => {
  beforeEach(async () => {
    await page.evaluate(() => {
      document.body.innerHTML = `
      <select data-test="foo">
        <option value="" disabled>Select</option>
        <option value="1">opt a</option>
        <option value="2">opt b</option>
        <option value="3" selected>opt c</option>
      </select>`;
    });
  });

  it('should assert successfully', async () => {
    await tester.expectSelectedText('@foo', 'opt c');
    expect(notifier.actions).toEqual([
      'Expect "[data-test="foo"]" to have selected text "opt c"',
    ]);
  });

  it('should throw an error if option found', async () => {
    await expect(tester.expectSelectedText('@foo', 'opt a')).rejects.toThrow(
      'Expected selected text: "opt a". Actual: "opt c".'
    );
  });
});

describe('keyboardType', () => {
  beforeEach(async () => {
    await page.evaluate(() => {
      document.body.innerHTML = `
      <input id="input" autofocus />;`;
    });
  });

  it('should type successfully', async () => {
    await page.evaluate(() => {
      document.getElementById('input')?.focus();
    });
    await tester.keyboardType('abc');
    expect(notifier.actions).toEqual(['Press keyboard text "abc"']);
    await tester.expectToMatch('input', 'abc', true);
  });
});

describe('keyboardPress', () => {
  beforeEach(async () => {
    await page.evaluate(() => {
      document.body.innerHTML = `
      <input id="input" autofocus  />;`;
    });
  });

  it('should press successfully', async () => {
    await page.evaluate(() => {
      document.getElementById('input')?.focus();
    });
    await tester.keyboardType('abc');
    notifier.actions.pop();
    await tester.keyboardPress('Backspace');
    expect(notifier.actions).toEqual(['Press keyboard key "Backspace"']);
    await tester.expectToMatch('input', 'ab', true);
  });
});

describe('focus', () => {
  beforeEach(async () => {
    await page.evaluate(() => {
      document.body.innerHTML = `
      <input id="input1" />; <input id="input2" />;`;
    });
  });

  it('should press successfully', async () => {
    await tester.focus('#input2');
    expect(notifier.actions).toEqual(['Focus "#input2"']);
    await tester.keyboardType('abc');
    notifier.actions.pop();
    await tester.expectToMatch('#input2', 'abc', true);
  });

  it('should throw an error if not found', async () => {
    await expect(tester.focus('#input3')).rejects.toThrow(
      'waiting for selector `#input3` failed'
    );
  });
});

describe('expectUrlToMatch', () => {
  it('should expect url successfully (already correct)', async () => {
    await page.goto(getBaseUrl());
    await tester.expectUrlToMatch('/');
    expect(notifier.actions).toEqual(['Expect URL to equal "/"']);
  });

  it('should expect url successfully', async () => {
    await page.goto(getBaseUrl());
    const expectUrl = tester.expectUrlToMatch('/foo');
    const goto = page.goto(getBaseUrl() + '/foo');
    await Promise.all([expectUrl, goto]);
    expect(notifier.actions).toEqual(['Expect URL to equal "/foo"']);
  });

  it('should throw an error incorrect url', async () => {
    await page.goto(getBaseUrl());
    await expect(tester.expectUrlToMatch('/foo')).rejects.toThrow(
      'Expected URL to equal /foo, but got /'
    );
  });
});
