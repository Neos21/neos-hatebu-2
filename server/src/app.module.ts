import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

/** Neo's Hatebu Server */
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
