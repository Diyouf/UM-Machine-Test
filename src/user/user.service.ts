import { Injectable } from '@nestjs/common';
import { userGetData } from '../model/user.interface';
import { PrismaService } from '../config/prisma.service';
import * as  bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }
    async getUserProfile(id: string): Promise<{ success: boolean, userData?: userGetData, error?: string }> {
        try {
            if (!id) return { success: false, error: 'userId is required' }
            // Fetch the user by ID
            const user = await this.prisma.user.findFirst({
                where: {
                    id
                }
            })
             // If user not found, return error
            if (!user) return { success: false, error: 'no data found' }
            return { success: true, userData: user }

        } catch (error) {
            return { success: false, error: 'an error at fetching user profile' }
        }
    }

    async updateUser(id: string, data: { email?: string, password?: string }): Promise<{ success: boolean, userData?: userGetData, error?: string }> {
        try {
            if (!id) return { success: false, error: 'userId is required' }
            if (!data) return { success: false, error: 'updating data is required' }

            const { email, password } = data;

            // Fetch the user by ID
            const user = await this.prisma.user.findUnique({
                where: { id },
            });

            // If user not found, return error
            if (!user) return { success: false, error: 'User not found' };

            // If email is provided, update the email
            if (email) {
                const updatedUser = await this.prisma.user.update({
                    where: { id },
                    data: { email },
                });
                if (!updatedUser) return { success: false, error: 'Failed to update email' };
            }
            // If password is provided, update the password
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const updatedUser = await this.prisma.user.update({
                    where: { id },
                    data: { password: hashedPassword },
                });
                if (!updatedUser) return { success: false, error: 'Failed to update password' };
            }

            // Fetch and return updated user data
            const updatedUserData = await this.prisma.user.findUnique({
                where: { id },
            });

            return { success: true, userData: updatedUserData };

        } catch (error) {
            console.error(error);
            return { success: false, error: 'An error occurred while updating user' };
        }
    }


}
