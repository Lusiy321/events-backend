import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './users.model';
import { CreateUserDto } from './dto/create.user.dto';
import { PasswordUserDto } from './dto/password.user.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  async getUsers() {
    return this.usersService.findAllUsers();
  }

  @Query(() => User, { name: 'user' })
  async getUserById(@Args('id') id: string) {
    return this.usersService.findById(id);
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @Mutation(() => User)
  async deleteUser(req: object, @Args('password') password: PasswordUserDto) {
    return this.usersService.deleteUserProfile(req, password);
  }
}
