import * as React from "react";

export function inputHandler(
  setter: (val: string) => void,
): (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void {
  return (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setter(event.target.value);
}
