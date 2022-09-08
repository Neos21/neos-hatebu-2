import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { Express } from 'express';
import * as expressListEndpoints from 'express-list-endpoints';

import { cyan, green, grey, red, yellow } from './common/utils/colour-logger';

import { AppModule } from './app.module';

/** サーバ起動 */
async function bootstrap(): Promise<void> {
  const logger = new Logger(bootstrap.name);
  
  const app = await NestFactory.create(AppModule);
  app.enableCors({  // CORS を有効にする : https://github.com/expressjs/cors#configuration-options
    origin: (/localhost/),  // `localhost` を全て許可するため正規表現を使っている
    methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Headers, Access-Control-Allow-Credentials',
    credentials: true  // `Access-Control-Allow-Credentials` を許可する
  });
  const port = app.get<ConfigService>(ConfigService).get<number>('port')!;
  await app.listen(port);
  
  // List Routes : https://qiita.com/18kondo/items/1b9793e67b320f640ddd
  const router: Express = app.getHttpServer()._events.request._router;
  const endpoints: Array<expressListEndpoints.Endpoint> = expressListEndpoints(router);
  // 最長のパスに合わせて整形する
  const longestPathLength = Math.max(...endpoints.map((endpoint) => endpoint.path.length));
  // メソッド別に色別けする : https://github.com/mathieutu/vue-cli-plugin-express/blob/master/src/utils/routeTable.js
  const methodsColourFunctions: { [key: string]: (text: string) => string; } = {
    'GET'    : green,
    'POST'   : cyan,
    'PUT'    : yellow,
    'PATCH'  : yellow,
    'DELETE' : red,
    'OPTIONS': grey
  };
  const methodsOrders = Object.keys(methodsColourFunctions);
  const prepareMethods = (methods: Array<string>): string => methods
    .sort((methodA, methodB) => methodsOrders.indexOf(methodA) - methodsOrders.indexOf(methodB))  // Sort By `methodsOrders`
    .map((method) => {
      const colourFunction: (text: string) => string | undefined = methodsColourFunctions[method];
      return colourFunction ? colourFunction(method) : method;
    })
    .join(', ');
  
  // 起動ログ
  logger.log(cyan(`Server started at port [`) + yellow(`${port}`) + cyan(']'));
  logger.log(`${yellow('Routes :')}\n` + endpoints.map((endpoint) => `    - ${endpoint.path.padEnd(longestPathLength, ' ')} : ${prepareMethods(endpoint.methods)}`).sort().join('\n'));
}
void bootstrap(); // 意図的に `await` しないことを示す `void` : https://github.com/typescript-eslint/typescript-eslint/blob/v5.36.0/packages/eslint-plugin/docs/rules/no-floating-promises.md#ignorevoid
