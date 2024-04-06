import { Field, InputType } from '@nestjs/graphql';
import { User } from '../users.model';

@InputType()
export class SearchResultType {
  @Field()
  totalPages: number;

  @Field()
  currentPage: number;

  @Field()
  data: [User];
}
