import { TestConfiguration, Tester } from '@pvd/tester';
import { RequestMocker } from '@pvd/tester/src/RequestMocker';
import { TesterPage } from '@pvd/tester/src/TesterPage';

const BASE_URL = 'https://scattered-api.pvd-api.dev';

async function _mockProducts(
  requestMock: RequestMocker,
  ids: string[],
  defer?: any
) {
  const req = requestMock.mock(BASE_URL, 'GET', '/products');
  await req.respond(() => {
    return {
      status: 200,
      defer,
      json: ids,
    };
  });
  return req;
}

async function _mockProduct(
  requestMock: RequestMocker,
  data: { id: string; name: string; tags: string[] },
  defer?: any
) {
  const req = requestMock.mock(BASE_URL, 'GET', '/products/' + data.id);
  await req.respond(() => {
    return {
      status: 200,
      defer,
      json: data,
    };
  });
  return req;
}

async function _mockProductTag(
  requestMock: RequestMocker,
  data: { id: string; tagId: string; productId: string },
  defer?: any
) {
  const req = requestMock.mock(BASE_URL, 'GET', '/product-tags/' + data.id);
  await req.respond(() => {
    return {
      status: 200,
      defer,
      json: data,
    };
  });
  return req;
}

async function _mockTag(
  requestMock: RequestMocker,
  data: { id: string; name: string },
  defer?: any
) {
  const req = requestMock.mock(BASE_URL, 'GET', '/tags/' + data.id);
  await req.respond(() => {
    return {
      status: 200,
      defer,
      json: data,
    };
  });
  return req;
}

async function _getDefaultRequests(
  requestMock: RequestMocker,
  deferMap: Record<string, any> = {}
) {
  return [
    // 0
    await _mockProducts(requestMock, ['p1', 'p2'], deferMap.products),
    // 1
    await _mockProduct(
      requestMock,
      {
        id: 'p1',
        name: 'book',
        tags: ['pt1', 'pt2', 'pt3'],
      },
      deferMap.p1
    ),
    // 2
    await _mockProductTag(
      requestMock,
      {
        id: 'pt1',
        tagId: 't1',
        productId: 'p1',
      },
      deferMap.pt1
    ),
    // 3
    await _mockProductTag(
      requestMock,
      {
        id: 'pt2',
        tagId: 't2',
        productId: 'p1',
      },
      deferMap.pt2
    ),
    // 4
    await _mockProductTag(
      requestMock,
      {
        id: 'pt3',
        tagId: 't3',
        productId: 'p1',
      },
      deferMap.pt3
    ),
    // 5
    await _mockTag(
      requestMock,
      {
        id: 't1',
        name: 'tag 1',
      },
      deferMap.t1
    ),
    // 6
    await _mockTag(
      requestMock,
      {
        id: 't2',
        name: 'tag 2',
      },
      deferMap.t2
    ),
    // 7
    await _mockTag(
      requestMock,
      {
        id: 't3',
        name: 'tag 3',
      },
      deferMap.t3
    ),
  ];
}

async function _reload(tester: Tester) {
  const page = await tester.getPage();
  await page.reload();
  await page.expectToMatch('@result', 'No Result');
  return page;
}

async function _clickAndCancel(
  page: TesterPage,
  waitFor?: () => Promise<void>
) {
  await page.click('@fetch-btn');
  await page.expectToMatch('@fetch-btn', 'Cancel');
  if (waitFor) {
    await waitFor();
  }
  await page.click('@fetch-btn');
  await page.expectToMatch('@result', 'Canceled');
}

export default {
  handler({ tester, url }) {
    tester.test('navigate to page', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test('display data successfully', async () => {
      const page = await tester.getPage();
      await page.expectToMatch('@result', 'No Result');
      const requestMock = await page.enableRequestMocking();
      const requests = await _getDefaultRequests(requestMock);
      await page.click('@fetch-btn');
      await page.expectToMatch('@result', 'book: tag 1, tag 2, tag 3');
      for (const req of requests) {
        await req.expectToBeCalled(1);
      }
    });

    tester.test('display data successfully (no tags)', async () => {
      const page = await _reload(tester);
      const requestMock = await page.enableRequestMocking();

      const requests = [
        await _mockProducts(requestMock, ['p1', 'p2']),
        await _mockProduct(requestMock, {
          id: 'p1',
          name: 'book',
          tags: [],
        }),
      ];

      await page.click('@fetch-btn');
      await page.expectToMatch('@result', 'book: -');
      for (const req of requests) {
        await req.expectToBeCalled(1);
      }
    });

    tester.test('cancel on fetching GET /products', async () => {
      const page = await _reload(tester);
      const requestMock = await page.enableRequestMocking();
      const deferMap = {
        products: requestMock.createDefer(),
      };
      const requests = await _getDefaultRequests(requestMock, deferMap);
      await _clickAndCancel(page);
      deferMap.products.resolve();

      for (const req of requests.slice(0, 1)) {
        await req.expectToBeCalled(1);
        await req.expectToBeCancelled();
      }
      for (const req of requests.slice(1)) {
        await req.expectToBeCalled(0);
      }
    });

    tester.test('cancel on fetching GET /products/{id}', async () => {
      const page = await _reload(tester);
      const requestMock = await page.enableRequestMocking();
      const deferMap = {
        p1: requestMock.createDefer(),
      };
      const requests = await _getDefaultRequests(requestMock, deferMap);
      await _clickAndCancel(page, () => requests[0].expectToBeCalled(1));
      deferMap.p1.resolve();

      for (const req of requests.slice(0, 1)) {
        await req.expectToBeCalled(1);
      }
      for (const req of requests.slice(1, 2)) {
        await req.expectToBeCalled(1);
        await req.expectToBeCancelled();
      }
      for (const req of requests.slice(2)) {
        await req.expectToBeCalled(0);
      }
    });

    tester.test(
      'cancel on fetching GET /products-tags/{id} (cancel 3 of 3)',
      async () => {
        const page = await _reload(tester);
        const requestMock = await page.enableRequestMocking();
        const deferMap = {
          pt1: requestMock.createDefer(),
          pt2: requestMock.createDefer(),
          pt3: requestMock.createDefer(),
        };
        const requests = await _getDefaultRequests(requestMock, deferMap);
        await _clickAndCancel(page, async () => {
          await requests[2].expectToBeCalled(1);
          await requests[3].expectToBeCalled(1);
          await requests[4].expectToBeCalled(1);
        });
        deferMap.pt1.resolve();
        deferMap.pt2.resolve();
        deferMap.pt3.resolve();

        for (const req of requests.slice(0, 2)) {
          await req.expectToBeCalled(1);
        }
        for (const req of requests.slice(2, 5)) {
          await req.expectToBeCalled(1);
          await req.expectToBeCancelled();
        }
        for (const req of requests.slice(5)) {
          await req.expectToBeCalled(0);
        }
      }
    );

    tester.test(
      'cancel on fetching GET /products-tags/{id} (cancel 1 of 3)',
      async () => {
        const page = await _reload(tester);
        const requestMock = await page.enableRequestMocking();
        const deferMap = {
          pt3: requestMock.createDefer(),
        };
        const requests = await _getDefaultRequests(requestMock, deferMap);
        await _clickAndCancel(page, async () => {
          await requests[2].expectToBeCalled(1);
          await requests[3].expectToBeCalled(1);
        });
        deferMap.pt3.resolve();
        await requests[4].expectToBeCalled(1);
        await requests[4].expectToBeCancelled();
      }
    );

    tester.test(
      'cancel on fetching GET /tags/{id} (cancel 3 of 3)',
      async () => {
        const page = await _reload(tester);
        const requestMock = await page.enableRequestMocking();
        const deferMap = {
          t1: requestMock.createDefer(),
          t2: requestMock.createDefer(),
          t3: requestMock.createDefer(),
        };
        const requests = await _getDefaultRequests(requestMock, deferMap);
        await _clickAndCancel(page, async () => {
          await requests[2].expectToBeCalled(1);
          await requests[3].expectToBeCalled(1);
          await requests[4].expectToBeCalled(1);
        });
        deferMap.t1.resolve();
        deferMap.t2.resolve();
        deferMap.t3.resolve();

        for (const req of requests.slice(0, 5)) {
          await req.expectToBeCalled(1);
        }
        for (const req of requests.slice(5)) {
          await req.expectToBeCalled(1);
          await req.expectToBeCancelled();
        }
      }
    );

    tester.test(
      'cancel on fetching GET /tags/{id} (cancel 1 of 3)',
      async () => {
        const page = await _reload(tester);
        const requestMock = await page.enableRequestMocking();
        const deferMap = {
          t3: requestMock.createDefer(),
        };
        const requests = await _getDefaultRequests(requestMock, deferMap);
        await _clickAndCancel(page, async () => {
          await requests[5].expectToBeCalled(1);
          await requests[6].expectToBeCalled(1);
          await requests[7].expectToBeCalled(1);
        });
        deferMap.t3.resolve();
        await requests[7].expectToBeCalled(1);
        await requests[7].expectToBeCancelled();
      }
    );

    tester.test(
      'cancel on fetching GET /product/{id}, and fetch again',
      async () => {
        const page = await _reload(tester);
        const requestMock = await page.enableRequestMocking();
        const deferMap = {
          p100: requestMock.createDefer(),
        };
        const req = requestMock.mock(BASE_URL, 'GET', '/products');
        await req.respond(n => {
          if (n === 1) {
            return {
              status: 200,
              json: ['p100'],
            };
          } else {
            return {
              status: 200,
              json: ['p200'],
            };
          }
        });
        const p100Requests = [
          await _mockProduct(
            requestMock,
            {
              id: 'p100',
              name: 'car',
              tags: ['pt10'],
            },
            deferMap.p100
          ),
          await _mockProductTag(requestMock, {
            id: 'pt10',
            tagId: 't10',
            productId: 'p100',
          }),
          await _mockTag(requestMock, {
            id: 't10',
            name: 'red',
          }),
        ];
        const p200Requests = [
          await _mockProduct(
            requestMock,
            {
              id: 'p200',
              name: 'cup',
              tags: ['pt20'],
            },
            deferMap.p100
          ),
          await _mockProductTag(requestMock, {
            id: 'pt20',
            tagId: 't20',
            productId: 'p200',
          }),
          await _mockTag(requestMock, {
            id: 't20',
            name: 'red',
          }),
        ];
        await _clickAndCancel(page, async () => {
          await p100Requests[0].expectToBeCalled(1);
        });
        deferMap.p100.resolve();
        await page.expectToMatch('@fetch-btn', 'Fetch');
        await page.click('@fetch-btn');
        await page.expectToMatch('@result', 'cup: red');
        await p100Requests[0].expectToBeCalled(1);
        await p100Requests[0].expectToBeCancelled();
        await p100Requests[1].expectToBeCalled(0);
        await p100Requests[2].expectToBeCalled(0);

        await p200Requests[0].expectToBeCalled(1);
        await p200Requests[1].expectToBeCalled(1);
        await p200Requests[2].expectToBeCalled(1);
      }
    );
  },
} as TestConfiguration;
