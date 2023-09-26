import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.model';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { SessionSerializer } from './utils/Serializer';
import { FacebookStrategy } from './utils/facebook.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1day' },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'users' },
    ]),
    PassportModule.register({ defaultStrategy: 'facebook' }),
  ],
  providers: [
    GoogleStrategy,
    FacebookStrategy,
    SessionSerializer,
    { provide: 'USER_SERVICE', useClass: UsersService },
    UsersService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
