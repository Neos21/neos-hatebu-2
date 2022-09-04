import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Category } from './category';

/**
 * 記事
 * 
 * - 「はてなブックマーク」よりスクレイピングした内容を保持する
 * - 「NG URL」は別途定義しているため、本エンティティの個別レコードを更新・削除する機能は用意しない
 * - スクレイピング時、当該カテゴリの既存レコードを全て削除してから新規追加するので、レコードの更新は発生しない (必ず削除 → 新規追加)
 */
@Entity('entries')
export class Entry {
  /** ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;
  
  /** カテゴリ ID (`categories.id`) */
  @Column({ type: 'integer', name: 'category_id' })
  public categoryId: number;
  
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
  
  /** クロール日時 */
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;
  
  /** カテゴリ情報 (親) との親子関係を示す (カラムは作られない) */
  @ManyToOne((_type) => Category, (category) => category.entries, { createForeignKeyConstraints: false })  // eslint-disable-line @typescript-eslint/no-unused-vars
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })  // 本 `entries.category_id` が `categories.id` (親) の Foreign Key であることを示す
  public category: Category;
  
  constructor(partial: Partial<Entry>) {
    Object.assign(this, partial);
  }
}
