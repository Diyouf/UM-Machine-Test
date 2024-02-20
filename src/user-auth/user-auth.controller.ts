import { Body, Controller, Get, Post, Query, UnauthorizedException } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { RefreshTokenDto, userGetData, userPostData } from '../model/user.interface';


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

    @Post('/userLogin')
    async userLogin(@Body() data : userPostData ): Promise<{ success: boolean; token?: string ; error?: string }>{
        return this.service.userLogin(data)
    }

    @Post('/refreshToken')
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<{success: boolean, token: string }> {
        try {
            const { refreshToken } = refreshTokenDto;
            const newToken = await this.service.refreshToken(refreshToken);
            return { success: true, token: newToken };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

}
