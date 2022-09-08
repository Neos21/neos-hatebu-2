/** NG URL */
export class NgUrl {
  /** ID */
  public readonly id!: number;
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
  /** 登録日時 */
  public readonly createdAt!: string;
  
  constructor(partial: Partial<NgUrl>) {
    Object.assign(this, partial);
  }
}
