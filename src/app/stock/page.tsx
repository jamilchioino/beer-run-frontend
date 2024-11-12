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
import { truncate } from "@/lib/utils";
import { Stock } from "@/schema/stock";
import Link from "next/link";

export default async function Orders({}) {
  const response = await fetch(process.env.URL + "/stock");
  const stock = (await response.json()) as Stock;

  return (
    <div className="m-4 flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <h1>Stock</h1>
        <Link href={"/stock/new"} legacyBehavior={true}>
          <Button>+ New beer</Button>
        </Link>
      </div>
      <div>
        <Table>
          <TableCaption>Stock</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead className="text-right">Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock Left</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stock.beers.map((beer, i) => (
              <Link key={i} href={`stock/${beer.id}`} legacyBehavior={true}>
                <TableRow>
                  <TableCell className="font-mediumtext-ellipsis">
                    {truncate(beer.id, 9)}
                  </TableCell>
                  <TableCell className="truncate-ellipsis text-right font-medium">
                    {beer.name}
                  </TableCell>
                  <TableCell className="truncate-ellipsis text-right font-medium">
                    ${beer.price}
                  </TableCell>
                  <TableCell className="truncate-ellipsis text-right font-medium">
                    {beer.quantity}
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
