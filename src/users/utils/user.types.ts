import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Photo')
export class Photo {
  @Field()
  publicId: string;
  @Field()
  url: string;
}
@ObjectType('Social')
export class Social {
  @Field()
  Instagram?: string;
  @Field()
  Facebook?: string;
  @Field()
  Youtube?: string;
  @Field()
  TikTok?: string;
  @Field()
  Vimeo?: string;
  @Field()
  SoundCloud?: string;
  @Field()
  Spotify?: string;
  @Field()
  AppleMusic?: string;
  @Field()
  Deezer?: string;
  @Field()
  WebSite?: string;
}
@ObjectType('Categories')
export class Categories {
  @Field(() => ID)
  _id: string;
  @Field()
  name: string;
  @Field(() => [Subcategory])
  subcategories: Subcategory[];
}
@ObjectType('Subcategory')
export class Subcategory {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
}
