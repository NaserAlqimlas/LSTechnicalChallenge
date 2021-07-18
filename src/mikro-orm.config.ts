import { __prod__ } from "./constants";
import { Product } from "./entities/Product";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/, //double check this regex
  },
  entities: [Product],
  dbName: "LSShop",
  type: "postgresql",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
