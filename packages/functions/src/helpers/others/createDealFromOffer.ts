import { StepContext } from "@/connector";
import { HumanReadableError } from "@cloudifybiz/lighthouse-connectors";
import { AppResponse } from "@cloudifybiz/lighthouse-connectors/apps";

export const createDealFromOffer = async (
  ctx: StepContext,
  rackbeat_offer_id: string,
  offerData: AppResponse<"rackbeat", "v1", "get", "/orders/offers/{number}">,
  companyId: string
) => {
  if (!offerData.offer?.total_total)
    throw new HumanReadableError(
      "Amount is missing on the HubSpot deal. Add the amount & replay the record"
    );
  if (!offerData.offer?.customer?.name)
    throw new HumanReadableError(
      "Firstname is missing on the HubSpot deal so deal can not be created. Add the deal name & replay the record"
    );

  const deal = await ctx.apps.hubspot.POST("/crm/v3/objects/deals", {
    body: {
      properties: {
        amount: String(offerData.offer.total_total),
        dealname: `${offerData.offer.customer.name} Deal`,
        rackbeat_offer_id: rackbeat_offer_id,
        dealstage: "contractsent",
        deal_currency_code: offerData.offer.currency,
      },
      associations: [
        {
          to: {
            id: companyId,
          },
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED" as const,
              associationTypeId: 341,
            },
          ],
        },
      ],
    },
  });

  if (!deal || !deal.data || !deal.data.id) {
    throw new Error(
      `API call to create deal with amount: ${offerData.offer.total_total} failed.`
    );
  }

  return deal.data;
};
