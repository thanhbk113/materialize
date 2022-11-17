import { Column, Entity, OneToOne, BeforeInsert, OneToMany } from "typeorm";
import { BaseEntity } from "../../common/abstract.entity";
import { CartItemEntity } from "./cart-item.entity";

@Entity({ name: "carts" })
export class CartEntity extends BaseEntity {
  @Column({ type: "uuid" })
  userId: string;

  @OneToMany(() => CartItemEntity, cartItem => cartItem.cart)
  items: CartItemEntity[];
}
