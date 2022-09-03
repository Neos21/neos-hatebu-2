import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** NG URL : `title` ～ `thumbnail_url` カラムは `entries` テーブルと同じ */
@Entity('ng_urls')
export class NgUrl {
  /** ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;
  
  /** 記事タイトル */
  @Column({ type: 'text', name: 'title' })
  public title: string;
  
  /** 記事 URL */
  @Column({ type: 'text', name: 'url' })
  public url: string;
  
  /** 記事本文抜粋 */
  @Column({ type: 'text', name: 'description' })
  public description: string;
  
  /** ブクマ数 */
  @Column({ type: 'integer', name: 'count' })
  public count: string;
  
  /** 日時 */
  @Column({ type: 'text', name: 'date' })
  public date: string;
  
  /** Favicon URL */
  @Column({ type: 'text', name: 'favicon_url' })
  public faviconUrl: string;
  
  /** サムネイル URL */
  @Column({ type: 'text', name: 'thumbnail_url' })
  public thumbnailUrl: string;
  
  /** 登録日時 (一定期間後に削除するため) */
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;
  
  constructor(partial: Partial<NgUrl>) {
    Object.assign(this, partial);
  }
}
