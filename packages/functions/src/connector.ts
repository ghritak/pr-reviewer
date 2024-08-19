import { Config } from "sst/node/config";

import { Connector } from "@cloudifybiz/lighthouse-connectors";

export default new Connector(Config.SERVICE_KEY, Config.TRPC_URL);
