import { NextRequest,NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest){
    try {
        const cookieStore = await cookies();
        const hasCookie = cookieStore.has("token");
        if(!hasCookie){
            return NextResponse.json({ message: "Authentication token not found" }, { status: 400 });
        }
        (await cookies()).delete("token");
        return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to log out" }, { status: 400 });
    }
}