import z from "zod";
import { Config } from "sst/node/config";
import apiHandler from "@/connector";
import { getOffer } from "@/helpers/others/getOffer";
import { findOrCreateCompanyFromOffer } from "@/helpers/others/findOrCreateCompanyFromOffer";
import { createDealFromOffer } from "@/helpers/others/createDealFromOffer";

export const handler = apiHandler(
  {
    workflowId: Number(Config.QUOTE_SENT_WORKFLOW_ID),
    parsers: {
      body: z.object({
        number: z.number(),
      }),
    },
    referenceExtractor: ({
      parsed: {
        body: { number },
      },
    }) => ({
      id: "number",
      value: String(number),
      label: "Offer Number",
    }),
  },
  async ({ ctx, parsed: { body } }) => {
    const number = String(body.number);

    const offerData = await ctx.step(
      { key: "get-rackbeat-offer-details" },
      getOffer
    )(number);

    const company = await ctx.step(
      { key: "find-or-create-company-in-hubspot" },
      findOrCreateCompanyFromOffer
    )(offerData);

    const deal = await ctx.step(
      { key: "create-deal-in-hubspot" },
      createDealFromOffer
    )(number, offerData, company.id);

    ctx.logger.info({ dealId: deal.id }, "Deal created successfully with Id");

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
      }),
    };
  }
);
