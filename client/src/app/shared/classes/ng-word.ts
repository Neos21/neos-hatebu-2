/** NG ワード */
export class NgWord {
  /** ID */
  public id: number;
  /** NG ワード */
  public word: string;
  
  constructor(partial: Partial<NgWord>) {
    Object.assign(this, partial);
  }
}
