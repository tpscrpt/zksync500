export const nodeEnv = process.env.NODE_ENV;
if (!nodeEnv) throw "Missing NODE_ENV";
