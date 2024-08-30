import { StepContext } from "@/connector";
import { HumanReadableError } from "@cloudifybiz/lighthouse-connectors";
import { logger } from "@cloudifybiz/lighthouse-connectors/logger";

export type LineItemAssociationTypes =
  | { id: string; type: string }[]
  | undefined;

export const fetchLineItems = async (
  ctx: StepContext,
  line_items: LineItemAssociationTypes
) => {
  if (!line_items)
    throw new HumanReadableError("No line items found in HubSpot");

  const lineItemPayload = line_items.map((item) => {
    return { id: item.id };
  });

  const { data: lineItemData } = await ctx.apps.hubspot.POST(
    "/crm/v3/objects/line_items/batch/read",
    {
      body: {
        inputs: lineItemPayload,
        properties: [
          "name",
          "hs_sku",
          "amount",
          "quantity",
          "discount",
          "hs_line_item_currency_code",
        ],
      },
    }
  );

  if (!lineItemData) {
    throw new Error("API call to fetch line items failed.");
  }

  logger.info({ lineItemData }, "Line items found in Hubspot.");

  if (lineItemData.results && lineItemData.results.length === 0)
    throw new HumanReadableError("No line items found in HubSpot");

  return lineItemData.results;
};
