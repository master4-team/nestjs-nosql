import { Request } from 'express';
import hideOrRemoveField from './hideOrRemoveField';

function getRequestInfo(request: Request) {
  return {
    method: request.method,
    url: request.url,
    query: request.query,
    body: hideOrRemoveField(request.body, 'password'),
    params: request.params,
    headers: request.headers,
    correlationId: request.headers['x-correlation-id'],
  };
}
export default getRequestInfo;
