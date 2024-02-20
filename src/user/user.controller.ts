import { Controller, Query, Get, Patch, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { userGetData } from '../model/user.interface';

@Controller('user')
export class UserController {
    constructor(private service: UserService) { }

    @Get('/userProfile')
    async getUserProfile(@Query('id') id: string): Promise<{ success: boolean, userData?: userGetData, error?: string }> {
        return this.service.getUserProfile(id)
    }

    @Patch('/userProfileUpdate')
    async updateUserProfile(@Query('id') id: string, @Body() data: { email?: string, password?: string }): Promise<{ success: boolean, userData?: userGetData, error?: string }> {
        return this.service.updateUser(id , data)
    }

}
