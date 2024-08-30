import { StepContext } from "@/connector";
import { HumanReadableError } from "@cloudifybiz/lighthouse-connectors";
import { AppResponse } from "@cloudifybiz/lighthouse-connectors/apps";
import { logger } from "@cloudifybiz/lighthouse-connectors/logger";
import { combineString } from "../utils";

export const findOrCreateCustomer = async (
  ctx: StepContext,
  contact: AppResponse<
    "hubspot",
    "v3",
    "get",
    "/crm/v3/objects/contacts/{contactId}"
  >
) => {
  if (!contact.properties.email)
    throw new HumanReadableError(
      "Contact email is blank in HubSpot, Please update it and try again."
    );

  const { data: customers } = await ctx.apps.fortnox.GET("/3/customers/", {
    params: {
      query: {
        email: contact.properties.email,
      },
    },
  });

  if (!customers?.Customers)
    throw new Error(
      `Unable to fetch Customer in Fortnox with email: ${contact.properties.email}`
    );

  if (customers.Customers && customers.Customers.length > 1) {
    throw new HumanReadableError(
      `Customer LookUp Failed: Multiple Customers found in Fortnox with email: ${contact.properties.email}, Please ensure that email is unique and retrigger from Lighthouse`
    );
  }

  const fortnoxCustomer = customers.Customers[0] || {};

  const name = combineString(
    contact.properties.firstname,
    contact.properties.lastname
  );

  if (!name)
    throw new HumanReadableError(
      "Customer name cannot be blank in Fortnox, Please update it and try again"
    );

  const customerBody = {
    Customer: {
      Name: name,
      Email: contact.properties.email,
      Phone1: contact.properties.phone,
      Address1: contact.properties.address,
      City: contact.properties.city,
      Country: contact.properties.country,
      CountryCode:
        contact.properties.hs_calculated_phone_number_country_code ?? "",
      ZipCode: contact.properties.zip,
      DeliveryName: name,
      DeliveryPhone1: contact.properties.phone,
      DeliveryAddress1: contact.properties.address,
      DeliveryZipCode: contact.properties.zip,
      DeliveryCity: contact.properties.city,
      DeliveryCountry: contact.properties.country,
      DeliveryCountryCode:
        contact.properties.hs_calculated_phone_number_country_code ?? "",
    },
  };

  logger.info({ customerBody }, "Customer Body Sending to Fortnox");

  if (fortnoxCustomer.CustomerNumber) {
    // Update Customer
    logger.info("Customer Found, Updating Customer in Fortnox");
    const { data: updatedCustomer } = await ctx.apps.fortnox.PUT(
      "/3/customers/{CustomerNumber}",
      {
        params: {
          path: {
            CustomerNumber: fortnoxCustomer.CustomerNumber,
          },
        },
        body: customerBody,
      }
    );

    if (!updatedCustomer?.Customer || !updatedCustomer.Customer.CustomerNumber)
      throw new Error(
        `Customer Updation Failed in Fortnox with email: ${contact.properties.email}`
      );

    logger.info(
      { Customer: updatedCustomer.Customer },
      "Customer found in Fortnox, updated customer."
    );

    return updatedCustomer.Customer;
  }

  // Create Customer
  const { data: createdCustomer } = await ctx.apps.fortnox.POST(
    "/3/customers/",
    {
      body: customerBody,
    }
  );

  if (!createdCustomer?.Customer || !createdCustomer.Customer.CustomerNumber)
    throw new Error(
      `Customer Creation Failed in Fortnox with email: ${contact.properties.email}`
    );

  logger.info({ Customer: createdCustomer }, "Customer created to Fortnox");

  return createdCustomer.Customer;
};
