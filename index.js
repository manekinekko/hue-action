const core = require("@actions/core");
const github = require("@actions/github");
const { hue } = require("./hue");

require("dotenv").config();

(async function() {
  try {
    const clientId = core.getInput("hueClientId");
    const clientSecret = core.getInput("hueClientSecret");
    const lightId = core.getInput("hueLightId");
    const authCode = core.getInput("hueAuthCode");

    console.log({
      clientId,
      clientSecret,
      lightId,
      authCode
    });

    const api = hue({
      clientId,
      clientSecret,
      lightId,
      authCode
    });

    if (api) {
      const lightStatus = await api.sucess();
      core.setOutput("lightStatus", lightStatus);
    } else {
      console.error(api);
    }

    core.sucess();

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
