import { Request } from 'express';
import { CORRELATIONID } from '../common/constants';
import hideOrOmitDeep from './hideOrOmitFields';

type RequestInfo = {
  method: string;
  url: string;
  query: Record<string, any>;
  body: any;
  params: any;
  headers: Record<string, any>;
  correlationId: string;
};

function getRequestInfo(request: Request): RequestInfo {
  return {
    method: request.method,
    url: request.url,
    query: request.query,
    body: hideOrOmitDeep(request.body, ['password']),
    params: request.params,
    headers: request.headers,
    correlationId: request.headers[CORRELATIONID] as string,
  };
}
export default getRequestInfo;
