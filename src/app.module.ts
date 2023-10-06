import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { User, UserSchema } from './users/users.model';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { Category, CategorySchema } from './users/category.model';
import { TelegramService } from './telegram/telegram.service';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, TelegramService,],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    MongooseModule.forRoot(process.env.DB_HOST),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'users' },
    ]),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema, collection: 'categories' },
    ]),
    UsersModule,
    TelegramModule,
  ],
})
export class AppModule {}
