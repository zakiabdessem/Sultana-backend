import {
  RequestContext,
  Order,
  ShippingCalculator,
  LanguageCode,
} from "@vendure/core";
import { ConfigArgValues } from "@vendure/core/dist/common/configurable-operation";

export const ZrexpressHomeShippingCalculator = new ShippingCalculator({
  code: "zrexpress-home-shipping-calculator",
  description: [
    {
      value: "Home Rates State Shipping Calculator",
      languageCode: LanguageCode.en,
    },
  ],
  args: {
    rate: { type: "int", ui: { component: "number-form-input" } },
  },
  calculate: (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<{ rate: { type: "int"; ui: { component: string } } }>
  ) => {
    const state = order.shippingAddress?.city as keyof typeof home_rates;
    const home_rates: { [key: string]: number } = {
      Adrar: 140000,
      Chlef: 80000,
      Laghouat: 95000,
      "Oum El Bouaghi": 70000,
      Batna: 50000,
      Béjaïa: 75000,
      Biskra: 80000,
      Béchar: 110000,
      Blida: 75000,
      Bouira: 75000,
      Tamanrasset: 160000,
      Tébessa: 80000,
      Tlemcen: 95000,
      Tiaret: 80000,
      "Tizi Ouzou": 80000,
      Algiers: 60000,
      Djelfa: 95000,
      Jijel: 80000,
      Sétif: 75000,
      Saïda: 80000,
      Skikda: 75000,
      "Sidi Bel Abbès": 80000,
      Annaba: 75000,
      Guelma: 75000,
      Constantine: 75000,
      Médéa: 80000,
      Mostaganem: 80000,
      "M'Sila": 80000,
      Mascara: 80000,
      Ouargla: 95000,
      Oran: 80000,
      "El Bayadh": 110000,
      Illizi: 0,
      "Bordj Bou Arreridj": 75000,
      Boumerdès: 75000,
      "El Tarf": 75000,
      Tindouf: 0,
      Tissemsilt: 80000,
      "El Oued": 95000,
      Khenchela: 60000,
      "Souk Ahras": 70000,
      Tipaza: 80000,
      Mila: 70000,
      "Aïn Defla": 80000,
      Naâma: 110000,
      "Aïn Témouchent": 80000,
      Ghardaïa: 95000,
      Relizane: 80000,
      Timimoun: 140000,
      "Bordj Badji Mokhtar": 0,
      "Ouled Djellal": 95000,
      "Béni Abbès": 100000,
      "In Salah": 160000,
      "In Guezzam": 160000,
      Touggourt: 95000,
      Djanet: 0,
      "M'Ghair": 95000,
      Meniaa: 100000,
    };

    const rate = state ? home_rates[state] || 59900 : 59900;
    return {
      price: rate,
      priceIncludesTax: false,
      taxRate: 0, // Assuming no tax on shipping for this example
    };
  },
});

export const ZrexpressDeskShippingCalculator = new ShippingCalculator({
  code: "zrexpress-desk-shipping-calculator",
  description: [
    {
      value: "StopDesk Rates State Shipping Calculator",
      languageCode: LanguageCode.en,
    },
  ],
  args: {
    rate: { type: "int", ui: { component: "number-form-input" } },
  },
  calculate: (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<{ rate: { type: "int"; ui: { component: string } } }>
  ) => {
    const state = order.shippingAddress?.city as keyof typeof stopdesk_rates;
    const stopdesk_rates: { [key: string]: number } = {
      Adrar: 90000,
      Chlef: 45000,
      Laghouat: 60000,
      "Oum El Bouaghi": 45000,
      Batna: 30000,
      Béjaïa: 45000,
      Biskra: 50000,
      Béchar: 65000,
      Blida: 45000,
      Bouira: 45000,
      Tamanrasset: 105000,
      Tébessa: 45000,
      Tlemcen: 55000,
      Tiaret: 45000,
      "Tizi Ouzou": 45000,
      Algiers: 45000,
      Djelfa: 60000,
      Jijel: 45000,
      Sétif: 45000,
      Saïda: 50000,
      Skikda: 45000,
      "Sidi Bel Abbès": 45000,
      Annaba: 45000,
      Guelma: 45000,
      Constantine: 45000,
      Médéa: 45000,
      Mostaganem: 45000,
      "M'Sila": 50000,
      Mascara: 45000,
      Ouargla: 60000,
      Oran: 45000,
      "El Bayadh": 60000,
      Illizi: 0,
      "Bordj Bou Arreridj": 45000,
      Boumerdès: 45000,
      "El Tarf": 45000,
      Tindouf: 0,
      Tissemsilt: 52000,
      "El Oued": 60000,
      Khenchela: 0,
      "Souk Ahras": 45000,
      Tipaza: 45000,
      Mila: 45000,
      "Aïn Defla": 45000,
      Naâma: 60000,
      "Aïn Témouchent": 45000,
      Ghardaïa: 60000,
      Relizane: 45000,
      Timimoun: 0,
      "Bordj Badji Mokhtar": 0,
      "Ouled Djellal": 50000,
      "Béni Abbès": 0,
      "In Salah": 0,
      "In Guezzam": 0,
      Touggourt: 60000,
      Djanet: 0,
      "M'Ghair": 0,
      Meniaa: 0,
    };

    const rate = state ? stopdesk_rates[state] || 59900 : 59900;
    return {
      price: rate,
      priceIncludesTax: false,
      taxRate: 0, // Assuming no tax on shipping for this example
    };
  },
});
