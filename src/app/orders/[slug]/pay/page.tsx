"use client";

import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Pay() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_URL}/orders/${slug}/pay`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ order_id: slug }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast({
          title: "Order paid successfully",
        });
        router.push(`/orders/${slug}`);
      });
  }, []);

  return (
    <>
      <div>Hello</div>
    </>
  );
}
