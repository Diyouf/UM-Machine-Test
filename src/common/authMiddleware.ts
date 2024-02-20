// auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

// Define a new interface that extends the existing Request interface
interface AuthenticatedRequest extends Request {
  user?: { userId: string, email: string }; // Define the user property with userId and email
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: AuthenticatedRequest, res: Response, next: NextFunction) { // Use the new interface
    // Retrieve the authorization header from the request\
    const authHeader = req.headers['authorization'];

    // Check if the authorization header exists and contains a Bearer token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    // Extract the token from the authorization header
    const token = authHeader.split(' ')[1];

    try {
      // Verify the token and extract the payload
      const decodedToken = jwt.verify(token, 'userToken') as { userId: string, email: string };

      // Attach the user information to the request object
      req.user = { userId: decodedToken.userId, email: decodedToken.email };

      // Call the next middleware or route handler
      next();
    } catch (error) {
      // If the token is invalid or expired, throw an UnauthorizedException
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
