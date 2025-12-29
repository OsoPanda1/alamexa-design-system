import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CheckoutParams {
  userId: string;
  email: string;
  registrationId?: string;
}

export function useDevHubCheckout() {
  const [isLoading, setIsLoading] = useState(false);

  const initiateCheckout = async ({ userId, email, registrationId }: CheckoutParams) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("devhub-checkout", {
        body: { userId, email, registrationId },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Error al iniciar el pago. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return { initiateCheckout, isLoading };
}
