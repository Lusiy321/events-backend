import { Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LiveService } from './live.service';
import { Live } from './live.model';

@ApiTags('Live')
@Controller('live')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  @ApiOperation({ summary: 'Like post' })
  @ApiResponse({ status: 200, type: Live })
  @HttpCode(200)
  @Post('like')
  async like(req: any, postId: string) {
    return this.liveService.addLike(req, postId);
  }

  @ApiOperation({ summary: 'Dislike post' })
  @ApiResponse({ status: 200, type: Live })
  @HttpCode(200)
  @Post('dislike')
  async dislike(req: any, postId: string) {
    return this.liveService.addDislike(req, postId);
  }

  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({ status: 200, type: Live })
  @HttpCode(200)
  @Delete('delete')
  async deletePost(req: any, postId: string) {
    return this.liveService.deletePost(req, postId);
  }
}
