import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Live } from './live.model';
import { LiveService } from './live.service';
import { CreateLiveDto, SearchLive, search_live } from './dto/create.live.dto';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';
@Resolver(() => Live)
export class LiveResolver {
  cloudinaryService: any;
  usersService: any;
  constructor(private readonly liveService: LiveService) {}

  @Query(() => search_live, { name: 'messages' })
  async getMessages(@Args('query') query: SearchLive): Promise<search_live> {
    return this.liveService.findAllUsersMessage(query);
  }

  @Mutation(() => Live)
  async createMessage(
    @Context() context: any,
    @Args({ name: 'image', type: () => GraphQLUpload, nullable: true })
    image: Upload,
    @Args('data')
    data: CreateLiveDto,
  ): Promise<Live> {
    try {
      console.log(data, image);
      const file = await image;
      return await this.liveService.createMessage(context.req, data, file);
    } catch (error) {
      throw error;
    }
  }
}
