import { Column, Entity, OneToMany, OneToOne, BeforeInsert } from 'typeorm';
import { BaseEntity } from '../../common/abstract.entity';
import { generateHash } from '../../common/utils';
import { VirtualColumn } from '../../decorators';
import { UserDto } from './dtos/user.dto';
import { UserSettingsEntity } from './user-settings.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  @VirtualColumn()
  fullName?: string;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
  settings?: UserSettingsEntity;

  @BeforeInsert()
  hashPassword() {
    this.password = generateHash(this.password);
  }
}
