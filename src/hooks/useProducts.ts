import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  seller_id: string;
  title: string;
  description: string | null;
  images: string[] | null;
  price: number | null;
  original_price: number | null;
  category: string;
  subcategory: string | null;
  condition: string | null;
  location: string | null;
  trade_type: string | null;
  trade_preferences: string | null;
  status: string | null;
  views: number | null;
  favorites_count: number | null;
}

export interface CreateProductData {
  title: string;
  description?: string;
  images?: string[];
  price?: number;
  original_price?: number;
  category: string;
  subcategory?: string;
  condition?: string;
  location?: string;
  trade_type?: string;
  trade_preferences?: string;
}

export function useProducts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (filters?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProducts = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyProducts(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching my products:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchMyProducts();
    }
  }, [user]);

  const createProduct = async (data: CreateProductData) => {
    if (!user) return null;

    try {
      const { data: product, error } = await supabase
        .from('products')
        .insert({
          seller_id: user.id,
          title: data.title,
          description: data.description || null,
          images: data.images || [],
          price: data.price || null,
          original_price: data.original_price || null,
          category: data.category,
          subcategory: data.subcategory || null,
          condition: data.condition || null,
          location: data.location || null,
          trade_type: data.trade_type || 'both',
          trade_preferences: data.trade_preferences || null,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: '¡Producto publicado!',
        description: 'Tu producto está listo para truequear.',
      });

      await fetchMyProducts();
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: 'No se pudo publicar el producto.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateProduct = async (productId: string, data: Partial<CreateProductData>) => {
    if (!user) return null;

    try {
      const { data: product, error } = await supabase
        .from('products')
        .update(data)
        .eq('id', productId)
        .eq('seller_id', user.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Producto actualizado',
        description: 'Los cambios han sido guardados.',
      });

      await fetchMyProducts();
      return product;
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el producto.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('seller_id', user.id);

      if (error) throw error;

      toast({
        title: 'Producto eliminado',
        description: 'El producto ha sido eliminado.',
      });

      await fetchMyProducts();
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el producto.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', productId)
        .eq('seller_id', user?.id);

      if (error) throw error;

      toast({
        title: newStatus === 'active' ? 'Producto activado' : 'Producto pausado',
        description: newStatus === 'active' 
          ? 'Tu producto está visible nuevamente.' 
          : 'Tu producto ha sido pausado.',
      });

      await fetchMyProducts();
      return true;
    } catch (error) {
      console.error('Error toggling product status:', error);
      return false;
    }
  };

  return {
    products,
    myProducts,
    loading,
    fetchProducts,
    fetchMyProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
  };
}

export const PRODUCT_CATEGORIES = [
  { value: 'electronica', label: 'Electrónica', icon: '📱' },
  { value: 'ropa', label: 'Ropa y Accesorios', icon: '👕' },
  { value: 'hogar', label: 'Hogar y Jardín', icon: '🏠' },
  { value: 'deportes', label: 'Deportes', icon: '⚽' },
  { value: 'vehiculos', label: 'Vehículos', icon: '🚗' },
  { value: 'libros', label: 'Libros y Media', icon: '📚' },
  { value: 'juguetes', label: 'Juguetes', icon: '🎮' },
  { value: 'arte', label: 'Arte y Colecciones', icon: '🎨' },
  { value: 'servicios', label: 'Servicios', icon: '🛠️' },
  { value: 'otros', label: 'Otros', icon: '📦' },
];

export const PRODUCT_CONDITIONS = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'como_nuevo', label: 'Como Nuevo' },
  { value: 'buen_estado', label: 'Buen Estado' },
  { value: 'usado', label: 'Usado' },
  { value: 'para_reparar', label: 'Para Reparar' },
];

export const TRADE_TYPES = [
  { value: 'trueque', label: 'Solo Trueque' },
  { value: 'venta', label: 'Solo Venta' },
  { value: 'both', label: 'Trueque o Venta' },
];
