import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** NG ドメイン */
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
