import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from './schemas/like.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class LikesService {
  constructor(@InjectModel(Like.name) private likeModel: Model<Like>) {}

  async likePost(postId: string, user: User): Promise<Like> {
    const existingLike = await this.likeModel.findOne({ post: postId, user: user._id }).exec();
    if (existingLike) {
      return existingLike;
    }
    const newLike = new this.likeModel({ post: postId, user: user._id });
    return newLike.save();
  }

  async unlikePost(postId: string, user: User): Promise<any> {
    const result = await this.likeModel.deleteOne({ post: postId, user: user._id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Like not found');
    }
    return { message: 'Post unliked successfully' };
  }

  async getLikesCount(postId: string): Promise<number> {
    return this.likeModel.countDocuments({ post: postId }).exec();
  }
}