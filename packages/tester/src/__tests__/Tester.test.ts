import http from 'http';
import { S } from '@pvd/schema';
import { Tester } from '../Tester';
import { getBody, TEST_PORT } from './helper';
import { TestNotifier } from './TestNotifier';

let tester: Tester;
let notifier: TestNotifier;

beforeEach(() => {
  notifier = new TestNotifier();
  tester = new Tester(notifier, async () => {
    throw new Error('Cannot create page');
  });
});

describe('api', () => {
  let server: http.Server;
  let handler: (
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) => Promise<void> | void;

  beforeAll(async () => {
    server = http.createServer(async (req, res) => {
      if (handler) {
        handler(req, res);
      } else {
        res.writeHead(404);
        res.end();
      }
    });
    await new Promise<void>(resolve => server.listen(TEST_PORT, resolve));
  });

  afterAll(done => {
    server.close(done);
  });

  beforeEach(() => {
    handler = null!;
    tester.setBaseApiUrl('http://localhost:' + TEST_PORT);
  });

  describe('makeRequest', () => {
    it('should make GET request', async () => {
      handler = (req, res) => {
        if (req.method === 'GET' && req.url === '/foo') {
          res.write(JSON.stringify({ test: 'foo' }));
          res.end();
        } else {
          res.writeHead(404);
          res.end();
        }
      };

      const [body, res] = await tester.makeRequest({
        method: 'GET',
        path: '/foo',
      });

      expect(res.statusCode).toEqual(200);
      expect(body).toEqual({ test: 'foo' });
      expect(notifier.actions).toMatchInlineSnapshot(`
        Array [
          "Make request 1 GET http://localhost:6899/foo",
          Object {
            "data": Object {
              "body": Object {
                "test": "foo",
              },
              "status": 200,
            },
            "text": "Response from request 1",
          },
        ]
      `);
    });

    it('should make POST request', async () => {
      handler = (req, res) => {
        if (req.method === 'POST' && req.url === '/foo') {
          getBody(req).then((body: any) => {
            res.write(
              JSON.stringify({
                ...body,
                foo: 'bar',
              })
            );
            res.end();
          });
        } else {
          res.writeHead(404);
          res.end();
        }
      };

      const [body, res] = await tester.makeRequest({
        method: 'POST',
        path: '/foo',
        body: { test: 'foo' },
      });

      expect(res.statusCode).toEqual(200);
      expect(body).toEqual({ test: 'foo', foo: 'bar' });
      expect(notifier.actions).toMatchInlineSnapshot(`
        Array [
          Object {
            "data": Object {
              "body": Object {
                "test": "foo",
              },
            },
            "text": "Make request 1 POST http://localhost:6899/foo",
          },
          Object {
            "data": Object {
              "body": Object {
                "foo": "bar",
                "test": "foo",
              },
              "status": 200,
            },
            "text": "Response from request 1",
          },
        ]
      `);
    });

    // this test causes
    // "Jest did not exit one second after the test run has completed."
    it('should throw error if cannot connect', async () => {
      tester.setBaseApiUrl('http://localhost:' + (TEST_PORT + 1));
      await expect(
        tester.makeRequest({
          method: 'GET',
          path: '/foo',
        })
      ).rejects.toThrow('Cannot connect to server: connect ECONNREFUSED');
    });
  });
});

describe('common', () => {
  describe('expectStatus', () => {
    it('should expect status correctly', async () => {
      await tester.expectStatus(
        {
          statusCode: 200,
        } as http.IncomingMessage,
        200
      );
      expect(notifier.actions).toEqual(['Expect status to equal "200"']);
    });

    it('should throw an error if status does not match', async () => {
      await expect(
        tester.expectStatus(
          {
            statusCode: 200,
          } as http.IncomingMessage,
          400
        )
      ).rejects.toThrow('Expected status to equal "400". Actual: "200".');
    });
  });

  describe('expectEqual', () => {
    it('should assert correctly', async () => {
      await tester.expectEqual({ foo: 'name' }, { foo: 'name' }, 'user');
      expect(notifier.actions).toEqual([
        'Expect "user" to equal "{"foo":"name"}"',
      ]);
    });

    it('should throw an error if does not match', async () => {
      await expect(
        tester.expectEqual({ foo: 'name' }, { foo: 'bar' }, 'user')
      ).rejects.toThrow(
        'Expected "user" to equal "{"foo":"bar"}". Actual: "{"foo":"name"}".'
      );
    });
  });

  describe('expectSchema', () => {
    it('should assert correctly', async () => {
      await tester.expectSchema(
        { isValid: true },
        S.object().keys({
          isValid: S.boolean(),
        }),
        'body',
        'ValidationResult'
      );
      expect(notifier.actions).toEqual([
        'Expect "body" to match "ValidationResult" schema.',
      ]);
    });

    it('should throw an error if does not match', async () => {
      await expect(
        tester.expectSchema(
          { foo: true },
          S.object().keys({
            isValid: S.boolean(),
          }),
          'body',
          'ValidationResult'
        )
      ).rejects.toThrow(
        "'body.isValid' is required. 'body.foo' is not allowed."
      );
    });
  });
});
