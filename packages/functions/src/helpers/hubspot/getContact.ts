import { StepContext } from "@/connector";
import { HumanReadableError } from "@cloudifybiz/lighthouse-connectors";
import { logger } from "@cloudifybiz/lighthouse-connectors/logger";

export const getContact = async (
  ctx: StepContext,
  contactId: string | undefined
) => {
  if (!contactId)
    throw new HumanReadableError(
      `No contact found with contact id: ${contactId}`
    );

  const { data: contactData, response } = await ctx.apps.hubspot.GET(
    "/crm/v3/objects/contacts/{contactId}",
    {
      params: {
        query: {
          properties: [
            "firstname",
            "lastname",
            "email",
            "phone",
            "address",
            "city",
            "hs_calculated_phone_number_country_code",
            "zip",
            "country",
          ],
        },
        path: {
          contactId: contactId,
        },
      },
    }
  );

  if (response.status === 404) {
    throw new HumanReadableError(
      `Contact with id ${contactId} does not exist in HubSpot`
    );
  }

  if (!contactData) {
    throw new Error(
      `API call to fetch contact with contactId: ${contactId} failed.`
    );
  }

  logger.info({ contactData }, `Deal with deal Id : ${contactId} found`);

  return contactData;
};
