import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, from } from 'rxjs';
import { UserInterface } from 'src/user/interface/user.interface';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService){}

    generateJWT(user: UserInterface): Observable <string> {
        return from(this.jwtService.signAsync({user}));
    }

    hashPassword(password: string): Observable <string> {
        return from<string>(bcrypt.hash(password, 12));

    }

    comparePasswords(newPassword: string, passwortHash: string): Observable<any>{
        return from(bcrypt.compare(newPassword, passwortHash));
    }

}
