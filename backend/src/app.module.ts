import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { RoomModule } from './room/room.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'dario',
      password: 'password',
      database: 'smalltalk',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    RoomModule,
    UserModule,
  ],
  providers: [ChatGateway],
})
export class AppModule {}
