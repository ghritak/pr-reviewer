import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async ({ body }) => {
  if (!body)
    throw new Error(
      "Noers Economic Flow SQS Error: No body found in SQS Handler"
    );

  // Parse Body
  let parsedBody;
  try {
    const decodedString = atob(body);
    const params = new URLSearchParams(decodedString);
    const payload = params.get("payload") ?? "";
    console.log("payload", payload, typeof payload);

    parsedBody = payload;
  } catch (error) {
    console.error("Error parsing JSON body", error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid JSON in the request body",
      }),
    };
  }

  const urls = [
    "https://api.cloudify.biz/noerstogo/submit/ecoFlowTrigger",
    "https://api.cloudify.biz/noerstogo/submit/newOrderTrigger",
    "https://api.cloudify.biz/noerstogo/submit/orderStatusTrigger",
    "https://api.cloudify.biz/noers-ecwid/submit/paymentTrigger",
    "https://api.cloudify.biz/noers-ecwid/submit/cancelPaymentTrigger",
    "https://api.cloudify.biz/noerstogo/submit/salesAirtableSyncTrigger",
  ] as const;

  for (const url of urls) {
    try {
      const result = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: parsedBody,
        }),
      });
      console.log("Sent", result.ok)
    } catch (error) {
      console.error(`Error sending request to ${url}`, error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: `Error sending request to ${url}`,
          error: (error as Error)?.message,
        }),
      };
    }
  }

  // Return the success response
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
    }),
  };
});
