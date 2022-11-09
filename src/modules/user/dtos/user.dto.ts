export class UserDto {
  firstName?: string;

  lastName?: string;

  // @ApiPropertyOptional({ enum: RoleType })
  // role: RoleType;

  email?: string;

  avatar?: string;

  phone?: string;

  isActive?: boolean;
}
