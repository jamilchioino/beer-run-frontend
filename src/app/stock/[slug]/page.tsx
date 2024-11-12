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
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Beer } from "@/schema/beer";
import { useToast } from "@/hooks/use-toast";

type Loading = {
  state: "loading";
};

type Loaded = {
  state: "loaded";
  data: {
    beer: Beer;
  };
};

type Putting = {
  state: "putting";
  data: {
    beer: Beer;
  };
};

type State = Loading | Loaded | Putting;

const formSchema = z.object({
  id: z.string().readonly(),
  name: z.string().min(2).max(20),
  price: z.coerce
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .int()
    .positive(),
  quantity: z.coerce
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .int()
    .positive(),
});

export default function Orders() {
  const [state, setData] = useState<State>();
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_URL}/stock/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        const beer = data as Beer;
        setData({ state: "loaded", data: { beer } });
        form.reset(beer);
      });
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    ...(state?.state === "loaded" && { defaultValues: state.data.beer }),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setData({ state: "putting", data: { beer: values } });
    await fetch(`${process.env.NEXT_PUBLIC_URL}/stock/${slug}`, {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify(values),
    });
    // Simulate lag
    setTimeout(() => {
      setData({ state: "loaded", data: { beer: values } });
      toast({
        title: "Updated Beer",
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col m-4">
      {(state?.state === "loaded" || state?.state === "putting") && (
        <Card>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardHeader>
              <CardTitle>Beer: {state.data.beer.id}</CardTitle>
              <CardDescription>Editing</CardDescription>
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
                        <Input placeholder="corona" {...field} />
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
                        <Input placeholder="corona" {...field} type="number" />
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
                        <Input placeholder="corona" {...field} type="number" />
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
