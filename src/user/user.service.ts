import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { from, map, Observable, switchMap } from 'rxjs';
import { UserInterface } from './interface/user.interface'
import { AuthService } from 'src/auth/services/auth.service';
import { Cache } from 'cache-manager';



@Injectable()
export class UserService {
  
  private readonly users: User[] = [];
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache  
  ) 
  {
   
  }
  

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.name = createUserDto.name;
    user.age = createUserDto.age;
    const hashedPassword = await bcrypt.hash(createUserDto.password, 11);
    user.password = hashedPassword;
    return this.usersRepository.save(user);
  }

 async findAll(): Promise<User[]> {{
    if(await this.cacheManager.get('users'))
    {
      const users: any = await this.cacheManager.get('users');
      console.log('cacheManager hit')
      return JSON.parse(users)
      
    }
    const users = await this.usersRepository.find({relations: ["products"]});
    const error = await this.cacheManager.set('users', JSON.stringify(users));
    console.log(error);
    console.log('cacheManager missed')
    return users;
  }
}

  async findOne(id: number) {
    if(await this.cacheManager.get(`user: ${id}`))
    {
      const user: any = await this.cacheManager.get(`user: ${id}`);
      console.log('cacheManager hit')
      return JSON.parse(user)
    }
    const user = await this.usersRepository.findOneBy({ id: +id });
    await this.cacheManager.set(`user: ${id}`, JSON.stringify(user));
    console.log('cacheManager missed')
    return user;
  }

  login(user: UserInterface) {
    return this.validateUser(user.name, user.password).pipe(
        switchMap((user: UserInterface) => {
            if(user) {
                return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
            } else {
                return 'Wrong Credentials';
            }
        })
    )
  }

  validateUser(name: string, password: string): Observable<UserInterface> {
    console.log(name, password)
    return from(this.usersRepository.findOneBy({name: name})).pipe(
        switchMap((user: UserInterface) => this.authService.comparePasswords(password, user.password).pipe( map((match: boolean) => {
                if(match) {
                    const {password, ...result} = user;
                    return result;
                } else {
                    throw Error;
                }
            })
        ))
    )

}

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id: +id });
    user.name = updateUserDto.name;
    user.age = updateUserDto.age;
    const hashedPassword = await bcrypt.hash(updateUserDto.password, 11);
    user.password = hashedPassword;
    if(await this.cacheManager.get(`user: ${id}`))
    {
      await this.cacheManager.del(`user: ${id}`)
    }
    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    if(await this.cacheManager.get(`user: ${id}`))
    {
      await this.cacheManager.del(`user: ${id}`)
    }
    return await this.usersRepository.delete({id: +id})
  }

  async save(user: User)
  {
    await this.usersRepository.save(user)
  }

  async findOneRelation(id: number)
  {
    return await this.usersRepository.findOne({ where: {id: +id}, relations: ["products"] });
  }
}
