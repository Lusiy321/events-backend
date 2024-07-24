import {
  Resolver,
  Query,
  Mutation,
  Args,
  InputType,
  Field,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './users.model';
import { CreateUserDto } from './dto/create.user.dto';
import { PasswordUserDto } from './dto/password.user.dto';
import { SearchService } from './search.service';
import { search_result } from './dto/update.user.dto';

@InputType()
export class SearchQuery {
  @Field({ nullable: true })
  req?: string;
  @Field({ nullable: true })
  loc?: string;
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  cat?: string;
  @Field({ nullable: true })
  subcat?: string;
  @Field({ nullable: true })
  limit?: number;
}

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly searchService: SearchService,
  ) {}

  @Query(() => search_result, { name: 'allUsers' })
  async getUsers(@Args('query') query: SearchQuery): Promise<search_result> {
    try {
      return this.searchService.searchUsers(query);
    } catch (error) {
      throw error;
    }
  }

  @Query(() => User, { name: 'user' })
  async getUserById(@Args('id') id: string): Promise<User> {
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
