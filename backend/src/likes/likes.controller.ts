import { Controller, Post, Param, Delete, UseGuards, Request, Get } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/schemas/user.schema';

@Controller('posts/:postId/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async likePost(@Param('postId') postId: string, @Request() req) {
    const user = req.user as User;
    return this.likesService.likePost(postId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async unlikePost(@Param('postId') postId: string, @Request() req) {
    const user = req.user as User;
    return this.likesService.unlikePost(postId, user);
  }
}