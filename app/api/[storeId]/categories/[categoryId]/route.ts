import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { Category } from "@prisma/client";
import { NextResponse } from "next/server";

interface Params {
  params: {
    storeId: string;
    categoryId: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    if (!params.categoryId) return new NextResponse("Category id is required!", { status: 422 });

    const category = await prismadb.category.findUnique({
      where: { id: params.categoryId },
      include: { billboard: true },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_ID_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    const body: Category = await req.json();
    const { name, billboardId } = body;
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 422 });
    if (!billboardId) return new NextResponse("Billboard ID is required", { status: 422 });
    if (!params.storeId) return new NextResponse("Store id is required!", { status: 422 });
    if (!params.categoryId) return new NextResponse("Category id is required!", { status: 422 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: params.storeId, userId } });
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });
    const category = await prismadb.category.updateMany({
      where: { id: params.categoryId },
      data: { name, billboardId },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_ID_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!params.storeId) return new NextResponse("Store id is required!", { status: 422 });
    if (!params.categoryId) return new NextResponse("Category id is required!", { status: 422 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: params.storeId, userId } });
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const category = await prismadb.category.deleteMany({ where: { id: params.categoryId } });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
