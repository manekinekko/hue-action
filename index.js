const core = require("@actions/core");
const github = require("@actions/github");
const fetch = require("node-fetch");

require("dotenv").config();

(async function() {
  try {
    const hueWebhook = core.getInput("hueWebhook");
    const lightId = core.getInput("hueLightId");

    console.log({
      hueWebhook,
      lightId
    });

    const res = await (
      await fetch(hueWebhook, {
        method: "POST",
        body: JSON.stringify({
          lightId,
          status: "success"
        })
      })
    ).json();

    console.log(res);

    core.sucess();

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
