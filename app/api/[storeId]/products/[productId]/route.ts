import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { Product, Store } from "@prisma/client";
import { NextResponse } from "next/server";

interface Params {
  params: {
    storeId: string;
    productId: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    if (!params.productId) return new NextResponse("Product id is required!", { status: 422 });

    const product = await prismadb.product.findUnique({
      where: { id: params.productId },
      include: { images: true, category: true, color: true, size: true },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_ID_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    const body: Product & { images: { url: string }[] } = await req.json();
    const { name, price, categoryId, sizeId, images, isArchived, colorId, isFeatured } = body;
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 422 });
    if (!price) return new NextResponse("Price is required", { status: 422 });
    if (!categoryId) return new NextResponse("CategoryId is required", { status: 422 });
    if (!sizeId) return new NextResponse("SizeId is required", { status: 422 });
    if (!images?.length) return new NextResponse("Images are required", { status: 422 });
    if (!colorId) return new NextResponse("ColorId is required", { status: 422 });
    if (!params.productId) return new NextResponse("productId is required", { status: 422 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: params.storeId, userId } });
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    await prismadb.product.update({
      where: { id: params.productId },
      data: { ...body, images: { deleteMany: {} } },
    });

    const product = await prismadb.product.update({
      where: { id: params.productId },
      data: { images: { createMany: { data: images.map((url) => url) } } },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_ID_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!params.storeId) return new NextResponse("Store id is required!", { status: 422 });
    if (!params.productId) return new NextResponse("Product id is required!", { status: 422 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: params.storeId, userId } });
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const product = await prismadb.product.deleteMany({ where: { id: params.productId } });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
