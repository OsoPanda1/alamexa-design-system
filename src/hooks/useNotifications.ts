import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type NotificationSeverity = "info" | "success" | "warning" | "error";
export type NotificationChannel = "system" | "trade" | "billing" | "security" | "community";

export type NotificationType =
  | "TRADE_PROPOSED"
  | "TRADE_ACCEPTED"
  | "TRADE_COMPLETED"
  | "TRADE_DISPUTED"
  | "NEW_MESSAGE"
  | "PLAN_UPGRADED"
  | "PAYMENT_FAILED"
  | "SECURITY_ALERT"
  | "SYSTEM";

export interface NotificationMetadata {
  severity?: NotificationSeverity;
  channel?: NotificationChannel;
  /**
   * Prioridad relativa para ordenamiento o badges en UI.
   * 1 = más alta, 5 = más baja.
   */
  priority?: 1 | 2 | 3 | 4 | 5;
  /**
   * Ruta sugerida para navegar cuando el usuario “abre” la notificación.
   */
  targetPath?: string;
  /**
   * Cualquier payload extra (ej. IDs adicionales, flags).
   */
  payload?: Record<string, unknown>;
}

export interface Notification {
  id: string;
  created_at: string;
  user_id: string;
  type: NotificationType | string;
  title: string;
  message: string;
  reference_id: string | null;
  reference_type: string | null;
  read: boolean;
  read_at: string | null;
  // JSONB en Postgres
  metadata: NotificationMetadata | null;
}

interface UseNotificationsOptions {
  limit?: number;
  /**
   * Si true, intenta re-suscribirse automaticamente al canal realtime.
   */
  autoResubscribe?: boolean;
  /**
   * Filtro inicial por tipo o canal.
   */
  channelFilter?: NotificationChannel | "all";
}

interface UseNotificationsResult {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  hasMore: boolean;
  isFetchingMore: boolean;

  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  fetchMore: () => Promise<void>;
  refetch: () => Promise<void>;

  // utilidades de filtrado en memoria
  getByChannel: (channel: NotificationChannel) => Notification[];
  getByType: (type: NotificationType) => Notification[];
}

export function useNotifications(
  options: UseNotificationsOptions = {},
): UseNotificationsResult {
  const { user } = useAuth();

  const {
    limit = 50,
    autoResubscribe = true,
    channelFilter = "all",
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Para evitar condiciones de carrera con múltiples llamadas
  const isInitialFetchDone = useRef(false);
  const realtimeChannel = useRef<ReturnType<typeof supabase.channel> | null>(
    null,
  );

  const baseQuery = useCallback(
    () =>
      supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user?.id ?? "")
        .order("created_at", { ascending: false }),
    [user?.id],
  );

  const fetchNotifications = useCallback(
    async (opts?: { reset?: boolean }) => {
      if (!user) return;

      const shouldReset = opts?.reset ?? false;

      if (shouldReset) {
        setLoading(true);
        setError(null);
      }

      try {
        const query = baseQuery().limit(limit);
        const { data, error } = await query;

        if (error) throw error;

        const list = (data ?? []) as Notification[];

        setNotifications(list);
        setHasMore(list.length === limit);
        isInitialFetchDone.current = true;
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("No se pudieron obtener las notificaciones.");
      } finally {
        setLoading(false);
      }
    },
    [user, baseQuery, limit],
  );

  const fetchMore = useCallback(async () => {
    if (!user || !hasMore || isFetchingMore || notifications.length === 0) {
      return;
    }

    setIsFetchingMore(true);
    setError(null);

    try {
      const last = notifications[notifications.length - 1];

      const query = baseQuery()
        .lt("created_at", last.created_at)
        .limit(limit);

      const { data, error } = await query;

      if (error) throw error;

      const more = (data ?? []) as Notification[];

      setNotifications((prev) => [...prev, ...more]);
      setHasMore(more.length === limit);
    } catch (err) {
      console.error("Error fetching more notifications:", err);
      setError("No se pudieron cargar más notificaciones.");
    } finally {
      setIsFetchingMore(false);
    }
  }, [user, hasMore, isFetchingMore, notifications, baseQuery, limit]);

  // Suscripción realtime
  const setupRealtime = useCallback(() => {
    if (!user) return;

    // Limpia canal previo si existe
    if (realtimeChannel.current) {
      supabase.removeChannel(realtimeChannel.current);
      realtimeChannel.current = null;
    }

    const channel = supabase
      .channel(`notifications:user:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;

          setNotifications((prev) => {
            // evita duplicados
            if (prev.some((n) => n.id === newNotification.id)) return prev;
            return [newNotification, ...prev];
          });
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          // opcional: log / métricas
        }
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("Supabase notifications channel issue:", status);
          if (autoResubscribe) {
            // simple backoff lineal
            setTimeout(setupRealtime, 2000);
          }
        }
      });

    realtimeChannel.current = channel;
  }, [user, autoResubscribe]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    fetchNotifications({ reset: true });
    setupRealtime();

    return () => {
      if (realtimeChannel.current) {
        supabase.removeChannel(realtimeChannel.current);
        realtimeChannel.current = null;
      }
    };
  }, [user, fetchNotifications, setupRealtime]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const read_at = new Date().toISOString();

      const { error } = await supabase
        .from("notifications")
        .update({ read: true, read_at })
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true, read_at } : n,
        ),
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
      setError("No se pudo marcar la notificación como leída.");
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      const read_at = new Date().toISOString();

      const { error } = await supabase
        .from("notifications")
        .update({ read: true, read_at })
        .eq("user_id", user.id)
        .eq("read", false);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) =>
          n.read ? n : { ...n, read: true, read_at },
        ),
      );
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      setError("No se pudieron marcar todas las notificaciones como leídas.");
    }
  }, [user]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (err) {
      console.error("Error deleting notification:", err);
      setError("No se pudo eliminar la notificación.");
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filtros en memoria
  const getByChannel = useCallback(
    (channel: NotificationChannel) =>
      notifications.filter((n) => n.metadata?.channel === channel),
    [notifications],
  );

  const getByType = useCallback(
    (type: NotificationType) => notifications.filter((n) => n.type === type),
    [notifications],
  );

  // Filtro global por canal (opción en options)
  const filteredNotifications =
    channelFilter === "all"
      ? notifications
      : notifications.filter(
          (n) => n.metadata?.channel === channelFilter,
        );

  return {
    notifications: filteredNotifications,
    loading,
    error,
    unreadCount,
    hasMore,
    isFetchingMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchMore,
    refetch: () => fetchNotifications({ reset: true }),
    getByChannel,
    getByType,
  };
}
