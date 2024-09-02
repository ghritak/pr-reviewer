import { StepContext } from "@/connector";
import { HumanReadableError } from "@cloudifybiz/lighthouse-connectors";
import { AppResponse } from "@cloudifybiz/lighthouse-connectors/apps";
import { logger } from "@cloudifybiz/lighthouse-connectors/logger";

type ArticleType = AppResponse<
  "fortnox",
  "v3",
  "get",
  "/3/articles/{ArticleNumber}"
>["Article"];

export const createInvoice = async (
  ctx: StepContext,
  articles: ArticleType[],
  customer: AppResponse<
    "fortnox",
    "v3",
    "get",
    "/3/customers/{CustomerNumber}"
  >["Customer"]
) => {
  if (articles && articles.length === 0)
    throw new HumanReadableError("No articles found in Fortnox");

  if (!customer?.CustomerNumber)
    throw new HumanReadableError("Customer not found in Fortnox");

  if (!customer?.Name)
    throw new HumanReadableError("Customer name not found in Fortnox");

  const invoiceBody = {
    Invoice: {
      CustomerNumber: customer.CustomerNumber,
      CustomerName: customer.Name,
      Currency: customer.Currency,
    },
  };

  const { data: invoice } = await ctx.apps.fortnox.POST("/3/invoices", {
    body: invoiceBody,
  });

  if (!invoice) throw new Error("API call to create invoice failed.");

  logger.info({ invoice }, "Invoice created in fortnox.");

  return invoice;
};
