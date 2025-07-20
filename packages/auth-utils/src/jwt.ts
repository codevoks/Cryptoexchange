import jwt from "jsonwebtoken";
import { JwtPayLoad } from "../../types/src/authTypes";

export function jwtSign(payload: JwtPayLoad, JWT_SECRET: string){
    try{
        return jwt.sign(payload, JWT_SECRET as string, { expiresIn: '1h' });
    } catch (error){
        return null;
    }
}

export function jwtVerify(token: string, JWT_SECRET: string){
    try {
        return jwt.verify(token , JWT_SECRET) as JwtPayLoad;
    } catch (error) {
        return null;
    }
}