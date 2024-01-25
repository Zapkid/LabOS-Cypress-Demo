import { defineConfig } from "cypress";

export default defineConfig({
  viewportHeight: 660,
  viewportWidth: 1000,
  defaultCommandTimeout: 10000,
  watchForFileChanges: false,
  e2e: {
    baseUrl: "https://qa-candidates.labos.cloud",
    setupNodeEvents(on, config) {},
  },
});
