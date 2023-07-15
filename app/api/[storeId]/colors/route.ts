import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { Color } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const body: Color = await req.json();
    const { name, value } = body;
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 422 });
    if (!value) return new NextResponse("Value is required", { status: 422 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: params.storeId, userId } });
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });
    const color = await prismadb.color.create({ data: { name, value, storeId: params.storeId } });
    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLORS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const colors = await prismadb.color.findMany({ where: { storeId: params.storeId } });
    return NextResponse.json(colors);
  } catch (error) {
    console.log("[COLORS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
