## Scope: Automating Invoice Creation in Fortnox

### Objective

To automate the process of invoice creation in Fortnox when a deal is marked as "closedwon" in HubSpot.

### Flow Functions

#### Trigger

- The automation is triggered when a deal stage in HubSpot is updated to "closedwon."

#### Data Transfer

- Upon triggering, relevant data from the specific deal is retrieved using the deal ID, including contacts and line items associated with the deal ID in HubSpot. This process includes:
  - Fetching contact details from HubSpot based on the deal association.
  - Fetching line items associated with the deal from HubSpot.
  - Logging the retrieval process for traceability.

### Actions in Fortnox

#### Find or Create Customer

1. **Customer Search:**

   - Perform a search in Fortnox using the contact's email from HubSpot.
   - If a matching customer is found, retrieve and return the customer details.
   - If no match is found, proceed to customer creation.

2. **Customer Creation:**
   - If the customer is not found, create a new customer in Fortnox using the following fields from HubSpot contact data:
     - Name
     - Email
     - Phone
     - Address: Address, City, Country, Country Phone Number Code, Zip Code
     - Delivery Details: Name, Phone, Address, Zip Code, City, Country, Country Phone Number Code
   - Note: The creation of the customer is logged, and the newly created customer data is retrieved for further processing.

#### Fetch Articles

1. **Iteration over Line Items:**
   - Iterate over each line item fetched from HubSpot.
   - For each iteration, fetch the corresponding article from Fortnox using the ArticleNumber, identified by the `hs_sku` field from the HubSpot line item.
   - Store all fetched Fortnox articles in an array for further processing.

#### Invoice Creation

1. **Invoice Preparation:**

   - Extract Name and CustomerNumber from the Fortnox customer data.
   - If either Name or CustomerNumber is missing, a HumanReadableError is thrown, and the issue is logged.

2. **Invoice Creation in Fortnox:**
   - Create an invoice in Fortnox with the following details:
     - Customer Name: Retrieved from Fortnox.
     - Customer Number: Retrieved from Fortnox.
     - Currency: Retrieved from Fortnox.
   - Note: The creation of the invoice is logged, and a success response is returned to confirm the operation was completed successfully.
