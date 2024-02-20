import { IsNotEmpty, IsString } from 'class-validator';

export interface userPostData {
    email:string
    password : string
}


export interface userGetData {
    id : string
    email : string 
    verified: boolean
}

// refresh-token.dto.ts


export class RefreshTokenDto {
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}
