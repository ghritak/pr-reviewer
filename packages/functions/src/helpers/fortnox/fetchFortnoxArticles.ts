import { StepContext } from "@/connector";
import { HumanReadableError } from "@cloudifybiz/lighthouse-connectors";
import { AppResponse } from "@cloudifybiz/lighthouse-connectors/apps";
import { logger } from "@cloudifybiz/lighthouse-connectors/logger";

export const fetchFortnoxArticles = async (
  ctx: StepContext,
  lineItems: AppResponse<
    "hubspot",
    "v3",
    "post",
    "/crm/v3/objects/line_items/batch/read"
  >["results"]
) => {
  if (!lineItems)
    throw new HumanReadableError("No line items found in HubSpot");

  const fortnoxArticles = [];
  for (const item of lineItems) {
    const { data: articleData } = await ctx.apps.fortnox.GET(
      "/3/articles/{ArticleNumber}",
      {
        params: {
          path: {
            ArticleNumber: item.properties.hs_sku,
          },
        },
      }
    );
    if (!articleData) {
      throw new Error("API call to fetch article from fortnox failed.");
    }
    fortnoxArticles.push(articleData.Article);
  }

  if (fortnoxArticles.length === 0)
    throw new HumanReadableError("No articles found in Fortnox");

  logger.info({ fortnoxArticles }, "Articles found in fortnox.");

  return fortnoxArticles;
};
