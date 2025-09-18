import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async create(
    postId: string,
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    const createdComment = new this.commentModel({
      ...createCommentDto,
      post: postId,
      author: user._id,
    });
    return createdComment.save();
  }

  async findAllByPostId(postId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ post: postId, parentComment: null })
      .populate('author', 'username')
      .exec();
  }

  async findReplies(commentId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ parentComment: commentId })
      .populate('author', 'username')
      .exec();
  }

  async update(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
    user: User,
  ): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId).exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.toString() !== user._id.toString()) {
      throw new ForbiddenException('You do not have permission to update this comment.');
    }

    const updatedComment = await this.commentModel
      .findByIdAndUpdate(commentId, updateCommentDto, { new: true })
      .exec();
    return updatedComment;
  }

  async remove(commentId: string, user: User): Promise<any> {
    const comment = await this.commentModel.findById(commentId).exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.toString() !== user._id.toString()) {
      throw new ForbiddenException('You do not have permission to delete this comment.');
    }

    await this.commentModel.deleteOne({ _id: commentId }).exec();
    return { message: 'Comment deleted successfully' };
  }
}