import { Body, Controller, Get, Param, Post, Query, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryFilterDto } from './dto/query-filter.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto as any);
  }

  @Get()
  findAllUsers(@Query() queryFilter: QueryFilterDto) {
    return this.usersService.findAll(queryFilter.filter, queryFilter.page);
  }

  @Get(':id')
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}
