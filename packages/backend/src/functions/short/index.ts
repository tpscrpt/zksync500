import {
  ApiGatewayEvent,
  apiGatewayLambda,
  ApiGatewayResponse,
  decodeBody,
  given,
  success,
} from "@bgpc/aws-serverless-toolkit";
import { shortTests } from "./tests";
import { ShortBody, ShortPayload } from "./types";
import { saveShort } from "./helpers/save-short";
import { createShort } from "./helpers/create-short";

async function main(event: ApiGatewayEvent): Promise<ApiGatewayResponse> {
  const body = decodeBody<ShortBody>(event.body);
  if (given(body, shortTests)) {
    const { amount, to, token, memo } = body;
    if ((amount && !token) || (!amount && token)) throw {};
    const short = createShort();
    await saveShort({ amount, to, token, short, memo });
    return success<ShortPayload>({ short });
  }
}

export const handler = apiGatewayLambda(main);
