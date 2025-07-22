import { NextRequest,NextResponse } from "next/server";
import { RegisterSchema } from "@repo/types/authTypes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { createUser, getUserByEmail } from "@repo/db/index";

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

export async function POST(request: NextRequest){
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
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await createUser(name,email,hashedPassword);
        const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET as string, { expiresIn: '1h' });
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60,
        })
        return NextResponse.json({ message: "Registration successful"} ,{ status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error in registering user" }, { status: 500 });
    }
}