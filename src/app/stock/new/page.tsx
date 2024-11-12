"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Beer } from "@/schema/beer";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Loaded = {
  state: "loaded";
};

type Putting = {
  state: "putting";
  data: {
    stock: Omit<Beer, "id">;
  };
};
type State = Loaded | Putting;

const stockSchema = z.object({
  name: z.string().min(1),
  price: z.coerce
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive(),
  quantity: z.coerce
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .int()
    .nonnegative(),
});

export default function Rounds() {
  const [state, setData] = useState<State>({ state: "loaded" });
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof stockSchema>>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      name: "",
      price: 0,
      quantity: 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof stockSchema>) => {
    if (state.state !== "loaded") {
      return;
    }

    setData({ state: "putting", data: { stock: values } });
    await fetch(`${process.env.NEXT_PUBLIC_URL}/stock`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(values),
    });

    // Simulate lag
    setTimeout(() => {
      setData({ state: "loaded" });
      toast({
        title: "Added new Beer to Stock",
      });
      router.push(`/stock`);
    }, 1000);
  };

  return (
    <div className="m-4 flex flex-col">
      {(state?.state === "loaded" || state.state === "putting") && (
        <Card>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardHeader>
              <CardTitle>Adding new Stock</CardTitle>
              <CardDescription>New Beer</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Corona" {...field} />
                      </FormControl>
                      <FormDescription>Name of the beer</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="100" {...field} type="number" />
                      </FormControl>
                      <FormDescription>Unit price of beer</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input placeholder="2" {...field} type="number" />
                      </FormControl>
                      <FormDescription>Amount left in stock</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={state.state !== "loaded"}
              >
                <Plus /> Save
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}
