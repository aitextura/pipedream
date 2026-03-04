import zohoCrm from "../../zoho_crm.app.mjs";

export default {
  key: "zoho_crm-update-record-fields",
  name: "Update Record Fields",
  description: "Updates any fields of an existing record in a Zoho CRM module. Pass fields as a JSON object string. [See the documentation](https://www.zoho.com/crm/developer/docs/api/v2/update-records.html)",
  version: "0.0.1",
  type: "action",
  props: {
    zohoCrm,
    moduleType: {
      type: "string",
      label: "Module",
      description: "The module containing the record to update (e.g. Leads, Contacts, Deals).",
      options: [
        "Leads",
        "Contacts",
        "Deals",
        "Accounts",
        "Campaigns",
        "Tasks",
        "Cases",
        "Events",
        "Calls",
        "Solutions",
        "Products",
        "Vendors",
        "Price_Books",
        "Quotes",
        "Sales_Orders",
        "Purchase_Orders",
        "Invoices",
      ],
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The unique ID of the record to update.",
    },
    fields: {
      type: "string",
      label: "Fields (JSON)",
      description: "A JSON object string of field API names and their new values. Example: `{\"First_Name\": \"Max\", \"Last_Name\": \"Petrov\", \"Lead_Status\": \"Hot Lead\", \"Mobile\": \"+375259249572\", \"Lead_Budget\": \"500000\", \"Lead_Source\": \"WhatsApp\"}`. Use Zoho CRM field API names (e.g. First_Name, Last_Name, Mobile, Email, Lead_Status, Lead_Budget, Description, Lead_Source, Industry, Annual_Revenue, No_of_Employees, Rating, Skype_ID, Secondary_Email, Website).",
    },
  },
  async run({ $ }) {
    let parsedFields;
    try {
      parsedFields = JSON.parse(this.fields);
    } catch {
      throw new Error(`Invalid JSON in 'fields' parameter: ${this.fields}`);
    }

    if (typeof parsedFields !== "object" || Array.isArray(parsedFields) || parsedFields === null) {
      throw new Error("'fields' must be a JSON object, e.g. {\"First_Name\": \"Max\"}");
    }

    const res = await this.zohoCrm.updateObject(
      this.moduleType,
      this.recordId,
      parsedFields,
      $,
    );

    const result = res.data?.[0];
    if (result?.code === "SUCCESS") {
      $.export("$summary", `Successfully updated ${this.moduleType} record ${this.recordId} with fields: ${Object.keys(parsedFields).join(", ")}.`);
    } else if (result?.code === "INVALID_DATA") {
      throw new Error(`Invalid data for field '${result.details?.api_name}'. Expected type: ${result.details?.expected_data_type}`);
    } else {
      throw new Error(result?.message || "Unknown error from Zoho CRM API");
    }

    return res;
  },
};
