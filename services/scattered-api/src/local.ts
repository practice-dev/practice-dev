import express from 'express';
import http from 'http';
import { routes } from './lambda';

const app = express();

routes.forEach(route => {
  app[route.method](route.path, async (req, res) => {
    try {
      const ret = await route.handler(
        {
          body: req.body,
          headers: {},
          queryStringParameters: {},
          isBase64Encoded: false,
          requestContext: {
            http: {
              method: req.method,
              path: req.path,
            },
            requestId: 'local',
          },
        },
        req.params
      );
      res.json(ret);
    } catch (e) {
      console.error(e);
      res.status(e.status ?? 500);
      res.json({
        error: e.message,
        stack: e.stack.split('\n'),
      });
    }
  });
});

http.createServer(app).listen(4000, () => {
  console.log('listening on 4000');
});
