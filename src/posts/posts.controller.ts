import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create.posts.dto';
import { Posts } from './posts.model';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Create Post' })
  @ApiResponse({ status: 201, type: Posts })
  @Post('/')
  async createPost(@Body() post: CreatePostDto): Promise<Posts> {
    return this.postsService.create(post);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, type: Posts })
  @Get('/')
  async findPosts(): Promise<Posts[]> {
    return this.postsService.findAllPosts();
  }

  @ApiOperation({ summary: 'Get post by ID' })
  @ApiResponse({ status: 200, type: Posts })
  @Get('/:id')
  async findPostById(@Param('id') id: string): Promise<Posts> {
    return this.postsService.findById(id);
  }

  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({ status: 200, type: Posts })
  @Put('/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() post: CreatePostDto,
  ): Promise<Posts> {
    return this.postsService.postUpdate(id, post);
  }

  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({ status: 200, type: Posts })
  @Delete('/:id')
  async deletePost(@Param('id') id: string): Promise<Posts> {
    return this.postsService.postDelete(id);
  }
}
