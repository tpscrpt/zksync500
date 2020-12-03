import { ddb } from "../../../common/ddb";
import { tables } from "../../../config/tables";

type P = {
  short: string;
  to: string;
  amount?: string;
  token?: string;
  memo?: string;
};

export async function saveShort({ to, amount, token, memo, short }: P): Promise<void> {
  await ddb
    .put({
      TableName: tables.ShortTable.TableName,
      Item: {
        to,
        amount,
        token,
        memo,
        short,
      },
    })
    .promise();
}
