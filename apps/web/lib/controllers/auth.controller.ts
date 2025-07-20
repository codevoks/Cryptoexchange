import { NextRequest } from "next/server";
import { loginService, registerService } from "../services/auth.service";

export async function handleLogin(request: NextRequest){
    loginService(request);
}

export async function handleRegister(request: NextRequest){
    registerService(request);
}