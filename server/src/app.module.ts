import * as path from 'path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { NgDomain } from './entities/ng-domain';

/** Neo's Hatebu Server */
@Module({
  imports: [
    // TypeORM : https://docs.nestjs.com/techniques/database
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: path.resolve(__dirname, '../db/neos-hatebu.sqlite3.db'),
      entities: [
        NgDomain
      ],
      synchronize: true
    }),
    // Repository を使えるようにする
    TypeOrmModule.forFeature([
      NgDomain
    ])
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
