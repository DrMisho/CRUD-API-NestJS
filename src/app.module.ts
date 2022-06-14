import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity'
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'nest_test',
    autoLoadEntities: true,
    synchronize: true,
    entities: [User, Product]
  }), 
  ConfigModule.forRoot({isGlobal: true}),
  ThrottlerModule.forRoot({
    ttl: 2,
    limit: 1,
  }),
  UserModule,
  AuthModule, 
  ProductModule,
  CacheModule.register<RedisClientOptions>({
    store: redisStore,
    socket: {
      host: '127.0.0.1',  // This is ignored and `127.0.0.1` is used instead
      port: 6379
    },
    isGlobal: true,
    ttl: 1000
  }),
  
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }
  ],
})
export class AppModule {}
