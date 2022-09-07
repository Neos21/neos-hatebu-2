import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Entry } from './entry';

/**
 * カテゴリ
 * 
 * - `CategoriesService#onModuleInit()` にてサーバ起動時に本エンティティのレコード件数を確認し、0件の場合はマスタデータを投入する
 *   - 「はてなブックマーク」側のカテゴリ定義が変わった場合はマスタデータの変更も必要となり、その場合は恐らく他所の実装修正も必要になると思われるので
 *     本エンティティのデータ更新、削除の機能は用意しない
 * - `entries` のスクレイピング実行時に本エンティティの `updated_at` も更新する
 */
@Entity('categories')
export class Category {
  /** ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;
  
  /** カテゴリ名 */
  @Column({ type: 'text', name: 'name' })
  public name: string;
  
  /** RSS URL (RSS からのパース用・現状未使用) */
  @Column({ type: 'text', name: 'rss_url' })
  public rssUrl: string;
  
  /** ページ URL (Web ページからのスクレイピング用) */
  @Column({ type: 'text', name: 'page_url' })
  public pageUrl: string;
  
  /** 最終クロール日時 (Insert・Update 時に自動更新される) */
  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
  
  /** 記事情報 (子) との親子関係を示す (カラムは作られない) : `entry.categoryId` ではなく `@ManyToOne` で指定した `entry.category` と相互紐付けする */
  @OneToMany(() => Entry, (entry) => entry.category, { createForeignKeyConstraints: false })
  public entries: Array<Entry>;
  
  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
}
