import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "";

export interface JwtPayload 
{
    id: string;
    email: string;
    role: 'customer' | 'officer';
}

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
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