import { CacheModule, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity'
import { AuthModule } from 'src/auth/auth.module';
import { Product } from '../product/entities/product.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Product]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
