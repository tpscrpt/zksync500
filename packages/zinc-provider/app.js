const { contractAddress } = process.env;
const { execSync } = require("child_process");

module.exports.handler = async function (event) {
  console.log(event);
  const { method, payload } = event;

  switch (method) {
    case "convert":
      console.log(payload.short);
      execSync("zargo --version");
      break;
    case "short":
      break;
  }
};
