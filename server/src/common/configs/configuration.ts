/**
 * 環境変数より文字列値を取得する・環境変数が存在しなければデフォルト値を使用する
 * 
 * @param envName 環境変数名
 * @param defaultValue デフォルト値
 * @return 値
 */
const getStringValue = (envName: string, defaultValue: string): string => {
  if(process.env[envName] == null || process.env[envName]?.trim() === '') {
    console.log(`configuration#getStringValue()  : Env [${envName}] is empty. Use default value [${defaultValue}]`);
    return defaultValue;
  }
  const stringValue = process.env[envName]!;  // eslint-disable-line @typescript-eslint/no-non-null-assertion
  console.log(`configuration#getStringValue()  : Env [${envName}] = [${stringValue}]`);
  return stringValue;
};

/**
 * 環境変数より値を取得し数値型で返す・環境変数が存在しないか数値型に変換できない場合はデフォルト値を使用する
 * 
 * @param envName 環境変数名
 * @param defaultValue デフォルト値
 * @return 値
 */
const getNumberValue = (envName: string, defaultValue: number): number => {
  if(process.env[envName] == null || process.env[envName]?.trim() === '') {
    console.log(`configuration#getNumberValue()  : Env [${envName}] is empty. Use default value [${defaultValue}]`);
    return defaultValue;
  }
  const rawValue = process.env[envName]!;  // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const numberValue = Number(rawValue);
  if(Number.isNaN(numberValue)) {
    console.log(`configuration#getNumberValue()  : Env [${envName}] value is NaN [${rawValue}]. Use default value [${defaultValue}]`);
    return defaultValue;
  }
  console.log(`configuration#getNumberValue()  : Env [${envName}] = [${numberValue}]`);
  return numberValue;
};

/**
 * 環境変数より値が設定されているか否かで Boolean 値を返す
 * 
 * @param envName 環境変数名
 * @return 当該環境変数に何らかの値が設定されていれば `true`・未定義であれば `false`
 */
const getBooleanValue = (envName: string): boolean => {
  const isTruthy = process.env[envName] != null;
  console.log(`configuration#getBooleanValue() : Env [${envName}] = [${isTruthy}]`);  // eslint-disable-line @typescript-eslint/restrict-template-expressions
  return isTruthy;
}

/** 環境変数のオブジェクトを返す : この関数内にオブジェクトを定義しないと環境変数が読み込まれない */
export default (): { [key: string]: string | number | boolean } => ({
  port              : getNumberValue ('NEOS_HATEBU_PORT'                 , 2323                        ),  // ポート番号
  userName          : getStringValue ('NEOS_HATEBU_USERNAME'             , 'CHANGE-THIS-USER-NAME'     ),  // ユーザ名   : 本当はエラーにすべきか
  password          : getStringValue ('NEOS_HATEBU_PASSWORD'             , 'CHANGE-THIS-PASSWORD'      ),  // パスワード : 本当はエラーにすべきか
  jwtSecretKey      : getStringValue ('NEOS_HATEBU_JWT_SECRET_KEY'       , 'CHANGE-THIS-JWT-SECRET-KEY'),  // JWT 秘密鍵 : 本当はエラーにすべきか
  jwtExpiresIn      : getStringValue ('NEOS_HATEBU_JWT_EXPIRES_IN'       , '7 days'                    ),  // JWT 有効期限
  removingNgUrlsDays: getNumberValue ('NEOS_HATEBU_REMOVING_NG_URLS_DAYS', 7                           ),  // `ng_urls` の保持期間 : 本日数以前のレコードを Cron Job で削除する
  noColour          : getBooleanValue('NO_COLOR'                                                       ),  // ロガーの色付けをしない : NestJS のロガー `cli-colors.util.js` と同じ環境変数名・確認のため宣言
});
