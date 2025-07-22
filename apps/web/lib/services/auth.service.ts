import { NextRequest,NextResponse } from "next/server";
import { logInSchema,RegisterSchema,JwtPayLoad } from "@repo/types/authTypes";
import { cookies } from "next/headers";
import { createUser, getUserByEmail } from "@repo/db/index";
import { hashPassword, comparePasswords } from "@repo/auth-utils/index"
import { jwtSign } from "@repo/auth-utils/index";

import { JWT_SECRET } from "@/app/constants/constant";
import { SALT_ROUNDS } from "@/app/constants/constant";

export async function loginService(request: NextRequest){
    try {
        const body = await request.json()
        const result = logInSchema.safeParse(body);
        if(!result.success){
            return NextResponse.json({ error: "Internal Server Error" }, { status: 403 });
        }
        const { email , password } = result.data;
        const user = await getUserByEmail(email);
        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const passwordMatched = await comparePasswords(password , user.hashedPassword);
        if(!passwordMatched){
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }
        const payload: JwtPayLoad = {userId: user.id, email: user.email};
        const token = jwtSign(payload, JWT_SECRET as string);
        if(!token){
            return NextResponse.json({ message: "Token could not be created" }, { status: 500 });
        }
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60,
        })
        return NextResponse.json({ message: "Login successful"} ,{ status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error in logging in" }, { status: 500 });
    }
}

export async function registerService(request: NextRequest){
    try {
        const body = await request.json()
        const result = RegisterSchema.safeParse(body);
        if(!result.success){
            return NextResponse.json({ error: "Internal Server Error" }, { status: 403 });
        }
        const { name, email , password } = result.data;
        const exisitingUser = await getUserByEmail(email);
        if(exisitingUser){
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }
        const hashedPassword = await hashPassword(password, SALT_ROUNDS);
        const user = await createUser(name,email,hashedPassword);
        const token = jwtSign({userId: user.id, email: user.email}, JWT_SECRET as string);
        if(!token){
            return NextResponse.json({ message: "Token could not be created" }, { status: 500 });
        }
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60,
        })
        return NextResponse.json({ message: "Login successful"} ,{ status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error in logging in" }, { status: 500 });
    }
}