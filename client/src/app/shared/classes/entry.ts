/** 記事 */
export class Entry {
  /** ID */
  public readonly id!: number;
  /** カテゴリ ID (`categories.id`) */
  public readonly categoryId!: number;
  /** 記事タイトル */
  public readonly title!: string;
  /** 記事 URL */
  public readonly url!: string;
  /** 記事本文抜粋 */
  public readonly description!: string;
  /** ブクマ数 */
  public readonly count!: string;
  /** 日時 */
  public readonly date!: string;
  /** Favicon URL */
  public readonly faviconUrl!: string;
  /** サムネイル URL */
  public readonly thumbnailUrl!: string;
  /** クロール日時 */
  public readonly createdAt!: string;
  
  constructor(partial: Partial<Entry>) {
    Object.assign(this, partial);
  }
}
