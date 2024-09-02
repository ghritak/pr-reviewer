import { StackContext, Config, Api } from "sst/constructs";

import { Workflows } from "@cloudifybiz/lighthouse-connectors/constructs/workflows";

export function WORKFLOWS({ stack, app }: StackContext) {
  const SERVICE_KEY = new Config.Secret(stack, "SERVICE_KEY");
  const LAMBDA_URL = new Config.Secret(stack, "LAMBDA_URL");

  const TRPC_URL = new Config.Parameter(stack, "TRPC_URL", {
    value: "https://trpc.beta.app.cloudify.biz",
  });

  const workflows = new Workflows({ stack, app }, "workflows", {
    defaults: {
      function: {
        bind: [SERVICE_KEY, TRPC_URL, LAMBDA_URL],
        timeout: 60,
        runtime: "nodejs18.x",
      },
    },
    trpcUrl: TRPC_URL.value,
    routes: [
      {
        name: "CREATE_INVOICE",
        path: "POST /createInvoice",
        function:
          "packages/functions/src/handlers/createInvoice/lambda.handler",
        id: 144,
      },
    ],
  });

  const sqsApi = new Api(stack, "sqsApi", {
    routes: {
      "POST /webhook":
        "packages/functions/src/handlers/createInvoice/webhook.handler",
    },
    defaults: {
      function: {
        bind: [SERVICE_KEY, TRPC_URL, LAMBDA_URL],
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: workflows.api?.url,
    ...workflows.triggerLinks,
    SQSEndpoint: sqsApi.url,
  });
}
