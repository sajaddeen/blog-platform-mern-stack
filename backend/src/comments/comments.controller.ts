import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/schemas/user.schema';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    const user = req.user as User;
    return this.commentsService.create(postId, createCommentDto, user);
  }

  @Get()
  async findAll(@Param('postId') postId: string) {
    return this.commentsService.findAllByPostId(postId);
  }

  @Get(':commentId/replies')
  async findReplies(@Param('commentId') commentId: string) {
    return this.commentsService.findReplies(commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':commentId')
  async update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ) {
    const user = req.user as User;
    return this.commentsService.update(commentId, updateCommentDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  async remove(@Param('commentId') commentId: string, @Request() req) {
    const user = req.user as User;
    return this.commentsService.remove(commentId, user);
  }
}