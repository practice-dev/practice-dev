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
  beforeEach(async () => {
    return page.evaluate(() => {
      document.body.innerHTML = `
        <div data-test="foo">lorem</div> 
        <div data-test="bar">lorem</div> 
        <div data-test="bar">lorem</div> 
        <input type="text" value="abc" data-test="input1" />
        <input type="number" value="100" data-test="input2" />
        <input type="number" value="" data-test="input3" />
        `;
    });
  });
  describe('partial', () => {
    it('should match properly', async () => {
      await tester.expectToMatch('@foo', 'lor');
      expect(notifier.actions).toEqual([
        'Expect "[data-test="foo"]" to contain "lor"',
      ]);
    });
    it('should throw an error if does not match', async () => {
      await expect(tester.expectToMatch('@foo', 'qwe')).rejects.toThrow(
        'Expected "[data-test="foo"]" to include "qwe". Actual: "lorem".'
      );
    });
    it('should throw an error if does not exist', async () => {
      await expect(tester.expectToMatch('@abc', 'qwe')).rejects.toThrow(
        'waiting for selector `[data-test="abc"]` failed'
      );
    });
    it('should throw an error if multiple results', async () => {
      await expect(tester.expectToMatch('@bar', 'qwe')).rejects.toThrow(
        'Found 2 elements with selector "[data-test="bar"]". Expected only 1.'
      );
    });
  });
  describe('exact', () => {
    it('should match properly', async () => {
      await tester.expectToMatch('@foo', 'lorem', true);
      expect(notifier.actions).toEqual([
        'Expect "[data-test="foo"]" to equal "lorem"',
      ]);
    });
    it('should match properly (input)', async () => {
      await tester.expectToMatch('@input1', 'abc', true);
      expect(notifier.actions).toEqual([
        'Expect "[data-test="input1"]" to equal "abc"',
      ]);
    });
    it('should match properly (input number)', async () => {
      await tester.expectToMatch('@input2', 100, true);
      expect(notifier.actions).toEqual([
        'Expect "[data-test="input2"]" to equal 100',
      ]);
    });
    it('should match properly (input number as string)', async () => {
      await tester.expectToMatch('@input2', '100', true);
      expect(notifier.actions).toEqual([
        'Expect "[data-test="input2"]" to equal "100"',
      ]);
    });
    it('should match empty (input number)', async () => {
      await tester.expectToMatch('@input3', '', true);
      expect(notifier.actions).toEqual([
        'Expect "[data-test="input3"]" to equal ""',
      ]);
    });
    it('should throw an error if does not match', async () => {
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

describe('expectCount', () => {
  beforeEach(async () => {
    await page.evaluate(() => {
      document.body.innerHTML = `
      <div data-test="group">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <span></spa>
      </div>`;
    });
  });

  it('should expect count properly', async () => {
    await tester.expectCount('@group div', 4);
    expect(notifier.actions).toEqual([
      'Expect count of "[data-test="group"] div" to be 4',
    ]);
  });

  it('should throw an error if invalid order', async () => {
    await expect(tester.expectCount('@group div', 2)).rejects.toThrow(
      'Expected count: 2. Actual: 4'
    );
  });
});

describe('expectAttribute', () => {
  beforeEach(async () => {
    await page.evaluate(() => {
      document.body.innerHTML = `
      <div data-test="node1" id="foo">
      </div>`;
    });
  });

  it('should expect attribute properly', async () => {
    await tester.expectAttribute('@node1', 'id', 'foo');
    expect(notifier.actions).toEqual([
      'Expect "[data-test="node1"]" to have "id" attribute equal to "foo"',
    ]);
  });

  it('should throw an error if invalid value', async () => {
    await expect(tester.expectAttribute('@node1', 'id', 'bar')).rejects.toThrow(
      'Expected value: bar. Actual: foo'
    );
  });

  it('should throw an error if not found', async () => {
    await expect(tester.expectAttribute('@node2', 'id', 'bar')).rejects.toThrow(
      '"[data-test="node2"]" not found'
    );
  });
});

describe('getIframeElementContent', () => {
  beforeEach(async () => {
    await page.evaluate(() => {
      document.body.innerHTML = `
      <iframe data-test="iframe1" id="target">
      </iframe> 
      `;
      const iframe = document.getElementById('target')! as HTMLIFrameElement;
      var doc = iframe.contentWindow!.document;
      doc.open();
      doc.write(` <html>
      <body>
        <div id="test">foo</div>
      </body>
      </html>`);
      doc.close();
    });
  });

  it('should get content properly', async () => {
    const content = await tester.getIframeElementContent('@iframe1', '#test');
    expect(content).toBe('foo');
    expect(notifier.actions).toEqual([]);
  });

  it('should throw iframe not found', async () => {
    await expect(
      tester.getIframeElementContent('@iframe2', '#test')
    ).rejects.toThrow('"[data-test="iframe2"]" not found');
  });

  it('should throw iframe selector not found', async () => {
    await expect(
      tester.getIframeElementContent('@iframe1', '#abc')
    ).rejects.toThrow('waiting for selector `#abc` failed');
  });
});

describe('selectFileContent', () => {
  beforeEach(async () => {
    await page.evaluate(() => {
      document.body.innerHTML = `
      <input type="file" data-test="input1" id="target" />
      <div data-test="result" id="result"></div>
      <button data-test="btn">click</button>
      `;
      const input = document.getElementById('target')! as HTMLInputElement;
      const result = document.getElementById('result')! as HTMLDivElement;
      input.addEventListener('change', e => {
        const file = input.files![0];
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          result.innerText = reader.result as string;
        });
        reader.readAsText(file);
      });
    });
  });

  it('should get content properly', async () => {
    await tester.selectFileContent('@input1', Buffer.from('foobar'));
    expect(notifier.actions).toEqual(['Select file to "[data-test="input1"]"']);
    await tester.expectToMatch('@result', 'foobar', true);
  });

  it('should throw file not selected', async () => {
    await expect(
      tester.selectFileContent('@btn', Buffer.from('foobar'))
    ).rejects.toThrow('File chooser dialog not invoked');
  });

  it('should throw selector not found', async () => {
    await expect(
      tester.selectFileContent('@asd', Buffer.from('foobar'))
    ).rejects.toThrow('waiting for selector `[data-test="asd"]` failed');
  });
});

describe('expectToBeFocused', () => {
  beforeEach(async () => {
    await page.evaluate(() => {
      document.body.innerHTML = `
      <input type="text" data-test="input1" autofocus  />
      <input type="text" data-test="input2"   />
      `;
    });
  });

  it('should expect focused content properly', async () => {
    await tester.expectToBeFocused('@input1');
    expect(notifier.actions).toEqual([
      'Expect "[data-test="input1"]" to be focused',
    ]);
  });

  it('should throw file not selected', async () => {
    await expect(tester.expectToBeFocused('@input2')).rejects.toThrow(
      'Expected "[data-test="input2"]" to be focused'
    );
  });
});

describe('expectToHaveClass', () => {
  beforeEach(async () => {
    await page.evaluate(() => {
      document.body.innerHTML = `
      <div class="foo" data-test="div1"></div> 
      <div class="foo bar" data-test="div2"></div> 
      `;
    });
  });

  it('should expect to have class properly', async () => {
    await tester.expectToHaveClass('@div1', 'foo');
    expect(notifier.actions).toEqual([
      'Expect "[data-test="div1"]" to have class "foo"',
    ]);
  });

  it('should expect to have class properly (many classes)', async () => {
    await tester.expectToHaveClass('@div2', 'foo');
    expect(notifier.actions).toEqual([
      'Expect "[data-test="div2"]" to have class "foo"',
    ]);
  });

  it('should throw no class', async () => {
    await expect(tester.expectToHaveClass('@div1', 'bar')).rejects.toThrow(
      'Expected class: "bar". Actual: "foo"'
    );
  });

  it('should throw no class (many classes)', async () => {
    await expect(tester.expectToHaveClass('@div2', 'abc')).rejects.toThrow(
      'Expected class: "abc". Actual: "foo bar"'
    );
  });
});

describe('expectToBeChecked', () => {
  beforeEach(async () => {
    await page.evaluate(() => {
      document.body.innerHTML = `
      <div data-test="div1"></div> 
      <input type="checkbox" checked  data-test="checkbox1" />
      <input type="checkbox" data-test="checkbox2" />
      `;
    });
  });

  it('should expect to be checked', async () => {
    await tester.expectToBeChecked('@checkbox1', true);
    expect(notifier.actions).toEqual([
      'Expect "[data-test="checkbox1"]" to be checked',
    ]);
  });

  it('should expect to be unchecked', async () => {
    await tester.expectToBeChecked('@checkbox2', false);
    expect(notifier.actions).toEqual([
      'Expect "[data-test="checkbox2"]" to be unchecked',
    ]);
  });

  it('should throw still unchecked', async () => {
    await expect(tester.expectToBeChecked('@checkbox1', false)).rejects.toThrow(
      'Expected "[data-test="checkbox1"]" to be unchecked, but it\'s still checked.'
    );
  });

  it('should throw still checked', async () => {
    await expect(tester.expectToBeChecked('@checkbox2', true)).rejects.toThrow(
      'Expected "[data-test="checkbox2"]" to be checked, but it\'s still unchecked.'
    );
  });

  it('should throw if not a checkbox', async () => {
    await expect(tester.expectToBeChecked('@div1', true)).rejects.toThrow(
      'The selector \'[data-test="div1"]\' is not a checkbox.'
    );
  });

  it('should throw if multiple', async () => {
    await expect(tester.expectToBeChecked('input', true)).rejects.toThrow(
      "Found 2 elements with selector 'input'. Expected only 1."
    );
  });
});
