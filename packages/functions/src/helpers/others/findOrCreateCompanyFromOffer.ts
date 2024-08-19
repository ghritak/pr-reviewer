import { StepContext } from "@/connector";
import { HumanReadableError } from "@cloudifybiz/lighthouse-connectors";
import { AppResponse } from "@cloudifybiz/lighthouse-connectors/apps";

export const findOrCreateCompanyFromOffer = async (
  ctx: StepContext,
  offerData: AppResponse<"rackbeat", "v1", "get", "/orders/offers/{number}">
) => {
  if (!offerData.offer) throw new Error("No offer data found in Rackbeat.");

  if (!offerData.offer.customer) {
    throw new HumanReadableError(
      `Customer not found in Rackbeat Offer Id: ${offerData.offer.number}, please add a customer and replay the record from Lighthouse`
    );
  }

  if (!offerData.offer.customer.contact_email) {
    throw new HumanReadableError(
      `No email found in the Rackbeat customer Id ${offerData.offer.customer.number}, please add an email and replay the record from Lighthouse`
    );
  }

  const email = offerData.offer.customer.contact_email;

  const postbody = {
    filterGroups: [
      {
        filters: [
          {
            value: email,
            propertyName: "email",
            operator: "EQ" as const,
          },
        ],
      },
    ],
    sorts: [],
    limit: 1,
    properties: ["name", "email", "phone", "address", "city", "country", "zip"],
    after: 0,
  };

  const findCompany = await ctx.apps.hubspot.POST(
    `/crm/v3/objects/companies/search`,
    {
      body: postbody,
    }
  );

  if (!findCompany.data) {
    throw new Error(
      `API call to search company in HubSpot with email ${email} failed.`
    );
  }

  if (findCompany.data && findCompany.data.total === 0) {
    if (!offerData.offer.customer.name)
      throw new HumanReadableError(
        "No customer name found in rackbeat offer data."
      );

    const companyProperties = {
      name: offerData.offer.customer.name,
      email: email,
      phone: offerData.offer.customer.contact_phone ?? "",
      address: offerData.offer.customer.address_street ?? "",
      city: offerData.offer.customer.address_city ?? "",
      country: offerData.offer.customer.address_country ?? "",
      zip: offerData.offer.customer.address_zipcode ?? "",
    };
    const { data: company, response } = await ctx.apps.hubspot.POST(
      "/crm/v3/objects/companies",
      {
        body: {
          properties: companyProperties,
          associations: [],
        },
      }
    );

    if (response.status === 409) {
      throw new HumanReadableError(
        `Company with email ${email} was not found/created in HubSpot due to presence of multiple emails on the company`
      );
    }

    if (!company?.id)
      throw new Error("API call to create company in HubSpot failed.");

    return company;
  } else {
    return findCompany.data.results[0];
  }
};
