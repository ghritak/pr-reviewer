export interface WebshipperOrder {
  data: {
    id: string;
    type: string;
    links: {
      self: string;
    };
    attributes: {
      order_channel_id: number;
      status: string;
      ext_ref: string;
      visible_ref: string;
      drop_point: null;
      original_shipping: {
        id: number;
        order_id: number;
        shipping_code: string;
        shipping_name: string;
        price: number;
        vat_percent: number;
        created_at: string;
        updated_at: string;
      };
      order_lines: Array<{
        id: number;
        sku: string;
        description: string;
        quantity: number;
        location: null;
        tarif_number: string;
        country_of_origin: string;
        unit_price: number;
        vat_percent: number;
        order_id: number;
        status: string;
        ext_ref: string;
        created_at: string;
        updated_at: string;
        package_id: number;
        weight: number;
        weight_unit: string;
        discount_value: number;
        discount_type: string;
        is_virtual: boolean;
        dangerous_goods_details: unknown;
        discounted_unit_price: number;
        package: {
          id: number;
          weight: number;
          shipment_id: null;
          created_at: string;
          updated_at: string;
          weight_unit: string;
          barcode_usage_id: null;
          barcode_usage_type: null;
          ext_ref: null;
          labelless_code: null;
          colli_type: null;
          dangerous_goods_details: unknown;
          add_ons: Array<unknown>;
        };
        additional_attributes: {
          pa_dyna?: string;
          pa_ramfarg: string;
        };
      }>;
      delivery_address: {
        id: number;
        att_contact: string;
        company_name: string;
        address_1: string;
        address_2: string;
        zip: string;
        city: string;
        country_code: string;
        state: string;
        phone: string;
        email: string;
        created_at: string;
        updated_at: string;
        address_type: string;
        vat_no: null;
        ext_location: null;
        company_customs_numbers: unknown;
        formatted_recipient: string;
        voec: null;
        eori: null;
        sprn: null;
        personal_customs_no: null;
      };
      sender_address: {
        id: number;
        att_contact: string;
        company_name: string;
        address_1: string;
        address_2: null;
        zip: string;
        city: string;
        country_code: string;
        state: null;
        phone: string;
        email: string;
        created_at: string;
        updated_at: string;
        address_type: string;
        vat_no: string;
        ext_location: null;
        company_customs_numbers: {
          voec: null;
          eori: string;
          sprn: null;
          ioss: null;
        };
        formatted_recipient: string;
        voec: null;
        eori: string;
        sprn: null;
        personal_customs_no: null;
      };
      billing_address: {
        id: number;
        att_contact: string;
        company_name: string;
        address_1: string;
        address_2: string;
        zip: string;
        city: string;
        country_code: string;
        state: string;
        phone: string;
        email: string;
        created_at: string;
        updated_at: string;
        address_type: string;
        vat_no: null;
        ext_location: null;
        company_customs_numbers: unknown;
        formatted_recipient: string;
        voec: null;
        eori: null;
        sprn: null;
        personal_customs_no: null;
      };
      sold_from_address: {
        id: number;
        att_contact: string;
        company_name: string;
        address_1: string;
        address_2: null;
        zip: string;
        city: string;
        country_code: string;
        state: null;
        phone: string;
        email: string;
        created_at: string;
        updated_at: string;
        address_type: string;
        vat_no: string;
        ext_location: null;
        company_customs_numbers: {
          voec: null;
          eori: null;
          sprn: null;
          ioss: null;
        };
        formatted_recipient: string;
        voec: null;
        eori: null;
        sprn: null;
        personal_customs_no: null;
      };
      currency: string;
      internal_comment: null;
      external_comment: string;
      error_message: null;
      updated_at: string;
     

 created_at: string;
      lock_state: null;
      source: string;
      tags: Array<unknown>;
      error_class: null;
      slip_printed: null;
      label_printed: null;
      create_shipment_automatically: boolean;
      latest_activity: null;
      latest_status_event: null;
      shipping_rate_id: number;
      csv_upload_id: null;
    };
    relationships: {
      order_channel: {
        links: {
          self: string;
          related: string;
        };
      };
      shipping_rate: {
        links: {
          self: string;
          related: string;
        };
      };
      error_type: {
        links: {
          self: string;
          related: string;
        };
      };
      printer_client: {
        links: {
          self: string;
          related: string;
        };
      };
      shipments: {
        links: {
          self: string;
          related: string;
        };
      };
      additional_attributes: {
        links: {
          self: string;
          related: string;
        };
        data: Array<unknown>;
      };
      print_jobs: {
        links: {
          self: string;
          related: string;
        };
      };
      packages: {
        links: {
          self: string;
          related: string;
        };
      };
      events: {
        links: {
          self: string;
          related: string;
        };
      };
      attachments: {
        links: {
          self: string;
          related: string;
        };
      };
      documents: {
        links: {
          self: string;
          related: string;
        };
      };
      activities: {
        links: {
          self: string;
          related: string;
        };
      };
      status_events: {
        links: {
          self: string;
          related: string;
        };
      };
      returns: {
        links: {
          self: string;
          related: string;
        };
      };
      comments: {
        links: {
          self: string;
          related: string;
        };
      };
      stores: {
        links: {
          self: string;
          related: string;
        };
      };
    };
    meta: {
      copyright: string;
    };
    account_name: string;
  };
}