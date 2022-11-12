import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  BeforeInsert,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { BaseEntity } from "../../common/abstract.entity";
import { CategoryStatus } from "../../common/enum/category-status";
import { ItemEntity } from "../item/item.entity";

@Entity({ name: "categories" })
export class CategoryEntity extends BaseEntity {
  @Column({ nullable: true })
  image?: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  parentId?: string;

  @ManyToOne(() => CategoryEntity, category => category.parentId)
  @JoinColumn({ name: "parentId" })
  children?: CategoryEntity[];

  @OneToMany(() => ItemEntity, item => item.category)
  items?: ItemEntity[];

  @Column()
  slug: string;

  @Column({
    enum: CategoryStatus,
  })
  status?: CategoryStatus;
}
