import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { userGetData, userPostData } from 'src/model/user.interface';
import * as  bcrypt from 'bcrypt'
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserAuthService {
    constructor(private readonly prisma: PrismaService, private mailService: MailerService) { }

    generateOTP(): number {
        // Generate a random number between 1000 and 9999
        const otp = Math.floor(Math.random() * 9000) + 1000;
        return otp;
    }

    nodeMailerHelper(otp: number, email: string) {
        // Node mailer for sending Email to verifying the email
        const mailOption = {
            to: email,
            from: 'intslateofficial@gmail.com',
            subject: 'Email varification mail',
            text: `Hello This is Testing Message`,
            html: `<h1>Email Verification </h1>
                      <p>Thank you for registering. Your Verification Otp is: <strong>${otp}</strong></p>
                      <p>Best regards,</p>
                      <p>From Test</p>`,
        };
        const sended = this.mailService.sendMail(mailOption);
        if (!sended) return false
        return true
    }

    async userRegistration(userData: userPostData): Promise<{ success: boolean; status?: string; error?: string }> {
        try {
            const { email, password } = userData;
            if (!email || !password) return { success: false, error: 'input data required' }

            // 1. Efficient user search and validation:
            const existingUser = await this.prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                return { success: false, error: 'Email already registered' };
            }

            // 2. Secure password hashing with configurable salt rounds:
            const hashedPassword = await bcrypt.hash(password, 10); // Adjust salt rounds as needed

            // 3. Create the new user with proper sanitization:
            const newUser = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    verified: false, // Set initial verification status
                    // Other user attributes (validated if necessary)
                },
            });


            const otp = this.generateOTP()
            const getOtp = await this.prisma.otpModel.create({
                data: {
                    email,
                    otpNum: otp
                }
            })

            if (!getOtp) {
                return { success: false, error: 'otp not saved' }
            }

            const emailService = this.nodeMailerHelper(otp, email)

            if (!emailService) return { success: false, error: 'Email is not sended' }
            return { success: true, status: 'Otp sended in Email' }


        } catch (error) {
            console.error(error); // Log actual error details for debugging
            return { success: false, error: 'Registration failed' }; // Generic error message for user
        }
    }

    async verifyingOtp(data: { otp: number, email: string }): Promise<{ success: boolean; status?: string; error?: string }> {
        try {
            const { otp, email } = data;
    
            if (!otp || !email) {
                return { success: false, error: 'OTP and email are required' };
            }
            
    
            const otpRecord = await this.prisma.otpModel.findFirst({
                where: {
                    otpNum: Number(otp),
                    email: email
                }
            });
    
            if (!otpRecord) {
                return { success: false, error: 'OTP not matching for the provided email' };
            }
    
            // Find the user by email
            const user = await this.prisma.user.findFirst({
                where: {
                    email: email,
                },
            });
    
            if (!user) {
                return { success: false, error: 'User not found' };
            }
    
            // Update the user's verified status to true
            const updatedUser = await this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    verified: true,
                },
            });
    
            if (updatedUser) {
                return { success: true, status: 'Email is verified' };
            } else {
                return { success: false, error: 'Failed to verify email' };
            }
    
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return { success: false, error: 'An error occurred while verifying OTP' };
        }
    }
    




}
