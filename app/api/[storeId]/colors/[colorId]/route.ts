import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { Color } from "@prisma/client";
import { NextResponse } from "next/server";

interface Params {
  params: {
    storeId: string;
    colorId: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    if (!params.colorId) return new NextResponse("Color id is required!", { status: 422 });

    const color = await prismadb.color.findUnique({ where: { id: params.colorId } });
    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_ID_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    const body: Color = await req.json();
    const { name, value } = body;
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 422 });
    if (!value) return new NextResponse("Value is required", { status: 422 });
    if (!params.storeId) return new NextResponse("Store id is required!", { status: 422 });
    if (!params.colorId) return new NextResponse("Color id is required!", { status: 422 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: params.storeId, userId } });
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });
    const color = await prismadb.color.updateMany({
      where: { id: params.colorId },
      data: { name, value },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_ID_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!params.storeId) return new NextResponse("Store id is required!", { status: 422 });
    if (!params.colorId) return new NextResponse("Color id is required!", { status: 422 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: params.storeId, userId } });
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const color = await prismadb.color.deleteMany({ where: { id: params.colorId } });
    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
