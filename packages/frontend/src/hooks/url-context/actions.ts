import { UrlParams } from "./types";

export function getUrlParams(): UrlParams {
  const urlParams = new URLSearchParams(window.location.search);
  const to = urlParams.get("to");
  const token = urlParams.get("token")
  const amount = urlParams.get("amount");
  const memo = urlParams.get("memo");
  return { to, token, amount, memo }
}