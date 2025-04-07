import {
  RequestContext,
  Order,
  ShippingCalculator,
  LanguageCode,
} from "@vendure/core";
import { ConfigArgValues } from "@vendure/core/dist/common/configurable-operation";
import {
  determineShippingRate,
  createShippingResult,
} from "../utils/shipping-utils";
import {
  HOME_DELIVERY_RATES,
  DEFAULT_HOME_DELIVERY_RATE,
} from "../config/shipping-rates";

export const ZrexpressHomeShippingCalculator = new ShippingCalculator({
  code: "zrexpress-home-shipping-calculator",
  description: [
    {
      value: "ZrExpress Home Delivery Shipping Calculator",
      languageCode: LanguageCode.en,
    },
    {
      value: "Calculateur de livraison à domicile ZrExpress",
      languageCode: LanguageCode.fr,
    },
  ],
  args: {
    adjustmentFactor: {
      type: "int",
      ui: { component: "number-form-input" },
      label: [
        {
          languageCode: LanguageCode.en,
          value: "Price Adjustment (in %) - can be negative",
        },
      ],
      defaultValue: 0,
    },
  },
  calculate: (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<{ adjustmentFactor: { type: "int" } }>
  ) => {
    const baseRate = determineShippingRate(
      order,
      HOME_DELIVERY_RATES,
      DEFAULT_HOME_DELIVERY_RATE
    );

    const adjustmentMultiplier = 1 + (args.adjustmentFactor || 0) / 100;
    const finalRate = Math.round(baseRate * adjustmentMultiplier);

    return createShippingResult(finalRate);
  },
});
