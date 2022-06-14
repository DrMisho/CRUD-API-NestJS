import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from '../product/entities/product.entity'
import { User } from '../user/entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product]), AuthModule],
  controllers: [ProductController],
  providers: [ProductService, UserService],
  exports: [ProductService]
})
export class ProductModule {}
