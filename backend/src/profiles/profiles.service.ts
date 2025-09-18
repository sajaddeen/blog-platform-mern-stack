import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ProfilesService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findProfileByUsername(username: string): Promise<User> {
    const user = await this.userModel
      .findOne({ username })
      .populate('posts')
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}