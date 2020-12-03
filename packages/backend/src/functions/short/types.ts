type AmountAndToken = { amount: string; token: string };

export type ShortBody = (AmountAndToken | Partial<AmountAndToken>) & {
  to: string;
  amount: string;
  token: string;
  memo: string;
};

export type ShortPayload = {
  short: string;
};
