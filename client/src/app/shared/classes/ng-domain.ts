/** NG ドメイン */
export class NgDomain {
  /** ID */
  public readonly id!: number;
  /** NG ドメイン */
  public readonly domain!: string;
  
  constructor(partial: Partial<NgDomain>) {
    Object.assign(this, partial);
  }
}
