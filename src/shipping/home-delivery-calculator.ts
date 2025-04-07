import {
  RequestContext,
  Order,
  ShippingCalculator,
  LanguageCode,
} from "@vendure/core";
import { ConfigArgValues } from "@vendure/core/dist/common/configurable-operation";
import {
  HOME_DELIVERY_RATES,
  DEFAULT_HOME_DELIVERY_RATE,
} from "../config/shipping-rates";

export const ZrexpressHomeShippingCalculator = new ShippingCalculator({
  code: "zrexpress-home-shipping-calculator",
  description: [
    {
      value: "Home Rates State Shipping Calculator",
      languageCode: LanguageCode.en,
    },
  ],
  args: {
    rate: {
      type: "int",
      ui: { component: "number-form-input" },
      label: [{ languageCode: LanguageCode.en, value: "Shipping Rate" }],
      defaultValue: DEFAULT_HOME_DELIVERY_RATE,
    },
  },
  calculate: (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<{ rate: { type: "int"; ui: { component: string } } }>
  ) => {
    const state = order.shippingAddress
      ?.city as keyof typeof HOME_DELIVERY_RATES;
    const rate = state
      ? HOME_DELIVERY_RATES[state] || DEFAULT_HOME_DELIVERY_RATE
      : DEFAULT_HOME_DELIVERY_RATE;

    return {
      price: rate,
      priceIncludesTax: false,
      taxRate: 0,
    };
  },
});
