import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/services/auth.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private authService: AuthService,
    @Inject(forwardRef(() => UserService))
        private userService: UserService
  )
  {}

  create(createProductDto: CreateProductDto) {
    const product = new Product();
    product.product_name = createProductDto.product_name
    product.price = createProductDto.price;
    product.available = createProductDto.available;
    return this.productsRepository.save(product);
  }

  async findAll() {
    const products = await this.productsRepository.find({});
    return products
  }

  async findOne(id: number) {
    return await this.productsRepository.findOneBy({ id: +id });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOneBy({ id: +id });
    product.product_name = updateProductDto.product_name;
    product.price = updateProductDto.price;
    product.available = updateProductDto.available;
    return this.productsRepository.save(product);
  }

  async remove(id: number) {
    await this.productsRepository.delete({id: +id})
    return { msg: "Deleted Successfully"}
  }

  async addProductToUser(uid: number, pid: number): Promise<string>
  {
    const product: Product = await this.productsRepository.findOneBy({id: pid});
    const user: User = await this.userService.findOneRelation(uid);
    if(user && product)
    {
      console.log(user)
      console.log(product)
      user.products.push(product);
      await this.userService.save(user);
      return "attached to user" 
    }
    return "Can't find User or Product"
    
  }


}
