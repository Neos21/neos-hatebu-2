import { Entry } from './entry';

/** カテゴリ */
export class Category {
  /** ID */
  public id: number;
  /** カテゴリ名 */
  public name: string;
  /** RSS URL */
  public rssUrl: string;
  /** ページ URL */
  public pageUrl: string;
  /** 最終クロール日時 */
  public updatedAt: string;
  
  /** 紐付くエントリ一覧 */
  public entries: Array<Entry>;
  /** フィルタ済のエントリ一覧 */
  public entryCount: number;
  
  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
}
