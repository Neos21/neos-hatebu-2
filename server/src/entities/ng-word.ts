import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * NG ワード
 * 
 * - API 経由で新規追加と削除を行えるようにする (個別レコードの更新処理は用意しない)
 */
@Entity('ng_words')
export class NgWord {
  /** ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;
  
  /** NG ワード */
  @Column({ type: 'text', name: 'word' })
  public word: string;
  
  constructor(partial: Partial<NgWord>) {
    Object.assign(this, partial);
  }
}
