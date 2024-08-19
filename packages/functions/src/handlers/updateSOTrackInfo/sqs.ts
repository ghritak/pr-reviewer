import { Config } from "sst/node/config";
import { ApiHandler } from "sst/node/api";
import { WebshipperOrder } from "@/helpers/types/common";

export const handler = ApiHandler(async ({ body }) => {
  if (!body)
    throw new Error(
      "Crea update SO Track Info SQS Error: No body found in SQS Handler"
    );
  
  // Decode body
  const decodedBody = Buffer.from(body, 'base64').toString('utf-8');
    
  // Parse Body
  let parsedBody: WebshipperOrder;
  try {
    parsedBody = JSON.parse(decodedBody);
  } catch (error) {
    console.error("Error parsing JSON body", error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid JSON in the request body",
      }),
    };
  }

  const result = await fetch(Config.LH_HANDLER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      body: {
        data: {
          id: parsedBody.data?.id,
          attributes: {
            status: parsedBody.data?.attributes?.status,
          },
        },
      },
    }),
  });

  console.log("Sent", result.ok)
  // Return the success response
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
    }),
  };
});
