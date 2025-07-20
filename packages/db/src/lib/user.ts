import { prisma } from "./prisma"

export async function createUser(name: string,email: string, hashedPassword: string) {
    return await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword,
        },
    })
}

export async function getUserByEmail(email: string) {
    return await prisma.user.findUnique({
        where: { email },
    });
}

export async function getUserByUniqueID(id: string) {
    return await prisma.user.findUnique({
        where: { id },
    });
}