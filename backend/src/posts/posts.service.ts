import {
  Injectable,
  NotFoundException,
  ForbiddenException,
}
from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const createdPost = new this.postModel({ ...createPostDto, author: user._id });
    return createdPost.save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().populate('author', 'username email').exec();
  }


async findByUser(userId: string): Promise<Post[]> {
  return this.postModel
    .find({ author: userId })
    .populate('author', 'username email')
    .exec();
}

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).populate('author', 'username email').exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: User): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.author.toString() !== user._id.toString()) {
      throw new ForbiddenException('You do not have permission to update this post.');
    }
    const updatedPost = await this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true }).exec();
    return updatedPost;
  }

  async remove(id: string, user: User): Promise<any> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.author.toString() !== user._id.toString()) {
      throw new ForbiddenException('You do not have permission to delete this post.');
    }
    const result = await this.postModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Post not found');
    }
    return { message: 'Post deleted successfully' };
  }

  // New method for searching posts
  async search(query: string): Promise<Post[]> {
    if (!query) {
      return this.findAll();
    }
    return this.postModel
      .find({
        $text: { $search: query },
        status: 'published'
      })
      .populate('author', 'username email')
      .exec();
  }
}