import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * NG ドメイン
 * 
 * - API 経由で新規追加と削除を行えるようにする (個別レコードの更新処理は用意しない)
 */
@Entity('ng_domains')
export class NgDomain {
  /** ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;
  
  /** NG ドメイン */
  @Column({ type: 'text', name: 'domain' })
  public domain: string;
  
  constructor(partial: Partial<NgDomain>) {
    Object.assign(this, partial);
  }
}
