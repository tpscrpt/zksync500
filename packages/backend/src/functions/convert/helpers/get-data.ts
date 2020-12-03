import { ddb } from "../../../common/ddb";
import { tables } from "../../../config/tables";

type R = {
  to: string;
  amount?: string;
  token?: string;
  memo?: string;
};

export async function getData(short: string): Promise<R> {
  const response = await ddb
    .get({
      TableName: tables.ShortTable.TableName,
      Key: {
        short,
      },
    })
    .promise();

  if (!response.Item) throw "";
  return response.Item as R;
}
