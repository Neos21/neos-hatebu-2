import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NgDomain } from '../entities/ng-domain';

import { NgDomainsController } from './ng-domains.controller';
import { NgDomainsService } from './ng-domains.service';

/** NG ドメインモジュール */
@Module({
  imports: [
    TypeOrmModule.forFeature([NgDomain])  // Repository を使えるようにする
  ],
  controllers: [NgDomainsController],
  providers: [NgDomainsService]
})
export class NgDomainsModule { }
