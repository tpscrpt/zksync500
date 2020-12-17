import { UrlParams } from "./types";

export function getUrlParams(): UrlParams {
  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams);
  const short = urlParams.get("¤") ?? urlParams.get("$") ?? undefined;
  return { short };
}
