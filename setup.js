const v3 = require("node-hue-api").v3;
const fs = require("fs");
const APP_ID = "hueaction";
const DEVICE_ID = "hueaction";

const generateState = () =>
  new Date().getTime().toString(36) + Math.random().toString(36);
const readStoredAccessCode = (file = "./.hue/access.txt") =>
  (fs.existsSync(file) && fs.readFileSync(file).toString()) || null;
const readStoredAccessTokens = (file = "./.hue/tokens.json") =>
  (fs.existsSync(file) && require(file)) || null;

exports.setup = async ({ clientId, clientSecret, authCode }) => {
  const remoteBootstrap = v3.api.createRemote(clientId, clientSecret);
  const storedTokens = readStoredAccessTokens();
  const storedAccessCode = authCode && readStoredAccessCode();
  let api = null;
  if (storedTokens) {
    // 2nd access
    api = await accessWithTokens({
      accessToken: storedTokens.tokens.access.value,
      refreshToken: storedTokens.tokens.refresh.value,
      remoteBootstrap
    });
  } else {
    if (storedAccessCode) {
      // 1st access
      api = accessWithCode({ storedAccessCode, remoteBootstrap });
    } else {
      printIntructions({ remoteBootstrap, remoteBootstrap });
    }
  }

  return api;
};

function printIntructions({ remoteBootstrap }) {
  console.log("**************************************************************");
  console.log(
    `You need to generate an authorization code for your application using this URL:`
  );
  console.log(
    `${remoteBootstrap.getAuthCodeUrl(DEVICE_ID, APP_ID, generateState())}`
  );
  console.log("**************************************************************");
}

async function accessWithCode({ accessCode, remoteBootstrap }) {
  let api;
  let remoteCredentials;
  try {
    api = await remoteBootstrap.connectWithCode(accessCode);
    console.log(
      "Successfully validated authorization code and exchanged for tokens"
    );
    remoteCredentials = api.remote.getRemoteAccessCredentials();
    fs.writeFileSync(
      "./tokens.json",
      JSON.stringify(remoteCredentials, null, 2)
    );
  } catch (error) {
    console.error(
      "Failed to get a remote connection using authorization code."
    );
    console.error(error);
    process.exit(1);
  }

  return remoteCredentials;
}

async function accessWithTokens({
  accessToken,
  refreshToken,
  username,
  remoteBootstrap
}) {
  let api;
  try {
    api = await remoteBootstrap.connectWithTokens(
      accessToken,
      refreshToken,
      username
    );
    console.log("Successfully connected using the existing OAuth tokens.");
  } catch (error) {
    console.error("Failed to get a remote connection using existing tokens.");
    console.error(error);
    process.exit(1);
  }

  return api;
}
