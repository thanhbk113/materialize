import {
  Column,
  Entity,
  OneToOne,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "../../common/abstract.entity";
import { ItemEntity } from "../item/item.entity";
import { CartEntity } from "./cart.entity";

@Entity({ name: "cartItem" })
export class CartItemEntity extends BaseEntity {
  @Column({ type: "uuid" })
  userId: string;

  @OneToOne(() => ItemEntity)
  @JoinColumn()
  item: ItemEntity;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => CartEntity, cart => cart.items)
  cart: CartEntity;
}
