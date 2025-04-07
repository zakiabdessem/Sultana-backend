import { Order } from "@vendure/core";
import {
  HOME_DELIVERY_RATES,
  DESK_DELIVERY_RATES,
  DEFAULT_HOME_DELIVERY_RATE,
  DEFAULT_DESK_DELIVERY_RATE,
} from "../config/shipping-rates";

export function determineShippingRate(
  order: Order,
  ratesTable: Record<string, number>,
  defaultRate: number
): number {
  if (!order.shippingAddress?.city) {
    return defaultRate;
  }

  const state = order.shippingAddress.city;
  return ratesTable[state] || defaultRate;
}

export function createShippingResult(price: number) {
  return {
    price,
    priceIncludesTax: false,
    taxRate: 0,
  };
}
