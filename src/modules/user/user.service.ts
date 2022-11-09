import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '../../common/dto/page.dto';
import { IFile } from '../../common/interfaces/file.interface';
// import { ValidatorService } from '../../shared/services/validator.service';
import { UserRegisterDto } from '../auth/dto/UserRegisterDto';
import { CreateSettingsDto } from './dtos/create-settings.dto';
import type { UserDto } from './dtos/user.dto';
import type { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserEntity } from './user.entity';
import { UserSettingsEntity } from './user-settings.entity';
import { queryPagination } from '../../common/utils';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserSettingsEntity)
    private userSettingRepository: Repository<UserSettingsEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>, // private validatorService: ValidatorService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger, // private awsS3Service: AwsS3Service, // private commandBus: CommandBus,
  ) {}

  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOneBy(findData);
  }

  async findByUsernameOrEmail(
    options: Partial<{ username: string; email: string }>,
  ): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.settings', 'settings');

    if (options.email) {
      queryBuilder.orWhere('user.email = :email', {
        email: options.email,
      });
    }

    if (options.username) {
      queryBuilder.orWhere('user.username = :username', {
        username: options.username,
      });
    }

    return queryBuilder.getOne();
  }

  @Transactional()
  async createUser(
    userRegisterDto: UserRegisterDto,
    file?: IFile,
  ): Promise<UserEntity> {
    const user = this.userRepository.create(userRegisterDto);

    // if (file && !this.validatorService.isImage(file.mimetype)) {
    //   throw new FileNotImageException();
    // }

    // if (file) {
    //   user.avatar = await this.awsS3Service.uploadImage(file);
    // }

    await this.userRepository.save(user);

    user.settings = await this.userSettingRepository.save({
      user,
      isEmailVerified: false,
    });

    return user;
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.settings', 'settings');

    const [users, itemCount] = await queryPagination<UserEntity>({
      query: queryBuilder,
      order: pageOptionsDto.order,
      page: pageOptionsDto.page,
      take: pageOptionsDto.take,
    });

    return users.toPageDto(
      new PageMetaDto({
        itemCount,
        pageOptionsDto,
      }),
    );
  }

  async getUser(userId: string): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.where('user.id = :userId', { userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      this.logger.error(`User with id ${userId} not found`);
      throw new InternalServerErrorException();
    }

    return {
      ...userEntity,
    };
  }
}
