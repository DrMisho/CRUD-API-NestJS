import { Injectable, CanActivate, Inject, forwardRef, ExecutionContext } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { UserInterface } from "src/user/interface/user.interface";

@Injectable()
export class UserIsUserGuard implements CanActivate{

    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const params = request.params;
        const user: UserInterface = request.user;

        const user_returned = await this.userService.findOne(user.id);
        if(user_returned.id === Number(params.id))
        {
            return true
        }
        return false;
    }
}