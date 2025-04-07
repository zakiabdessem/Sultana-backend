import {
  RequestContext,
  Order,
  ShippingCalculator,
  LanguageCode,
} from "@vendure/core";
import { ConfigArgValues } from "@vendure/core/dist/common/configurable-operation";
import {
  DESK_DELIVERY_RATES,
  DEFAULT_DESK_DELIVERY_RATE,
} from "../config/shipping-rates";

export const ZrexpressDeskShippingCalculator = new ShippingCalculator({
  code: "zrexpress-desk-shipping-calculator",
  description: [
    {
      value: "StopDesk Rates State Shipping Calculator",
      languageCode: LanguageCode.en,
    },
  ],
  args: {
    rate: {
      type: "int",
      ui: { component: "number-form-input" },
      label: [{ languageCode: LanguageCode.en, value: "Shipping Rate" }],
      defaultValue: DEFAULT_DESK_DELIVERY_RATE,
    },
  },
  calculate: (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<{ rate: { type: "int"; ui: { component: string } } }>
  ) => {
    const state = order.shippingAddress
      ?.city as keyof typeof DESK_DELIVERY_RATES;
    const rate = state
      ? DESK_DELIVERY_RATES[state] || DEFAULT_DESK_DELIVERY_RATE
      : DEFAULT_DESK_DELIVERY_RATE;

    return {
      price: rate,
      priceIncludesTax: false,
      taxRate: 0,
    };
  },
});
