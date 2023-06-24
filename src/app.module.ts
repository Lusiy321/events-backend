import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({envFilePath: '.env'}),
    UsersModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: '192.168.0.103',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'postgres',
      models: [User],
      autoLoadModels: true
    }),
  ],
})
export class AppModule {}
