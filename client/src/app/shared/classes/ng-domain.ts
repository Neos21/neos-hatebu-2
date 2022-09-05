/** NG ドメイン */
export class NgDomain {
  /** ID */
  public id: number;
  /** NG ドメイン */
  public domain: string;
  
  constructor(partial: Partial<NgDomain>) {
    Object.assign(this, partial);
  }
}
