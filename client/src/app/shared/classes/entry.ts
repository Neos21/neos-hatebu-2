/** 記事 */
export class Entry {
  /** ID */
  public id: number;
  /** カテゴリ ID (`categories.id`) */
  public categoryId: number;
  /** 記事タイトル */
  public title: string;
  /** 記事 URL */
  public url: string;
  /** 記事本文抜粋 */
  public description: string;
  /** ブクマ数 */
  public count: string;
  /** 日時 */
  public date: string;
  /** Favicon URL */
  public faviconUrl: string;
  /** サムネイル URL */
  public thumbnailUrl: string;
  /** クロール日時 */
  public createdAt: string;
  
  constructor(partial: Partial<Entry>) {
    Object.assign(this, partial);
  }
}
