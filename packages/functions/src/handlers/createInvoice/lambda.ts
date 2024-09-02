import { Config } from "sst/node/config";
import z from "zod";
import { apiHandler } from "@/connector";
import { getDeal } from "@/helpers/hubspot/getDeal";
import { getContact } from "@/helpers/hubspot/getContact";
import { findOrCreateCustomer } from "@/helpers/fortnox/findOrCreateCustomer";
import { fetchLineItems } from "@/helpers/hubspot/fetchLineItems";
import { fetchFortnoxArticles } from "@/helpers/fortnox/fetchFortnoxArticles";
import { createInvoice } from "@/helpers/fortnox/createInvoice";

export const handler = apiHandler(
  {
    workflowId: Number(Config.CREATE_INVOICE_WORKFLOW_ID),
    parsers: {
      body: z.object({
        objectId: z.string(),
      }),
    },
    referenceExtractor: ({
      parsed: {
        body: { objectId },
      },
    }) => ({
      id: "dealId",
      value: objectId,
      label: "Deal Id",
    }),
  },

  async ({ ctx, parsed: { body } }) => {
    const deal = await ctx.step(
      { key: "fetch-deal-from-hubspot" },
      getDeal
    )(body.objectId);

    const hubspotContact = await ctx.step(
      { key: "fetch-contact-from-hubspot" },
      getContact
    )(deal.associations?.contacts.results[0].id);

    const lineItems = await ctx.step(
      { key: "fetch-line-items-from-hubspot" },
      fetchLineItems
    )(deal.associations?.["line items"].results);

    const fortnoxCustomer = await ctx.step(
      { key: "find-or-create-company-in-fortnox" },
      findOrCreateCustomer
    )(hubspotContact);

    const fortnoxArticles = await ctx.step(
      { key: "fetch-articles-from-fortnox" },
      fetchFortnoxArticles
    )(lineItems);

    await ctx.step({ key: "create-invoice-in-fortnox" }, createInvoice)(
      fortnoxArticles,
      fortnoxCustomer
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        deal: deal,
      }),
    };
  }
);
