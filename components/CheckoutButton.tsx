"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CheckoutButtonProps {
  courseId: string;
  price: number;
}

export function CheckoutButton({ courseId, price }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.init_point) {
        // Redirect the user to Mercado Pago checkout
        window.location.href = data.init_point;
      } else {
        throw new Error("Invalid response from checkout API");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Something went wrong during checkout.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout} 
      disabled={isLoading}
      className="w-full sm:w-auto"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </>
      ) : (
        `Comprar por R$ ${price.toFixed(2)}`
      )}
    </Button>
  );
}
