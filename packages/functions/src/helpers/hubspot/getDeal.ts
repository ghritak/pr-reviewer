import { StepContext } from "@/connector";
import { HumanReadableError } from "@cloudifybiz/lighthouse-connectors";
import { logger } from "@cloudifybiz/lighthouse-connectors/logger";

export const getDeal = async (ctx: StepContext, dealId: string) => {
  const dealQueryParams = [
    "amount",
    "closedate",
    "createdate",
    "dealname",
    "draft_invoice",
    "dealstage",
    "hs_lastmodifieddate",
    "hs_object_id",
    "createdate",
    "hs_lastmodifieddate",
    "hs_object_id",
    "deal_currency_code",
    "invoices_pending",
    "invoice_status",
    "omit_from_invoicing_",
    "economic_kundenummer",
    "invoiced_date",
    "hubspot_owner_id",
    "overskrift",
    "po_cost_center",
    "payment_terms",
    "deal_churned",
    "registration_number",
    "vat_number",
    "products",
    "assisted",
    "pipeline",
  ];

  const { data: dealData, response } = await ctx.apps.hubspot.GET(
    "/crm/v3/objects/deals/{dealId}",
    {
      params: {
        query: {
          properties: dealQueryParams,
          associations: ["contacts", "line_items", "companies"],
        },
        path: {
          dealId: dealId,
        },
      },
    }
  );

  if (response.status === 404) {
    throw new HumanReadableError(
      `Deal with id ${dealId} does not exist in HubSpot`
    );
  }

  if (!dealData) {
    throw new Error(`API call to fetch deal with dealId: ${dealId} failed.`);
  }

  if (!dealData.associations?.contacts.results[0].id)
    throw new HumanReadableError("No contact found associated with the deal");

  logger.info({ dealData }, `Deal with deal Id : ${dealId} found`);

  return dealData;
};
