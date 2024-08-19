import { StackContext, Config, Api } from "sst/constructs";

import { Workflows } from "@cloudifybiz/lighthouse-connectors/constructs/workflows";

export function WORKFLOWS({ stack, app }: StackContext) {
  const LH_HANDLER_URL = new Config.Secret(stack, "LH_HANDLER_URL");

  const TRPC_URL = new Config.Parameter(stack, "TRPC_URL", {
    value: "https://trpc.beta.app.cloudify.biz",
  });

  const workflows = new Workflows({ stack, app }, "workflows", {
    defaults: {
      function: {
        bind: [TRPC_URL, LH_HANDLER_URL],
        timeout: 60,
        runtime: "nodejs18.x",
      },
    },
    trpcUrl: TRPC_URL.value,
    routes: [],
  });

  const sqsApi = new Api(stack, "sqsApi", {
    routes: {
      "POST /updateSOTrackInfoSQS":
        "packages/functions/src/handlers/updateSOTrackInfo/sqs.handler",
      "POST /noerstogoFlowsSQS":
        "packages/functions/src/handlers/noerstogoFlows/sqs.handler",
    },
    defaults: {
      function: {
        bind: [LH_HANDLER_URL],
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: workflows.api?.url,
    ...workflows.triggerLinks,
    SQSEndpoint: sqsApi.url,
  });
}
