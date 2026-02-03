import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type ShippingCarrier = 'fedex' | 'dhl' | 'estafeta' | 'ups' | 'redpack' | 'pickup';
export type ShippingStatus = 'pending' | 'label_created' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned' | 'cancelled';

export interface ShippingOrder {
  id: string;
  trade_proposal_id: string | null;
  product_id: string | null;
  sender_id: string;
  receiver_id: string;
  carrier: ShippingCarrier;
  tracking_number: string | null;
  label_url: string | null;
  shipping_cost: number | null;
  estimated_delivery: string | null;
  actual_delivery: string | null;
  origin_address: Record<string, unknown> | null;
  destination_address: Record<string, unknown> | null;
  package_weight: number | null;
  package_dimensions: Record<string, unknown> | null;
  status: ShippingStatus;
  created_at: string;
  updated_at: string;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

const CARRIER_INFO: Record<ShippingCarrier, { name: string; logo: string; trackingUrl: string }> = {
  fedex: {
    name: 'FedEx',
    logo: '📦',
    trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr=',
  },
  dhl: {
    name: 'DHL',
    logo: '📬',
    trackingUrl: 'https://www.dhl.com/mx-es/home/rastreo.html?tracking-id=',
  },
  estafeta: {
    name: 'Estafeta',
    logo: '🚚',
    trackingUrl: 'https://rastreo3.estafeta.com/Rastreo/Consulta.aspx?guia=',
  },
  ups: {
    name: 'UPS',
    logo: '📮',
    trackingUrl: 'https://www.ups.com/track?tracknum=',
  },
  redpack: {
    name: 'Redpack',
    logo: '🏷️',
    trackingUrl: 'https://www.redpack.com.mx/rastreo/?guia=',
  },
  pickup: {
    name: 'Recoger en persona',
    logo: '🤝',
    trackingUrl: '',
  },
};

export function useShipping() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shipping_orders')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data || []) as ShippingOrder[]);
    } catch (error) {
      console.error('Error fetching shipping orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const createShippingOrder = async (data: {
    tradeProposalId?: string;
    productId?: string;
    receiverId: string;
    carrier: ShippingCarrier;
    originAddress: ShippingAddress;
    destinationAddress: ShippingAddress;
    packageWeight?: number;
    packageDimensions?: { length: number; width: number; height: number };
  }) => {
    if (!user) return null;

    try {
      const insertData = {
        trade_proposal_id: data.tradeProposalId || null,
        product_id: data.productId || null,
        sender_id: user.id,
        receiver_id: data.receiverId,
        carrier: data.carrier,
        origin_address: data.originAddress as unknown as Record<string, unknown>,
        destination_address: data.destinationAddress as unknown as Record<string, unknown>,
        package_weight: data.packageWeight || null,
        package_dimensions: data.packageDimensions as unknown as Record<string, unknown> || null,
        status: 'pending' as ShippingStatus,
      };
      
      const { data: order, error } = await supabase
        .from('shipping_orders')
        .insert(insertData as never)
        
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Orden de envío creada',
        description: `Envío con ${CARRIER_INFO[data.carrier].name} programado`,
      });

      await fetchOrders();
      return order as ShippingOrder;
    } catch (error) {
      console.error('Error creating shipping order:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear la orden de envío',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateTrackingNumber = async (orderId: string, trackingNumber: string, labelUrl?: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('shipping_orders')
        .update({
          tracking_number: trackingNumber,
          label_url: labelUrl || null,
          status: 'label_created',
        })
        .eq('id', orderId)
        .eq('sender_id', user.id);

      if (error) throw error;

      toast({
        title: 'Número de rastreo agregado',
        description: 'El comprador puede seguir el envío',
      });

      await fetchOrders();
      return true;
    } catch (error) {
      console.error('Error updating tracking:', error);
      return false;
    }
  };

  const updateShippingStatus = async (orderId: string, status: ShippingStatus) => {
    if (!user) return false;

    try {
      const updateData: Record<string, unknown> = { status };
      if (status === 'delivered') {
        updateData.actual_delivery = new Date().toISOString();
      }

      const { error } = await supabase
        .from('shipping_orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Estado actualizado',
        description: `El envío está ahora: ${status}`,
      });

      await fetchOrders();
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      return false;
    }
  };

  const getTrackingUrl = (carrier: ShippingCarrier, trackingNumber: string) => {
    const info = CARRIER_INFO[carrier];
    return info.trackingUrl ? `${info.trackingUrl}${trackingNumber}` : null;
  };

  const pending = orders.filter((o) => o.status === 'pending');
  const inTransit = orders.filter((o) => ['label_created', 'picked_up', 'in_transit', 'out_for_delivery'].includes(o.status));
  const delivered = orders.filter((o) => o.status === 'delivered');

  return {
    orders,
    loading,
    pending,
    inTransit,
    delivered,
    carriers: CARRIER_INFO,
    createShippingOrder,
    updateTrackingNumber,
    updateShippingStatus,
    getTrackingUrl,
    refetch: fetchOrders,
  };
}
