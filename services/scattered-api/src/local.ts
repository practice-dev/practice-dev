import express from 'express';
import http from 'http';
import { handler } from './lambda';

const app = express();

app.use(async (req, res) => {
  try {
    const ret: any = await handler({
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
    });
    Object.keys(ret.headers ?? {}).forEach(key => {
      res.setHeader(key, ret.headers[key]);
    });
    res.status(ret.statusCode);
    if (ret.body) {
      res.end(ret.body);
    } else {
      res.end();
    }
  } catch (e) {
    console.error(e);
    res.status(e.status ?? 500);
    res.json({
      error: e.message,
      stack: e.stack.split('\n'),
    });
  }
});

http.createServer(app).listen(4000, () => {
  console.log('listening on 4000');
});
