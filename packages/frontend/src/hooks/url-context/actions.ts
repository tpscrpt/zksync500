import { UrlParams } from "./types";

export function getUrlParams(): UrlParams {
  const urlParams = new URLSearchParams(window.location.search);
  const short = urlParams.get("¤") ?? urlParams.get("$") ?? undefined;
  return { short };
}
