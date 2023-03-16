import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { BaseResponseDto } from "../../common/abstract.dto";
import { BaseResponse, SimpleResponse } from "../../common/dto/page.dto";

import { AuthUser } from "../../decorators";
import { UserDto } from "../user/dtos/user.dto";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { LoginPayloadDto } from "./dto/LoginPayloadDto";
import { UserLoginDto } from "./dto/UserLoginDto";
import { UserRegisterDto } from "./dto/UserRegisterDto";

@Controller("auth")
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post("/login")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: "User info with access token",
  })
  async login(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<SimpleResponse<LoginPayloadDto>> {
    const userEntity = await this.authService.login(userLoginDto);

    const token = await this.authService.generateAuthToken(userEntity);
    return new SimpleResponse(
      new LoginPayloadDto(userEntity.toDto(), token),
      "User logged in successfully",
    );
  }

  @Post("/register")
  @HttpCode(HttpStatus.OK)
  async register(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<SimpleResponse<void>> {
    await this.userService.createUser(userRegisterDto);

    return new SimpleResponse(null, "User created successfully");
  }

  @Get("/me")
  @HttpCode(HttpStatus.OK)
  // @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({ type: UserDto, description: "current user info" })
  getCurrentUser(@AuthUser() user: UserEntity): SimpleResponse<UserDto> {
    return new SimpleResponse(user.toDto(), "User info");
  }
}
