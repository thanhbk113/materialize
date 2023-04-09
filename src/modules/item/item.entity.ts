import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { BaseEntity } from "../../common/abstract.entity";
import { CategoryEntity } from "../category/category.entity";

@Entity({ name: "items" })
export class ItemEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: 1 })
  quantity: number;

  @Column()
  price: number;

  @Column()
  cost: number;

  @Column({ nullable: true, array: true, type: "varchar" })
  images: string[];

  @ManyToMany(() => CategoryEntity, category => category.items)
  @JoinTable({
    name: "items_categories",
    inverseJoinColumn: {
      name: "category_id",
      referencedColumnName: "id",
    },
    joinColumn: {
      name: "item_id",
      referencedColumnName: "id",
    },
  })
  categories: CategoryEntity[];

  @Column({ default: 0 })
  stock: number;

  @Column()
  details: string;

  @Column()
  sku: string;
}
