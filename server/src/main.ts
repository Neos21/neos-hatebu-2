import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

/** サーバ起動 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
void bootstrap(); // 意図的に `await` しないことを示す `void` : https://github.com/typescript-eslint/typescript-eslint/blob/v5.36.0/packages/eslint-plugin/docs/rules/no-floating-promises.md#ignorevoid
