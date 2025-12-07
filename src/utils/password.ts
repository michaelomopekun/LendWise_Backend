import bcrypt from 'bcrypt';

/**
 * Hash a password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

/**
 * Compare a plain text password with a hashed password
 * @param password Plain text password to verify
 * @param hash Hashed password to compare against
 * @returns True if passwords match, false otherwise
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error;
    }
}