import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/product/entities/product.entity'

@Entity('user')
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ length: 30 })
    name: string;

    @ApiProperty()
    @Column({ length: 100 })
    password: string;

    @ApiProperty()
    @Column()
    age: number;

    @ManyToMany(
        type => Product, product => product.users
      )
      @JoinTable({
        name: "users_products",
        joinColumn: {
          name: "user",
          referencedColumnName: "id"
        },
        inverseJoinColumn: {
          name: "product",
          referencedColumnName: "id"
        }
      })
      products: Product[]
}
