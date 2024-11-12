"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Pay() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_URL}/orders/${slug}/pay`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ order_id: slug }),
    })
      .then((res) => res.json())
      .then((data) => {
        router.push(`/orders/${slug}`);
      });
  }, []);

  return (
    <>
      <div>Hello</div>
    </>
  );
}
