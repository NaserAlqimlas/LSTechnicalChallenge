import { Order } from "../entities/Order";
import { OrderProducts } from "../entities/OrderProducts";
import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Product } from "../entities/Product";

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

  @Field(() => [productInfoInput])
  productInfo: [productInfoInput];
}

@InputType()
class productInfoInput {
  @Field()
  productId: number;

  @Field()
  quantity: number;
}

@Resolver()
export class OrderResolver {
  // using this to test if orders are being put in the table
  @Query(() => [Order])
  orders(): Promise<Order[]> {
    return Order.find();
  }

  @Query(() => Order)
  async order(@Arg("id", () => Int) id: number): Promise<any | undefined> {
    const order: Order | undefined = await Order.findOne(id);
    if (order === undefined) {
      console.error("not found");
      return;
    }
    const products: OrderProducts[] | undefined = await OrderProducts.find({
      where: { order: order.id },
    });
    //TODO: fix this, need to get products using orderProducts details, currently returning undefined.
    // const productInfo = products.forEach(
    //   async (product) => await Product.find({ where: { id: product.product } })
    // );
    console.log(order, products);
    return;
  }

  @Mutation(() => Order)
  async createOrder(@Arg("input") input: OrderInput): Promise<Order> {
    const order: any = await Order.create({ ...input }).save();
    input.productInfo.forEach(
      async (product) =>
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(OrderProducts)
          .values({
            order: order.id,
            product: product.productId,
            quantity: product.quantity,
          })
          .returning("*")
          .execute()
    );
    return order;
  }
}
