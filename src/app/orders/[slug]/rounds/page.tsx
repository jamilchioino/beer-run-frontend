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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Beer } from "@/schema/beer";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

type Loaded = {
  state: "loaded";
  data: {
    beers: Beer[];
  };
};

type Putting = {
  state: "putting";
  data: {
    beers: Beer[];
  };
};

type Loading = {
  state: "loading";
};

type State = Loading | Loaded | Putting;

const itemSchema = z.object({
  beer_id: z.string().min(1),
  quantity: z.coerce
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .int()
    .positive(),
  discount_flat: z.coerce
    .number({
      invalid_type_error: "Discount flat be a number",
    })
    .nonnegative(),
  discount_rate: z.coerce
    .number({
      invalid_type_error: "Discount rate must be a number",
    })
    .min(0)
    .max(1),
});

const formSchema = z.object({
  items: z.array(itemSchema),
});

export default function Rounds() {
  const [state, setData] = useState<State>({ state: "loading" });
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [
        {
          beer_id: "",
          discount_flat: 0,
          discount_rate: 0,
          quantity: 1,
        },
      ],
    },
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_URL}/stock`)
      .then((res) => res.json())
      .then((data) => {
        const result = data as { beers: Beer[] };
        setData({ state: "loaded", data: { beers: result.beers } });
      });
  }, []);

  const onAppend = () => {
    append({
      beer_id: "",
      discount_flat: 0,
      discount_rate: 0,
      quantity: 0,
    });
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (state.state !== "loaded") {
      return;
    }
    setData({ state: "putting", data: state.data });
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/orders/${slug}/rounds`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(values),
      },
    );

    if (response.status !== 200) {
      const data = await response.json();

      toast({
        title: "Oh no!",
        description: data.detail,
        variant: "destructive",
      });

      setData({ state: "loaded", data: state.data });
      return;
    }

    // Simulate lag
    setTimeout(() => {
      setData({ state: "loading" });
      toast({
        title: "Added Round to Order",
      });
      router.push(`/orders/${slug}`);
    }, 1000);
  };

  return (
    <div className="m-4 flex flex-col">
      {(state?.state === "loaded" || state?.state === "putting") && (
        <Card>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardHeader>
              <CardTitle>Rounds for order: {slug}</CardTitle>
              <CardDescription>Adding new round</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Form {...form}>
                {fields.map((field, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="align-baseline">Item</CardTitle>
                        <Button
                          disabled={
                            state.state !== "loaded" ||
                            form.getValues().items.length <= 1
                          }
                          variant="destructive"
                          onClick={() => remove(index)}
                        >
                          X
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.beer_id`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a beer"></SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {state.data.beers.map((beer, index) => (
                                  <SelectItem key={index} value={beer.id}>
                                    {beer.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <FormDescription>Name of the beer</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input placeholder="0" {...field} />
                            </FormControl>
                            <FormDescription>Quantity of Beer</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.discount_flat`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Flat</FormLabel>
                            <FormControl>
                              <Input placeholder="0" {...field} />
                            </FormControl>
                            <FormDescription>Quantity of beer</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.discount_rate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Rate</FormLabel>
                            <FormControl>
                              <Input placeholder="0" {...field} />
                            </FormControl>
                            <FormDescription>
                              Discount rate in percent (%)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Form>
              <Button
                type="button"
                onClick={() => onAppend()}
                variant={"outline"}
              >
                Add new
              </Button>
            </CardContent>
            {form.getValues().items.length > 0 && (
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={state.state !== "loaded"}
                >
                  <Plus /> Save
                </Button>
              </CardFooter>
            )}
          </form>
        </Card>
      )}
    </div>
  );
}
