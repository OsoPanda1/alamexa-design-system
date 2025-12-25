import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  saved_for_later: boolean;
  product?: {
    id: string;
    title: string;
    price: number;
    original_price: number | null;
    images: string[];
    category: string;
    seller_id: string;
  };
}

interface CartContextType {
  items: CartItem[];
  savedItems: CartItem[];
  loading: boolean;
  itemCount: number;
  total: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  saveForLater: (productId: string) => Promise<void>;
  moveToCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCart = async () => {
    if (!user) {
      setItems([]);
      setSavedItems([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        product_id,
        quantity,
        saved_for_later,
        products:product_id (
          id,
          title,
          price,
          original_price,
          images,
          category,
          seller_id
        )
      `)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching cart:", error);
    } else if (data) {
      const cartData = data.map((item: any) => ({
        ...item,
        product: item.products,
      }));
      setItems(cartData.filter((i: CartItem) => !i.saved_for_later));
      setSavedItems(cartData.filter((i: CartItem) => i.saved_for_later));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar al carrito",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("cart_items").upsert(
      {
        user_id: user.id,
        product_id: productId,
        quantity,
        saved_for_later: false,
      },
      { onConflict: "user_id,product_id" }
    );

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar al carrito",
        variant: "destructive",
      });
    } else {
      await fetchCart();
      toast({
        title: "Agregado al carrito",
        description: "El producto se agregó exitosamente",
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (!error) {
      await fetchCart();
      toast({
        title: "Eliminado",
        description: "Producto eliminado del carrito",
      });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user || quantity < 1) return;

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (!error) {
      await fetchCart();
    }
  };

  const saveForLater = async (productId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("cart_items")
      .update({ saved_for_later: true })
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (!error) {
      await fetchCart();
      toast({
        title: "Guardado",
        description: "Producto guardado para después",
      });
    }
  };

  const moveToCart = async (productId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("cart_items")
      .update({ saved_for_later: false })
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (!error) {
      await fetchCart();
      toast({
        title: "Movido al carrito",
        description: "Producto movido al carrito",
      });
    }
  };

  const clearCart = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("saved_for_later", false);

    if (!error) {
      await fetchCart();
      toast({
        title: "Carrito vaciado",
        description: "Se eliminaron todos los productos",
      });
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        savedItems,
        loading,
        itemCount,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        saveForLater,
        moveToCart,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
