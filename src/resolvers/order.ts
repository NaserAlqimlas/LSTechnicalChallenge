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

  @Field(() => [ProductInfoInput])
  productInfo: [ProductInfoInput];
}

@InputType()
class ProductInfoInput {
  @Field()
  productId: number;

  @Field()
  quantity: number;
}

@ObjectType()
class OrderOutput {
  @Field()
  orderInfo: Order;

  @Field(() => [Product])
  products: [Product];

  constructor(orderInfo: Order, products: Product[]) {
    this.orderInfo = orderInfo;
    this.products = products;
  }
}

@Resolver()
export class OrderResolver {
  // using this to test if orders are being put in the table
  @Query(() => [Order])
  orders(): Promise<Order[]> {
    return Order.find();
  }

  @Query(() => OrderOutput, { nullable: true })
  async order(
    @Arg("id", () => Int) id: number
  ): Promise<OrderOutput | undefined> {
    const order: Order | undefined = await Order.findOne(id);
    if (order === undefined) {
      console.error("not found");
      return;
    }

    const products: OrderProducts[] | undefined = await OrderProducts.find({
      where: { order: order.id },
    });
    if (products === undefined) {
      console.error("not found");
      return;
    }

    const ids = products.map((product) => product.product);
    const productInfo = await getConnection()
      .getRepository(Product)
      .createQueryBuilder("product")
      .where("product.id IN (:...ids)", { ids: ids })
      .getMany();
    if (productInfo === undefined) {
      console.error("not found");
      return;
    }

    const orderSummary = new OrderOutput(order, productInfo);
    return orderSummary;
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
