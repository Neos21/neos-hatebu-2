import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Entry } from './entry';

/** カテゴリ */
@Entity('categories')
export class Category {
  /** ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;
  
  /** カテゴリ名 */
  @Column({ type: 'text', name: 'name' })
  public name: string;
  
  /** RSS URL (RSS からのパース用) */
  @Column({ type: 'text', name: 'rss_url' })
  public rssUrl: string;
  
  /** ページ URL (Web ページからのスクレイピング用) */
  @Column({ type: 'text', name: 'page_url' })
  public pageUrl: string;
  
  /** 最終クロール日時 */
  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
  
  /** 記事情報 (子) との親子関係を示す (カラムは作られない) : `entry.categoryId` ではなく `@ManyToOne` で指定した `entry.category` と相互紐付けをする */
  @OneToMany((type) => Entry, (entry) => entry.category, { createForeignKeyConstraints: false })  // eslint-disable-line @typescript-eslint/no-unused-vars
  public entries: Array<Entry>;
  
  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
}
