import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { Billboard, Store } from "@prisma/client";
import { NextResponse } from "next/server";

interface Params {
  params: {
    storeId: string;
    billboardId: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    if (!params.billboardId) return new NextResponse("Billboard id is required!", { status: 422 });

    const billboard = await prismadb.billboard.findUnique({ where: { id: params.billboardId } });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_ID_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    const body: Billboard = await req.json();
    const { label, imageUrl } = body;
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!label) return new NextResponse("Label is required", { status: 422 });
    if (!imageUrl) return new NextResponse("Image URL is required", { status: 422 });
    if (!params.storeId) return new NextResponse("Store id is required!", { status: 422 });
    if (!params.billboardId) return new NextResponse("Billboard id is required!", { status: 422 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: params.storeId, userId } });
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });
    const billboard = await prismadb.billboard.updateMany({
      where: { id: params.billboardId },
      data: { label, imageUrl },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_ID_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!params.storeId) return new NextResponse("Store id is required!", { status: 422 });
    if (!params.billboardId) return new NextResponse("Billboard id is required!", { status: 422 });

    const storeByUserId = await prismadb.store.findFirst({ where: { id: params.storeId, userId } });
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const billboard = await prismadb.billboard.deleteMany({ where: { id: params.billboardId } });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
