import { Product } from "../entities/Product";
import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { ILike } from "typeorm";

@InputType()
class ProductInput {
  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  description: string;

  @Field()
  owner: string;
}
@Resolver()
export class ProductResolver {
  @Query(() => [Product])
  products(): Promise<Product[]> {
    return Product.find();
  }

  @Query(() => Product, { nullable: true })
  product(@Arg("id", () => Int) id: number): Promise<Product | undefined> {
    return Product.findOne(id);
  }

  @Query(() => [Product])
  search(@Arg("name", () => String) name: string): Promise<Product[]> {
    return Product.find({ name: ILike(`%${name}%`) });
  }

  @Mutation(() => Product)
  async createProduct(@Arg("input") input: ProductInput): Promise<Product> {
    return Product.create({ ...input }).save();
  }
}
