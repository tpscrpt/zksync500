import { UrlParams } from "./types";

export function getUrlParams(): UrlParams {
  const urlParams = new URLSearchParams(window.location.search);
  const to = urlParams.get("to");
  const token = urlParams.get("token")
  const amount = urlParams.get("amount");
  return { to, token, amount }
}