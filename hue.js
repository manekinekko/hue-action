const { setup } = require("./setup");
const { LightState } = require("node-hue-api").v3.lightStates;

exports.hue = async ({ clientId, clientSecret, authCode, lightId = 1 }) => {
  const api = await setup({
    clientId,
    clientSecret,
    authCode
  });

  async function fail() {
    const state = new LightState()
      .brightness(100)
      .saturation(100)
      .hue(0) // red
      .alertLong();
    return await api.lights.setLightState(lightId, state);
  }

  async function sucess() {
    const state = new LightState()
      .brightness(100)
      .saturation(100)
      .hue(25500) // green
      .alertLong();
    return await api.lights.setLightState(lightId, state);
  }
  return {
    sucess,
    fail
  };
};
