import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { Size } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const body: Size = await req.json();
    const { name, value } = body;
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 422 });
    if (!value) return new NextResponse("Value is required", { status: 422 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: params.storeId, userId } });
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });
    const size = await prismadb.size.create({ data: { name, value, storeId: params.storeId } });
    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const sizes = await prismadb.size.findMany({ where: { storeId: params.storeId } });
    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[SIZES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
