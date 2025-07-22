import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from '@repo/auth-utils/jwt';

import { JWT_SECRET } from '@/app/constants/constant';

export default function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const PUBLIC_PATH = ['/','home','/login','/about','/register'];
  const isPublic = PUBLIC_PATH.some((path) => pathname.startsWith(path));

  if(isPublic){   //let the request go
    return NextResponse.next();
  }
  const token = request.cookies.get('token')?.value;
  if(!token){
    return NextResponse.redirect(new URL('/login', request.url));
  }
  try {
    const payload = jwtVerify(token, JWT_SECRET as string);
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch (error) {
    console.error('JWT verification failed:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}