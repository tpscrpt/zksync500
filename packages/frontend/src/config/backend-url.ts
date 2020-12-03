export const backendUrl = `${
  process.env.NODE_ENV === "development" ? "https://cors-anywhere.herokuapp.com/" : ""
}https://kj5lozmakb.execute-api.us-west-2.amazonaws.com/prod`;
