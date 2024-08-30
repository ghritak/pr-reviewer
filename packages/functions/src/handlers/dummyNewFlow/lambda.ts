import z from "zod";
import { Config } from "sst/node/config";
import { apiHandler } from "@/connector";
import { getsalesOrder } from "@/helpers/rackbeat/getSalesOrder";
import { updateDealStage } from "@/helpers/hubspot/updateDealStage";
import { getDeal } from "@/helpers/hubspot/getdeal";
import { findOrCreateCompanyFromOrder } from "@/helpers/hubspot/findOrCreateCompanyFromOrder";
import { createContactFromOrder } from "@/helpers/hubspot/createContactFromOrder";

export const handler = apiHandler(
  {
    workflowId: Number(Config.SALES_ORDER_WORKFLOW_ID),
    parsers: {
      body: z.object({
        key: z.number(),
      }),
    },
    referenceExtractor: ({
      parsed: {
        body: { key },
      },
    }) => ({
      id: "key",
      value: String(key),
      label: "Order Number",
    }),
  },
  async ({ ctx, parsed: { body } }) => {
    const number = String(body.key);

    const orderData = await ctx.step(
      { key: "get-rackbeat-order-details" },
      getsalesOrder
    )(number);

    if (orderData.order.offer_id) {
      const deal = await ctx.step(
        { key: "find-deal-in-hubspot" },
        getDeal
      )(orderData.order.offer_id);

      const updatedDeal = await ctx.step(
        { key: "update-deal-stage-in-hubspot" },
        updateDealStage
      )(deal.id, orderData);
      ctx.logger.info(
        { dealId: updatedDeal.id },
        "Deal with Id updated successfully"
      );
    } else {
      // No rackbeat offer id found, Creating contact and deal in Hubspot
      const company = await ctx.step(
        { key: "find-or-create-company-in-hubspot" },
        findOrCreateCompanyFromOrder
      )(orderData);

      const deal = await ctx.step(
        { key: "create-deal-in-hubspot" },
        createContactFromOrder
      )(number, orderData, company.id);
      ctx.logger.info({ dealId: deal.id }, "Deal created successfully with Id");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
      }),
    };
  }
);
