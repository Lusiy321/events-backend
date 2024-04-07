import { Module } from '@nestjs/common';
import { LiveService } from './live.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Live, LiveSchema } from './live.model';
import { User, UserSchema } from 'src/users/users.model';
import { LiveController } from './live.controller';
import { LiveResolver } from './live.resolver';
import { CloudinaryService } from 'src/users/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Live.name, schema: LiveSchema, collection: 'live' },
      { name: User.name, schema: UserSchema, collection: 'users' },
    ]),
  ],
  controllers: [LiveController],
  providers: [LiveService, LiveResolver, CloudinaryService],
})
export class LiveModule {}
