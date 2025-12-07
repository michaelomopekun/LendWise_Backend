import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// -------------------------------------------------------------------
// ENV VARIABLES
// -------------------------------------------------------------------
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

// Validate
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}

// -------------------------------------------------------------------
// JWT PAYLOAD
// -------------------------------------------------------------------
export interface JwtPayload {
    id: string;
    email: string;
    role: "customer" | "bank";
    bankId: string;
}

// -------------------------------------------------------------------
// GENERATE TOKEN
// -------------------------------------------------------------------
export const generateToken = (payload: JwtPayload): string => {
    try {
        const options: SignOptions = {
            // expiresIn: JWT_EXPIRY,  // <-- Now valid for your typings
            algorithm: "HS256"
        };

        return jwt.sign(payload, JWT_SECRET, options);
    } catch (error) {
        console.error("Token generation error:", error);
        throw new Error("Failed to generate authentication token");
    }
};

// -------------------------------------------------------------------
// VERIFY TOKEN
// -------------------------------------------------------------------
export const verifyToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        console.error("Token verification error:", error);
        throw new Error("Invalid or expired token");
    }
};

// -------------------------------------------------------------------
// DECODE TOKEN
// -------------------------------------------------------------------
export const decodeToken = (token: string): JwtPayload | null => {
    try {
        return jwt.decode(token) as JwtPayload | null;
    } catch (error) {
        console.error("Token decode error:", error);
        return null;
    }
};
