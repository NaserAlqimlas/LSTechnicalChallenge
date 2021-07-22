import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from "typeorm";
import { Field, ObjectType, Int } from "type-graphql";
import { Order } from "./Order";
import { Product } from "./Product";

@ObjectType()
@Entity()
export class OrderProducts extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ type: "int", name: "orderId" })
  @ManyToOne(() => Order, (order) => order.id, {
    nullable: false,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn()
  order!: Order;

  @Field(() => Int)
  @PrimaryColumn({ type: "int", name: "productId" })
  @ManyToOne(() => Product, (product) => product.id, {
    nullable: false,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn()
  product!: Product;

  @Field()
  @Column()
  quantity!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
