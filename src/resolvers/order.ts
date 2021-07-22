import { Order } from "../entities/Order";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Product } from "src/entities/Product";

@InputType()
class OrderInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  address: string;

  @Field()
  comments: string;

  @Field()
  products: Product[];
}

@Resolver()
export class OrderResolver {
  // using this to test if orders are being put in the table
  @Query(() => [Order])
  orders(): Promise<Order[]> {
    return Order.find();
  }

  @Mutation(() => Order)
  async createOrder(@Arg("input") input: OrderInput): Promise<Order> {
    return Order.create({ ...input }).save();
  }
}
