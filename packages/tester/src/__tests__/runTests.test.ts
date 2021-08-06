process.env.DEFAULT_WAIT_TIME = '100';

import http from 'http';
import { TestConfiguration, Notifier } from '../types';
import { runTests } from '../runTests';
import { TesterSocketMessage } from '@pvd/types';
import { initFrontendServer, TEST_PORT } from './helper';

class TestNotifier implements Notifier {
  messages: any[] = [];
  async flush() {
    this.messages.push('flush');
  }

  async notify(action: TesterSocketMessage) {
    this.messages.push(action);
  }
}

describe('frontend single page', () => {
  let html = '';
  let server: http.Server;
  let testConfig: TestConfiguration;

  beforeAll(async () => {
    server = await initFrontendServer(TEST_PORT, () => html);
  });

  afterAll(async () => {
    await new Promise(resolve => server.close(resolve));
  });

  beforeEach(() => {
    html = '';
    testConfig = {
      handler({ tester, url }) {
        tester.test('navigate to page', async () => {
          await tester.createPage();
          await tester.getPage().navigate(url);
        });

        tester.test('verify text', async () => {
          await tester.getPage().expectToMatch('@text', 'foo');
        });
      },
    };
  });

  it('all tests successfully', async () => {
    html = '<div data-test="text">foobar</div>';
    const notifier = new TestNotifier();
    await runTests(
      'mock',
      'http://localhost:' + TEST_PORT,
      testConfig,
      notifier
    );
    expect(notifier.messages).toMatchInlineSnapshot(`
Array [
  Object {
    "meta": Object {
      "submissionId": "mock",
    },
    "payload": Object {
      "tests": Array [
        Object {
          "id": 1,
          "name": "navigate to page",
          "result": "running",
          "steps": Array [],
        },
        Object {
          "id": 2,
          "name": "verify text",
          "result": "pending",
          "steps": Array [],
        },
      ],
    },
    "type": "TEST_INFO",
  },
  "flush",
  Object {
    "meta": Object {
      "submissionId": "mock",
    },
    "payload": Object {
      "testId": 1,
    },
    "type": "TEST_START",
  },
  Object {
    "meta": Object {
      "submissionId": "mock",
    },
    "payload": Object {
      "data": undefined,
      "testId": 1,
      "text": "Navigate to \\"http://localhost:6899\\"",
    },
    "type": "TEST_STEP",
  },
  Object {
    "meta": Object {
      "submissionId": "mock",
    },
    "payload": Object {
      "testId": 1,
    },
    "type": "TEST_PASS",
  },
  Object {
    "meta": Object {
      "submissionId": "mock",
    },
    "payload": Object {
      "testId": 2,
    },
    "type": "TEST_START",
  },
  Object {
    "meta": Object {
      "submissionId": "mock",
    },
    "payload": Object {
      "data": undefined,
      "testId": 2,
      "text": "Expect \\"[data-test=\\"text\\"]\\" to contain \\"foo\\"",
    },
    "type": "TEST_STEP",
  },
  Object {
    "meta": Object {
      "submissionId": "mock",
    },
    "payload": Object {
      "testId": 2,
    },
    "type": "TEST_PASS",
  },
  Object {
    "meta": Object {
      "submissionId": "mock",
    },
    "payload": Object {
      "success": true,
    },
    "type": "TEST_RESULT",
  },
  "flush",
]
`);
  });

  it('should fail', async () => {
    html = '<div data-test="text">abc</div>';
    const notifier = new TestNotifier();
    await runTests(
      'mock',
      'http://localhost:' + TEST_PORT,
      testConfig,
      notifier
    );
    expect(notifier.messages).toMatchInlineSnapshot(`
Array [
  Object {
    "meta": Object {
      "submissionId": "mock",
    },
    "payload": Object {
      "tests": Array [
        Object {
          "id": 1,
          "name": "navigate to page",
          "result": "running",
          "steps": Array [],
        },
        Object {
          "id": 2,
          "name": "verify text",
          "result": "pending",
          "steps": Array [],
        },
      ],
    },
    "type": "TEST_INFO",
  },
  "flush",
  Object {
    "meta": Object {
      "submissionId": "mock",
    },
    "payload": Object {
      "testId": 1,
    },
    "type": "TEST_START",
  },
  Object {
    "meta": Object {
      "submissionId": "mock",
    },
    "payload": Object {
      "data": undefined,
      "testId": 1,
      "text": "Navigate to \\"http://localhost:6899\\"",
    },
    "type": "TEST_STEP",
  },
  Object {
    "meta": Object {
      "submissionId": "mock",
    },
    "payload": Object {
      "testId": 1,
    },
    "type": "TEST_PASS",
  },
  Object {
    "meta": Object {
      "submissionId": "mock",
    },
    "payload": Object {
      "testId": 2,
    },
    "type": "TEST_START",
  },
  Object {
    "meta": Object {
      "submissionId": "mock",
    },
    "payload": Object {
      "data": undefined,
      "testId": 2,
      "text": "Expect \\"[data-test=\\"text\\"]\\" to contain \\"foo\\"",
    },
    "type": "TEST_STEP",
  },
  Object {
    "meta": Object {
      "submissionId": "mock",
    },
    "payload": Object {
      "error": "Expected \\"[data-test=\\"text\\"]\\" to include \\"foo\\". Actual: \\"abc\\".",
      "testId": 2,
    },
    "type": "TEST_FAIL",
  },
  Object {
    "meta": Object {
      "submissionId": "mock",
    },
    "payload": Object {
      "success": false,
    },
    "type": "TEST_RESULT",
  },
  "flush",
]
`);
  });
});
