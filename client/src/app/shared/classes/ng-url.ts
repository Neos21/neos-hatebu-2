/** NG URL */
export class NgUrl {
  /** ID */
  public readonly id!: number;
  /** 記事タイトル */
  public title!: string;
  /** 記事 URL */
  public url!: string;
  /** 記事本文抜粋 */
  public description!: string;
  /** ブクマ数 */
  public count!: string;
  /** 日時 */
  public date!: string;
  /** Favicon URL */
  public faviconUrl!: string;
  /** サムネイル URL */
  public thumbnailUrl!: string;
  /** 登録日時 */
  public readonly createdAt!: string;
  
  constructor(partial: Partial<NgUrl>) {
    Object.assign(this, partial);
  }
}
