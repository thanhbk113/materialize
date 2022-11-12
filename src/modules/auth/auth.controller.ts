import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthUser } from '../../decorators';
import { UserDto } from '../user/dtos/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/LoginPayloadDto';
import { UserLoginDto } from './dto/UserLoginDto';
import { UserRegisterDto } from './dto/UserRegisterDto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async login(@Body() userLoginDto: UserLoginDto): Promise<LoginPayloadDto> {
    const userEntity = await this.authService.login(userLoginDto);

    const token = await this.authService.generateAuthToken(userEntity);
    return new LoginPayloadDto(userEntity.toDto(), token);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  async register(@Body() userRegisterDto: UserRegisterDto): Promise<UserDto> {
    const createdUser = await this.userService.createUser(userRegisterDto);

    return {
      ...createdUser,
      isActive: true,
    };
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  // @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  getCurrentUser(@AuthUser() user: UserEntity): UserDto {
    return {
      ...user,
    };
  }
}
