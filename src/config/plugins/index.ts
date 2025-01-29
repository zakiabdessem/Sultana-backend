import {
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
} from "@vendure/core";
import { CloudinaryPlugin } from "./assets";
import { AdminUiPlugin } from "./admin";
// import { EmailPlugin } from "./email";

export const plugins: VendureConfig["plugins"] = [
  CloudinaryPlugin,
  DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
  DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
  // EmailPlugin,
  AdminUiPlugin,
];
