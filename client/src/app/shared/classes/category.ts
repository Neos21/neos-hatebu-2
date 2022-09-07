import { Entry } from './entry';

/** カテゴリ */
export class Category {
  /** ID */
  public readonly id!: number;
  /** カテゴリ名 */
  public readonly name!: string;
  /** RSS URL */
  public readonly rssUrl!: string;
  /** ページ URL */
  public readonly pageUrl!: string;
  /** 最終クロール日時 */
  public readonly updatedAt!: string;
  
  /** 紐付くエントリ一覧 */
  public entries!: Array<Entry>;
  
  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
}
