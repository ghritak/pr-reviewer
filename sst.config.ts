import { SSTConfig } from "sst";
import { WORKFLOWS } from "./stacks/WorkflowStack";

export default {
  config() {
    return {
      name: "crea-temp",
      region: "eu-central-1",
    };
  },
  stacks(app) {
    app.stack(WORKFLOWS);
  },
} satisfies SSTConfig;
