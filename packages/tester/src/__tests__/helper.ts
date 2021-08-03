import http from 'http';

export function getBody(req: http.IncomingMessage) {
  const body: any[] = [];
  return new Promise((resolve, reject) => {
    req
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        const str = Buffer.concat(body).toString();
        try {
          resolve(JSON.parse(str));
        } catch (e) {
          reject(new Error('Invalid JSON'));
        }
      })
      .on('error', reject);
  });
}

export async function initFrontendServer(port: number, getHtml?: () => string) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    res.write(`<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
${getHtml ? getHtml() : ''}
</body>
</html>
  `);
    res.end();
  });
  await new Promise<void>(resolve => server.listen(port, resolve));
  return server;
}

export const TEST_PORT = 6899;
