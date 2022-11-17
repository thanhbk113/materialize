import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
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

  @ManyToOne(() => CategoryEntity, category => category.items)
  category: CategoryEntity;
}
