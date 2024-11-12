import { Button } from "@/components/ui/button";
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
import { Check, LucidePlus, RectangleEllipsis } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function Orders({}) {
  const response = await fetch(process.env.URL + "/orders/");
  const { orders } = (await response.json()) as { orders: Order[] };

  const createOrder = async () => {
    "use server"
    await fetch(`${process.env.NEXT_PUBLIC_URL}/orders/`, {method: "POST"})
    revalidatePath("/orders")
  }

  return (
    <div className="flex flex-col m-4">
      <div className="flex justify-between">
        <h1>Orders</h1>
        <form action={createOrder}>
        <Button>
          <LucidePlus/>
          New Order
        </Button>
        </form>
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
