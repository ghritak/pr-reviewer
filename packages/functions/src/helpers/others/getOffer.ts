import { StepContext } from "@/connector";
import { HumanReadableError } from "@cloudifybiz/lighthouse-connectors";

export const getOffer = async (ctx: StepContext, number: string) => {
  const offerResponse = await ctx.apps.rackbeat.GET("/orders/offers/{number}", {
    params: {
      path: {
        number,
      },
    },
  });

  if (offerResponse.response.status === 404) {
    throw new HumanReadableError(
      `Offer not found in rackbeat with id: ${number}`
    );
  }

  if (!offerResponse.data)
    throw new Error("API call to fetch offer from Rackbeat failed");

  return offerResponse.data;
};
