import http from 'http';
import { launch } from '../puppeteer';
import { Page, Browser } from 'puppeteer';
import { initFrontendServer, TEST_PORT } from './helper';
import { TestNotifier } from './TestNotifier';
import { RequestMocker } from '../RequestMocker';

let page: Page;
let server: http.Server;
let browser: Browser;
let reqMocker: RequestMocker;
let notifier: TestNotifier;

beforeAll(async () => {
  browser = await launch({
    headless: true,
  });
  page = await browser.newPage();
  server = await initFrontendServer(TEST_PORT);
  await page.goto('http://localhost:' + TEST_PORT);
});

afterAll(async () => {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
});

beforeEach(async () => {
  notifier = new TestNotifier();
  reqMocker = new RequestMocker(notifier, page, 100);
  await reqMocker.init();
  await page.evaluate(() => {
    document.body.innerHTML = '';
  });
});

async function mock() {
  return reqMocker.mock('https://example.org', 'GET', '/foo');
}

async function callAPI() {
  return await page.evaluate(async () => {
    const res = await fetch('https://example.org/foo');
    return res.json();
  });
}

it('should mock request successfully', async () => {
  const req = await mock();
  req.respond(count => {
    return {
      status: 200,
      json: { ok: true },
    };
  });
  expect(await callAPI()).toEqual({ ok: true });
  expect(notifier.actions).toEqual([
    'Processing request "GET https://example.org/foo"',
    {
      text: 'Return response for "GET https://example.org/foo"',
      data: { status: 200, body: { ok: true } },
    },
  ]);
});

it('should mock multiple request successfully', async () => {
  const req = await mock();
  req.respond(count => {
    return {
      status: 200,
      json: { count },
    };
  });
  expect(await callAPI()).toEqual({ count: 1 });
  expect(await callAPI()).toEqual({ count: 2 });
});

it('should mock request successfully with defer', async () => {
  const req = await mock();
  const defer = reqMocker.createDefer();
  req.respond(count => {
    return { defer, status: 200, json: { ok: true } };
  });
  const call = callAPI();
  defer.resolve();
  expect(await call).toEqual({ ok: true });
});

it('expectToBeCalled success', async () => {
  const req = await mock();
  req.respond(count => {
    return {
      status: 200,
      json: { ok: true },
    };
  });
  setTimeout(callAPI, 20);
  await req.expectToBeCalled(1);
});

it('expectToBeCalled error', async () => {
  const req = await mock();
  req.respond(count => {
    return {
      status: 200,
      json: { ok: true },
    };
  });
  await expect(req.expectToBeCalled(1)).rejects.toThrow(
    'Expected "GET https://example.org/foo" to be called 1 times, but was called 0 times.'
  );
});

it('should block', async () => {
  const req = await mock();
  req.respond(count => {
    return {
      status: 200,
      json: { ok: true },
    };
  });
  req.block();
  await callAPI().catch(() => null);
  await expect(req.expectToBeCalled(1)).rejects.toThrow(
    'The request "GET https://example.org/foo" was not allowed to be invoked yet.'
  );
});

it('should block and unblock', async () => {
  const req = await mock();
  req.respond(count => {
    return {
      status: 200,
      json: { ok: true },
    };
  });
  req.block();
  req.unblock();
  await callAPI();
  await req.expectToBeCalled(1);
});
