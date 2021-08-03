import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { OrderProducts } from "./OrderProducts";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  @OneToMany(() => OrderProducts, (orderProducts) => orderProducts.product)
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column({ type: "float" })
  price!: number;

  @Field()
  @Column()
  owner!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image?: string;
}
