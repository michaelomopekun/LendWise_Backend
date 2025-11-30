import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';

declare global 
{
    namespace Express 
    {
        interface Request 
        {
            user?: JwtPayload;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try 
    {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) 
        {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = verifyToken(token);
        req.user = decoded;

        if(req.user.role)
        
        next();
    } 
    catch (error) 
    {
        return res.status(401).json({ message: 'Invalid token', error: error });
    }
};

export const bankAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try 
    {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) 
        {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = verifyToken(token);
        req.user = decoded;

        if(req.user.role != 'bank')
        {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        next();
    } 
    catch (error) 
    {
        return res.status(401).json({ message: 'Invalid token', error: error });
    }
};