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

    const payload = github.context.jobs;
    console.log(`The event payload: ${payload}`);

    const res = await postHueAction({
      hueWebhook,
      lightId,
      status: "success"
    });
    core.setOutput("lightStatus", JSON.stringify(res));
  } catch (error) {
    core.setFailed(error.message);
  }
})();

async function postHueAction({ hueWebhook, lightId, status }) {
  return await (
    await fetch(hueWebhook, {
      method: "POST",
      body: JSON.stringify({
        lightId,
        status
      })
    })
  ).json();
}
