import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { Express } from 'express';
import * as expressListEndpoints from 'express-list-endpoints';

import { AppModule } from './app.module';

/** サーバ起動 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  
  // List Routes : https://qiita.com/18kondo/items/1b9793e67b320f640ddd
  const router: Express = app.getHttpServer()._events.request._router;  // eslint-disable-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const endpoints: Array<expressListEndpoints.Endpoint> = expressListEndpoints(router);
  
  // NestJS のロガー `cli-colors.util.js` を参照
  const isColourAllowed = (): boolean => !process.env.NO_COLOR;
  const colourIfAllowed = (colourFunction: (text: string) => string) => (text: string) => isColourAllowed() ? colourFunction(text) : text;
  const green  = colourIfAllowed((text) => `\x1B[32m${text}\x1B[39m`);
  const cyan   = colourIfAllowed((text) => `\x1B[96m${text}\x1B[39m`);
  const yellow = colourIfAllowed((text) => `\x1B[33m${text}\x1B[39m`);
  const red    = colourIfAllowed((text) => `\x1B[31m${text}\x1B[39m`);
  const grey   = colourIfAllowed((text) => `\x1B[37m${text}\x1B[39m`);
  
  // 最長のパスに合わせて整形する
  const longestPathLength = Math.max(...endpoints.map((endpoint) => endpoint.path.length));
  // メソッド別に色別けする : https://github.com/mathieutu/vue-cli-plugin-express/blob/master/src/utils/routeTable.js 参考
  const methodsColourFunctions = {
    'GET'    : green,
    'POST'   : cyan,
    'PUT'    : yellow,
    'PATCH'  : yellow,
    'DELETE' : red,
    'OPTIONS': grey
  } as { [key: string]: (text: string) => string; };
  const prepareMethods = (methods: Array<string>): string => methods.map((method) => {
    const colourFunction: (text: string) => string | undefined = methodsColourFunctions[method];
    return colourFunction ? colourFunction(method) : method;
  }).join(', ');  // TODO : Sort By Method Name?
  // ルーティング一覧
  Logger.log(`${yellow('[Routes]')}\n` + endpoints.map((endpoint) => `    - ${endpoint.path.padEnd(longestPathLength, ' ')} : ${prepareMethods(endpoint.methods)}`).sort().join('\n'));
}
void bootstrap(); // 意図的に `await` しないことを示す `void` : https://github.com/typescript-eslint/typescript-eslint/blob/v5.36.0/packages/eslint-plugin/docs/rules/no-floating-promises.md#ignorevoid
