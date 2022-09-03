import { Injectable } from '@nestjs/common';

/** App サービス */
@Injectable()
export class AppService {
  /**
   * API ルートを示すテキストを返す
   * 
   * @return テキスト
   */
  public getApiRoot(): string {
    return 'Neo\'s Hatebu API';
  }
}
