import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
  @Column({ type: 'text', name: 'updated_at' })
  public updatedAt: string;
  
  /** 記事情報 (子) との親子関係を示す (カラムは作られない) */
  @OneToMany((/* type */) => Entry, (entry) => entry.categoryId)
  public entries: Array<Entry>;
  
  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
}
