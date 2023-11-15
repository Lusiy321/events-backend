/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { role } from './dto/role.admin.dto';

export type AdminDocument = Admin & Document;

@Schema({ versionKey: false, timestamps: true })
export class Admin extends Model<Admin> {
  @ApiProperty({ example: 'Volodymyr', description: 'Admin first name' })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 20,
  })
  username: string;

  @ApiProperty({ example: 'admin-123', description: 'Admin password' })
  @Prop({
    type: String,
    minlength: 8,
    required: [true, 'Password is required'],
  })
  password: string;

  @ApiProperty({
    example: 'https://',
    description: 'User avatarURL',
  })
  @Prop({
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  })
  avatar: string;

  @ApiProperty({
    example: '"admin" ,"moderator", "smm", "contentManager"',
    description: 'Admin role',
  })
  @Prop({
    type: String,
    enum: ['admin', 'moderator', 'smm', 'contentManager'],
    default: 'moderator',
  })
  role: role;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2EzNzhiNGU4MTk3ODYzMzkwMTUyYSIsImlhdCI6MTY4NTczMTIxNCwiZXhwIjoxNjg1ODE3NjE0fQ.rxH3-wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
    description: 'JWT token',
  })
  @Prop({ type: String, default: null })
  token: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
