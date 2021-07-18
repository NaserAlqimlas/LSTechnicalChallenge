import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Product {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: "text" })
  name!: string;

  @Field()
  @Property({ type: "text" })
  description: string;

  @Field()
  @Property()
  price!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
