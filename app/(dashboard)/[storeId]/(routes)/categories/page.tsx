import React, { FC } from "react";
import { CategoryClient } from "./components/CategoryClient";
import prismadb from "@/lib/prismadb";
import { CategoryColumn } from "./components/columns";
import { format } from "date-fns";

interface CategoriesPageProps {
  params: { storeId: string };
}

const CategoriesPage: FC<CategoriesPageProps> = async ({ params }) => {
  const categories = await prismadb.category.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
    include: { billboard: true },
  });

  const formattedCategories: CategoryColumn[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
