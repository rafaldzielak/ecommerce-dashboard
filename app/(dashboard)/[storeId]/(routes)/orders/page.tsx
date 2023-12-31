import React, { FC } from "react";
import { OrderClient } from "./components/OrderClient";
import prismadb from "@/lib/prismadb";
import { OrderColumn } from "./components/columns";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";

interface OrdersPageProps {
  params: { storeId: string };
}

const OrdersPage: FC<OrdersPageProps> = async ({ params }) => {
  const orders = await prismadb.order.findMany({
    where: { storeId: params.storeId },
    include: { orderItems: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    products: order.orderItems.map((orderItem) => orderItem.product.name).join(", "),
    totalPrice: formatter.format(order.orderItems.reduce((total, item) => (total += Number(item.product.price)), 0)),
    isPaid: order.isPaid,
    createdAt: format(order.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
