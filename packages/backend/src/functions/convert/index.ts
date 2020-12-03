import {
  ApiGatewayEvent,
  apiGatewayLambda,
  ApiGatewayResponse,
} from "@bgpc/aws-serverless-toolkit";
import { appUrl } from "../../config/app-url";
import { getData } from "./helpers/get-data";

async function main(event: ApiGatewayEvent): Promise<ApiGatewayResponse> {
  const short = event?.pathParameters?.short;
  if (!short) throw "";
  const { to, amount, token, memo } = await getData(short);
  return ({
    statusCode: 301,
    headers: {
      Location: `${appUrl}?to=${to}${amount ? `&amount=${amount}` : ""}${
        token ? `&token=${token}` : ""
      }${memo ? `&memo=${memo}` : ""}`,
    },
  } as unknown) as ApiGatewayResponse;
}

export const handler = apiGatewayLambda(main);
