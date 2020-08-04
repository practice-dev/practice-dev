import * as R from 'remeda';
import { APIHttpEvent } from '@pvd/types/src/aws';

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message);
  }
}

interface Tag {
  id: string;
  name: string;
}

interface ProductTag {
  id: string;
  tagId: string;
  productId: string;
}

interface Product {
  id: string;
  name: string;
  tags: ProductTag[];
}

const tags: Tag[] = [
  {
    id: 'b9f05346-ff6e-47e4-bff6-6a4ab7250874',
    name: 'popular',
  },
  {
    id: '57cb15fb-80e5-480f-b144-5b4991bec3a6',
    name: 'red',
  },
  {
    id: '7ed5551c-d004-4102-a665-1c930828dad9',
    name: 'expensive',
  },
  {
    id: '8139b979-7f6e-4eb1-b74f-6448e2376e71',
    name: 'cheap',
  },
];

const products: Product[] = [
  {
    id: '8ff1350f-3ca1-4da0-b2fa-a30ba2a01b7e',
    name: 'car',
    tags: [
      {
        id: 'fad1a2cc-6805-4bf6-bc52-af59d09b7473',
        tagId: 'b9f05346-ff6e-47e4-bff6-6a4ab7250874',
        productId: '8ff1350f-3ca1-4da0-b2fa-a30ba2a01b7e',
      },
      {
        id: '8217c248-a385-48f8-b430-577f42cd034c',
        tagId: '57cb15fb-80e5-480f-b144-5b4991bec3a6',
        productId: '8ff1350f-3ca1-4da0-b2fa-a30ba2a01b7e',
      },
      {
        id: 'a242508b-6db5-421e-928d-00aee0cab8c0',
        tagId: '7ed5551c-d004-4102-a665-1c930828dad9',
        productId: '8ff1350f-3ca1-4da0-b2fa-a30ba2a01b7e',
      },
    ],
  },
  {
    id: 'b7e7007c-2253-45b6-899f-3a8e137b7031',
    name: 'bike',
    tags: [
      {
        id: '644cbc1b-7ade-418a-9689-07b640c447ce',
        tagId: 'b9f05346-ff6e-47e4-bff6-6a4ab7250874',
        productId: 'b7e7007c-2253-45b6-899f-3a8e137b7031',
      },
      {
        id: '8139b979-7f6e-4eb1-b74f-6448e2376e71',
        tagId: 'b6d21fa8-148c-4770-9b51-f5288e2e1c93',
        productId: 'b7e7007c-2253-45b6-899f-3a8e137b7031',
      },
    ],
  },
];

interface Route {
  path: string;
  method: 'get' | 'post';
  handler: (
    event: APIHttpEvent,
    params: Record<string, string>
  ) => Promise<object> | object;
}

const headers = {
  'Content-Type': 'application/json',
};

const routes: Route[] = [
  {
    method: 'get',
    path: '/products',
    handler() {
      return products.map(x => x.id);
    },
  },
  {
    method: 'get',
    path: '/products/:id',
    handler(_, params) {
      const product = products.find(x => x.id === params.id);
      if (!product) {
        throw new NotFoundError('Product not found with id = ' + params.id);
      }
      return {
        ...product,
        tags: product.tags.map(x => x.id),
      };
    },
  },
  {
    method: 'get',
    path: '/product-tags/:id',
    handler(_, params) {
      const productTag = R.pipe(
        products,
        R.flatMap(x => x.tags),
        R.find(x => x.id === params.id)
      );
      if (!productTag) {
        throw new NotFoundError('Product tag not found with id = ' + params.id);
      }
      return productTag;
    },
  },
  {
    method: 'get',
    path: '/tags/:id',
    handler(_, params) {
      const tag = tags.find(x => x.id === params.id);
      if (!tag) {
        throw new NotFoundError('Tag not found with id = ' + params.id);
      }
      return tag;
    },
  },
];

export async function handler(event: APIHttpEvent) {
  try {
    for (const route of routes) {
      if (
        route.method.toLowerCase() !==
        event.requestContext.http.method.toLowerCase()
      ) {
        continue;
      }
      const paramReg = /\:[a-zA-Z0-9_\-]+/g;
      const mappedPath = route.path.replace(
        paramReg,
        x => `(?<${x.substr(1)}>[a-zA-Z0-9_\\-]+)`
      );
      const reg = new RegExp(`^${mappedPath}$`);
      const exec = reg.exec(event.requestContext.http.path);
      if (!exec) {
        continue;
      }
      const body = await route.handler(event, exec.groups ?? {});
      return {
        statusCode: 200,
        body: JSON.stringify(body),
        headers,
      };
    }
    throw new NotFoundError('Route not found');
  } catch (e) {
    return {
      statusCode: e.status ?? 500,
      body: JSON.stringify({ error: e.message }),
      headers,
    };
  }
}
