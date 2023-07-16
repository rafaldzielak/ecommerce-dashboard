import React, { FC } from "react";
import { ProductClient } from "./components/ProductClient";
import prismadb from "@/lib/prismadb";
import { ProductColumn } from "./components/columns";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";

interface ProductsPageProps {
  params: { storeId: string };
}

const ProductsPage: FC<ProductsPageProps> = async ({ params }) => {
  const products = await prismadb.product.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
    include: { category: true, size: true, color: true },
  });

  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: formatter.format(product.price.toNumber()),
    category: product.category.name,
    size: product.size.name,
    color: product.color.value,
    createdAt: format(product.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
