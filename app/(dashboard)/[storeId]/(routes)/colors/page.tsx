import React, { FC } from "react";
import { ColorClient } from "./components/ColorClient";
import prismadb from "@/lib/prismadb";
import { ColorColumn } from "./components/columns";
import { format } from "date-fns";

interface ColorsPageProps {
  params: { storeId: string };
}

const ColorsPage: FC<ColorsPageProps> = async ({ params }) => {
  const colors = await prismadb.color.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  });

  const formattedColors: ColorColumn[] = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
