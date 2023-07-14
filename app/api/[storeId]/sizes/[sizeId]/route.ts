import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { Size } from "@prisma/client";
import { NextResponse } from "next/server";

interface Params {
  params: {
    storeId: string;
    sizeId: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    if (!params.sizeId) return new NextResponse("Size id is required!", { status: 422 });

    const size = await prismadb.size.findUnique({ where: { id: params.sizeId } });
    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_ID_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    const body: Size = await req.json();
    const { name, value } = body;
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 422 });
    if (!value) return new NextResponse("Value is required", { status: 422 });
    if (!params.storeId) return new NextResponse("Store id is required!", { status: 422 });
    if (!params.sizeId) return new NextResponse("Size id is required!", { status: 422 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: params.storeId, userId } });
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });
    const size = await prismadb.size.updateMany({
      where: { id: params.sizeId },
      data: { name, value },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_ID_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!params.storeId) return new NextResponse("Store id is required!", { status: 422 });
    if (!params.sizeId) return new NextResponse("Size id is required!", { status: 422 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: params.storeId, userId } });
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const size = await prismadb.size.deleteMany({ where: { id: params.sizeId } });
    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
