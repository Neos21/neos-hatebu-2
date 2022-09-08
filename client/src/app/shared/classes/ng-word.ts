/** NG ワード */
export class NgWord {
  /** ID */
  public readonly id!: number;
  /** NG ワード */
  public readonly word!: string;
  
  constructor(partial: Partial<NgWord>) {
    Object.assign(this, partial);
  }
}
