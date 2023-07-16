"use client";

import { DataTable } from "@/components/ui/DataTable";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { FC } from "react";
import { OrderColumn, columns } from "./columns";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading title={`Orders (${data.length})`} description='Manage orders for your store' />
      <Separator />
      <DataTable columns={columns} data={data} searchKey='products' />
    </>
  );
};
