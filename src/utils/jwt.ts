import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET ;
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

// Validate required env variables
if (!JWT_SECRET || !JWT_SECRET) 
{
    throw new Error('JWT_SECRET environment variable is required');
}

export interface JwtPayload 
{
    id: string;
    email: string;
    role: 'customer' | 'bank';
    bankId: string;
}


export const generateToken = (payload: JwtPayload): string => {
    try 
    {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    } 
    catch (error) 
    {
        console.error('Token generation error:', error);
        throw new Error('Failed to generate authentication token');
    }
};


export const verifyToken = (token: string): JwtPayload => {
    try 
    {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } 
    catch (error) 
    {
        throw new Error('Invalid or expired token');
    }
};

export const decodeToken = (token: string): JwtPayload | null => {
    return jwt.decode(token) as JwtPayload | null;
};