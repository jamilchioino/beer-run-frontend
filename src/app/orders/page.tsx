import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/schema/order";
import { format } from "date-fns";
import { Check, RectangleEllipsis } from "lucide-react";
import Link from "next/link";

export default async function Orders({}) {
  const response = await fetch(process.env.URL + "/orders/");
  const { orders } = (await response.json()) as { orders: Order[] };

  return (
    <div className="flex flex-col m-4">
      <div>
        <h1>Orders</h1>
      </div>
      <div>
        <Table>
          <TableCaption>All Orders</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">ID</TableHead>
              <TableHead className="text-right">Created</TableHead>
              <TableHead className="text-right">Paid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, i) => (
              <Link key={i} href={`orders/${order.id}`} legacyBehavior={true}>
                <TableRow key={i}>
                  <TableCell className="font-medium truncate-ellipsis">
                    {order.id}
                  </TableCell>
                  <TableCell className="font-medium text-right">
                    {format(new Date(order.created), "h:mm a")}
                  </TableCell>
                  <TableCell className="font-medium text-right">
                    <div className="flex justify-end">
                      {order.paid ? <Check /> : <RectangleEllipsis />}
                    </div>
                  </TableCell>
                </TableRow>
              </Link>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
