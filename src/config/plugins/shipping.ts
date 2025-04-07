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
  DESK_DELIVERY_RATES,
  DEFAULT_DESK_DELIVERY_RATE,
} from "../shipping-rates";

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
    const state = order.shippingAddress?.city;
    const rate = state
      ? HOME_DELIVERY_RATES[state] || DEFAULT_HOME_DELIVERY_RATE
      : DEFAULT_HOME_DELIVERY_RATE;
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
    const state = order.shippingAddress?.city;
    const rate = state
      ? DESK_DELIVERY_RATES[state] || DEFAULT_DESK_DELIVERY_RATE
      : DEFAULT_DESK_DELIVERY_RATE;
    return {
      price: rate,
      priceIncludesTax: false,
      taxRate: 0, // Assuming no tax on shipping for this example
    };
  },
});
