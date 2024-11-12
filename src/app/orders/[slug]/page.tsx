import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/schema/order";
import { Plus } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import React from "react";

export default async function Orders({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const response = await fetch(process.env.URL + `/orders/${slug}`);
  const order = (await response.json()) as Order;

  const pay = async () => { 
    "use server"

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/orders/${slug}/pay`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ order_id: slug }),
    })

    revalidatePath(`/orders/${slug}`) 

  }

  return (
    <div className="flex flex-col m-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Order: {order.id}</CardTitle>
            {!order.paid && (
              <form action={pay}>
                <Button type="submit" variant="outline">Pay</Button>
              </form>
            )}
          </div>
          <CardDescription>
            {order.rounds.length} round(s) total
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {order.paid && (
            <>
              <h1>Summary</h1>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Subtotal</TableCell>
                    <TableCell className="text-right">
                      ${order.sub_total}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Discounts</TableCell>
                    <TableCell className="text-right">
                      ${order.discounts}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Taxes</TableCell>
                    <TableCell className="text-right">${order.taxes}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">${order.total}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Separator />
            </>
          )}
          <div>
            {order.rounds.map((round, index) => (
              <React.Fragment key={index}>
                <h1 className="mb-2">Round {index + 1}</h1>
                <Table className="mb-2">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Beer</TableHead>
                      <TableHead className="text-right">
                        Price per unit
                      </TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  {round.items.map((item, index) => (
                    <TableBody key={index}>
                      <TableRow>
                        <TableCell>{item.beer?.name}</TableCell>
                        <TableCell className="text-right">
                          ${item.price_per_unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ))}
                </Table>
              </React.Fragment>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          {!order.paid && (
            <Link href={`/orders/${slug}/rounds`} legacyBehavior={true}>
              <Button className="w-full">
                <Plus /> Add new round
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
