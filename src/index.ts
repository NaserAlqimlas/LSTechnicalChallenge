import "reflect-metadata";
import { __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ProductResolver } from "./resolvers/product";
import { createConnection } from "typeorm";
import { Product } from "./entities/Product";
import { Order } from "./entities/Order";
import { OrderProducts } from "./entities/OrderProducts";
import { OrderResolver } from "./resolvers/order";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "LSShop2",
    username: "postgres",
    password: "root",
    logging: true,
    synchronize: true,
    entities: [Product, Order, OrderProducts],
  });

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ProductResolver],
      validate: false,
    }),
    // context: () => (),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  });
};

main().catch((err) => console.error(err));
