import prismadb from "@/lib/prismadb";
import React, { FC } from "react";
import { ColorForm } from "./components/ColorForm";

interface ColorPageProps {
  params: {
    colorId: string;
  };
}

const ColorPage: FC<ColorPageProps> = async ({ params }) => {
  const color = await prismadb.color.findUnique({ where: { id: params.colorId } });

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
