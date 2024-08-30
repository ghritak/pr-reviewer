import { Config } from "sst/node/config";
import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async ({ body }) => {
  if (!body)
    throw new Error(
      "Hubspot Similarweb Sync Error: No body found in SQS Handler"
    );
  // Parse Body
  const parsedBody = JSON.parse(body);
  if (Array.isArray(parsedBody)) {
    for (const eventItem of parsedBody) {
      if (
        eventItem?.propertyName === "dealstage" &&
        eventItem?.propertyValue === "closedwon" &&
        eventItem?.objectId
      ) {
        await fetch(Config.LAMBDA_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            objectId: String(eventItem.objectId),
          }),
        });
      }
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
