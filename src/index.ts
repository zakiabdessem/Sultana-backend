import { bootstrap, runMigrations } from "@vendure/core";
import { config } from "./vendure-config";
import { VendurePlugin, PluginCommonModule } from "@vendure/core";
import { ZrexpressHomeShippingCalculator } from "./shipping/home-delivery-calculator";
import { ZrexpressDeskShippingCalculator } from "./shipping/desk-delivery-calculator";

runMigrations(config)
  .then(() => bootstrap(config))
  .catch((err) => {
    console.log(err);
  });

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [],
  configuration: (config) => {
    config.shippingOptions.shippingCalculators.push(
      ZrexpressHomeShippingCalculator,
      ZrexpressDeskShippingCalculator
    );
    return config;
  },
})
export class ZrexpressShippingPlugin {}
