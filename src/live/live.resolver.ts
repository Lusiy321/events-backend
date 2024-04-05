import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Live } from './live.model';
import { LiveService } from './live.service';
import { CreateLiveDto } from './dto/create.live.dto';

@Resolver(() => Live)
export class LiveResolver {
  constructor(private readonly liveService: LiveService) {}

  //   @Query(() => [Live], { name: 'messages' })
  //   async getMessages() {
  //     return this.liveService.findAllUsersMessage();
  //   }

  //   @Mutation(() => Live)
  //   async createUser(req: object, @Args('data') data: CreateLiveDto) {
  //     return this.liveService.createMessage(req, data);
  //   }
}
