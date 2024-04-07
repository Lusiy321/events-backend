/* eslint-disable prettier/prettier */
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Live } from '../live.model';

@InputType()
export class CreateLiveDto {
  @Field()
  @ApiProperty({ example: 'Some text', description: 'Users text of post' })
  readonly content: string;
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'https://', description: 'Img URL' })
  readonly image?: string;
}

@InputType()
export class SearchLive {
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
}

@ObjectType()
export class search_live {
  @Field()
  totalPages: number;

  @Field()
  currentPage: number;

  @Field(() => [Live])
  data: Live[];
}
