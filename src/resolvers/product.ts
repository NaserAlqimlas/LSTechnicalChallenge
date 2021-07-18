import { Product } from "../entities/Product";
import { MyContext } from "../types";
import { Arg, Ctx, Float, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class ProductResolver {
  @Query(() => [Product])
  products(@Ctx() { em }: MyContext): Promise<Product[]> {
    return em.find(Product, {});
  }

  @Query(() => Product, { nullable: true })
  product(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Product | null> {
    return em.findOne(Product, { id });
  }

  @Query(() => [Product])
  search(
    @Arg("name", () => String) name: string,
    @Ctx() { em }: MyContext
  ): Promise<Product[]> {
    return em.find(Product, { name: { $like: `%${name}%` } });
  }

  @Mutation(() => Product)
  async createProduct(
    @Arg("name", () => String) name: string,
    @Arg("price", () => Float) price: number,
    @Arg("description", () => String, { nullable: true }) description: string,
    @Ctx() { em }: MyContext
  ): Promise<Product> {
    const product = em.create(Product, { name, price, description });
    await em.persistAndFlush(product);
    return product;
  }
}
