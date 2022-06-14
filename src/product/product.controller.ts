import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create Product' })
  @ApiResponse({ status: 201, description: 'Created Successfully.', type: Product})
  @ApiBody({ type: CreateProductDto })
  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Post('user/:uid/product/:pid')
  addProductToUser(@Param('uid', ParseIntPipe) uid: number, @Param('pid', ParseIntPipe) pid: number ): Promise<string>
  {
    return this.productService.addProductToUser(uid, pid);
  }



  @ApiOperation({ summary: 'Get All Products' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: [Product],
  })
  @Get()
  findAll(): Promise<Product[]>{
    return this.productService.findAll();
  }

  @ApiOperation({ summary: 'Get a Product' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Product,
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a Product' })
  @ApiResponse({
    status: 200,
    description: 'The record is Updated',
    type: Product
  })
  @ApiBody({ type: UpdateProductDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productService.update(+id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete a Product' })
  @ApiResponse({
    status: 200,
    description: 'The record is Deleted',
    type: "string",
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Object> {
    return this.productService.remove(+id);
  }
}
