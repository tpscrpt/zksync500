import { deploySalt } from "./deploy-salt";
import { nodeEnv } from "./node-env";

export const tables = {
  ShortTable: {
    TableName: `ShortTable-${nodeEnv}-${deploySalt}`,
  },
};
