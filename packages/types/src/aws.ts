export interface APIHttpEvent {
  body: string | null;
  headers: { [name: string]: string };
  queryStringParameters?: { [name: string]: string };
  isBase64Encoded: boolean;
  requestContext: {
    http: { method: string; path: string };
    requestId: string;
  };
}
