import { Entity, Column, PrimaryGeneratedColumn , ManyToMany} from 'typeorm';
import { User } from 'src/user/entities/user.entity'
import { ApiProperty } from '@nestjs/swagger';

@Entity('product')
export class Product {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;
  
    @ApiProperty()
    @Column("varchar", { length: 20 })
    product_name: string;
  
    @ApiProperty()
    @Column("numeric")
    price: string;

    @ApiProperty()
    @Column("boolean", { default: true })
    available: boolean;

    @ManyToMany(
        type => User , user => user.products
    )
    users: User[]
}
