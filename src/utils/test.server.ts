import http from 'http';
import app from '../index';

export function createTestServer(): http.Server {
  return http.createServer(app).listen(3000);

}

