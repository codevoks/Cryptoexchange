import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from '@repo/auth-utils/jwt';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const PUBLIC_PATHS = ['/','home','/login','/about','/register'];
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  if(isPublicPath){   //let the request go
    return NextResponse.next();
  }
  const token = request.cookies.get('token')?.value;
  if(!token){
    return NextResponse.redirect(new URL('/login', request.url));
  }
  try {
    const payload = await jwtVerify(token, JWT_SECRET as string);
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch (error) {
    console.error('JWT verification failed:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}