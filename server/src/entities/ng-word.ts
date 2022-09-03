import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** NG ワード */
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
