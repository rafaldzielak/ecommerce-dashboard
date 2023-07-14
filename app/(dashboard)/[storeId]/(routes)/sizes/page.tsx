import React, { FC } from "react";
import { SizeClient } from "./components/SizeClient";
import prismadb from "@/lib/prismadb";
import { SizeColumn } from "./components/columns";
import { format } from "date-fns";

interface SizesPageProps {
  params: { storeId: string };
}

const SizesPage: FC<SizesPageProps> = async ({ params }) => {
  const sizes = await prismadb.size.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  });

  const formattedSizes: SizeColumn[] = sizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
