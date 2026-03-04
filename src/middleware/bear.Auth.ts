import dotenv from 'dotenv';
import e, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();


export const checkroles = (requiredfields : "admin"|"student"|"both") => {
    return (req: Request, res: Response, next: NextFunction) => {
        const autHeader = req.headers['authorization'];
        if (!autHeader || !autHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }   
        const token = autHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) ;
            (req as any).user = decoded;
             
            if (typeof(decoded) === 'object' && decoded !== null && 'role' in decoded) {
                if (requiredfields === "both") {
                    if (decoded.role === "admin" || decoded.role === "student") {
                        return next();
                    }
                } else if (decoded.role === requiredfields) {
                    return next();
                }
                res.status(401).json({ message: 'Unauthorized' });
                return;
            } else {
                res.status(401).json({ message: 'Invalid token' });
                return;
            }
        } catch (err) {   
            console.error(err);
            return res.status(403).json({ message: 'Forbidden' });
        }   
    };
};
            
// export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
//     const authHeader = req.headers['authorization'];
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
   
//    const token = authHeader.split(' ')[1];
        
//         if (!token) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }
//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET as string) ;
//             (req as any).user = decoded;
//             next();
//         } catch (err) {
//             console.error(err);
//             return res.status(403).json({ message: 'Forbidden' });
//         }

//     };
