import { Config } from "sst/node/config";

import {
  Connector,
  HandlerContext as HandlerContextType,
  StepContext as StepContextType,
} from "@cloudifybiz/lighthouse-connectors";

const connector = new Connector(Config.SERVICE_KEY, Config.TRPC_URL);

const { apiHandler, config } = await connector.init({
  apps: {
    hubspot: {
      connectionId: 346,
      slug: "hubspot",
      version: "v3",
    },
    fortnox: {
      connectionId: 347,
      slug: "fortnox",
      version: "v3",
    },
  },
});

export type HandlerContext = HandlerContextType<typeof config>;

export type StepContext = StepContextType<typeof config>;

export { apiHandler, config };
