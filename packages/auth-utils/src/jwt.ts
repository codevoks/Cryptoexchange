// import jwt from "jsonwebtoken";
import { SignJWT, jwtVerify } from "jose";
import { JwtPayLoad } from "../../types/src/authTypes";

const encoder = new TextEncoder();

export async function jwtSign(payload: JwtPayLoad, JWT_SECRET: string) {
  try {
    const secret = encoder.encode(JWT_SECRET);
    // return jwt.sign(payload, JWT_SECRET as string, { expiresIn: "1h" });
    // Create a JWT that expires in 1 hour
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    return token;
  } catch (error) {
    return null;
  }
}

export async function verifyJWT(token: string, JWT_SECRET: string) {
  try {
    const secret = encoder.encode(JWT_SECRET);
    // return jwt.verify(token, JWT_SECRET) as JwtPayLoad;
    const { payload } = await jwtVerify(token, secret);
    return payload as JwtPayLoad;
  } catch (error) {
    return null;
  }
}
