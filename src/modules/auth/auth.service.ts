import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { StatusCodesList } from '../../common/constants/status-codes-list.constants';
import { TokenType } from '../../common/constants/token-type';
import { CustomHttpException } from '../../common/exception/custom-http.exception';
import { validateHash } from '../../common/utils';
import { ApiConfigService } from '../../shared/services/api-config.service';

import type { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import type { UserLoginDto } from './dto/UserLoginDto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async createAccessToken(data: { userId: string }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
      }),
    });
  }

  async login(userLoginDto: UserLoginDto): Promise<UserEntity> {
    try {
      const user = await this.userService.findOne({
        email: userLoginDto.email,
      });

      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await validateHash(
        userLoginDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new Error("Password doesn't match");
      }
      return user!;
    } catch (error) {
      this.logger.error(error);
      throw new CustomHttpException({
        statusCode: HttpStatus.UNAUTHORIZED,
        code: StatusCodesList.EmailOrPasswordIncorrect,
        // error: "User doesn't exist",
        message: "User doesn't exist1",
      });
    }
  }
}
