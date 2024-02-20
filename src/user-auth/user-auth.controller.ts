import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { userPostData } from 'src/model/user.interface';


@Controller('userAuth')
export class UserAuthController {
    constructor(private service: UserAuthService) { }

    @Post('/userRegistratiom')
    async testUser(@Body() userData: userPostData): Promise<{ success: boolean; status?: string; error?: string }> {
        return this.service.userRegistration(userData)
    }
    @Post('/emailVerification')
    async emailVerification(@Body() data: { otp: number, email: string }): Promise<{ success: boolean; status?: string ; error?: string }> {
        return this.service.verifyingOtp(data)
    }

}
