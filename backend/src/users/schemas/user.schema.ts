import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';



export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  
  _id: Document['_id'];
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;
}





export const UserSchema = SchemaFactory.createForClass(User);