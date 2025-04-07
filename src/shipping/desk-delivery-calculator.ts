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
  DESK_DELIVERY_RATES,
  DEFAULT_DESK_DELIVERY_RATE,
} from "../config/shipping-rates";

export const ZrexpressDeskShippingCalculator = new ShippingCalculator({
  code: "zrexpress-desk-shipping-calculator",
  description: [
    {
      value: "ZrExpress Desk Pickup Shipping Calculator",
      languageCode: LanguageCode.en,
    },
    {
      value: "Calculateur de livraison en bureau ZrExpress",
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
      DESK_DELIVERY_RATES,
      DEFAULT_DESK_DELIVERY_RATE
    );

    const adjustmentMultiplier = 1 + (args.adjustmentFactor || 0) / 100;
    const finalRate = Math.round(baseRate * adjustmentMultiplier);

    return createShippingResult(finalRate);
  },
});
