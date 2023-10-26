import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.model';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { SessionSerializer } from './utils/Serializer';
import { Category, CategorySchema } from './category.model';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1day' },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'users' },
    ]),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema, collection: 'categories' },
    ]),
    TelegramModule,
  ],
  providers: [
    GoogleStrategy,
    SessionSerializer,
    { provide: 'USER_SERVICE', useClass: UsersService },
    UsersService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
