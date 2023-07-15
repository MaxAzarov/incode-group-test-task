import { JwtAuthGuard } from './../auth/guards/jwt.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangeHeadDto } from './dto/change-head.dto';
import { Roles } from 'src/utils/decorators/roles';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UserRole } from './types/user-roles';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() request: Request) {
    const userId = (request as any).user.id;
    return this.usersService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id: +id });
  }

  @Patch(':id/change-head')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.Boss)
  update(@Param('id') id: string, @Body() changeHeadDto: ChangeHeadDto) {
    return this.usersService.updateUserHead(+id, changeHeadDto);
  }
}
