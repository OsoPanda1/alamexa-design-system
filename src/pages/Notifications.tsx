import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Bell, Check, Trash2, RefreshCw, Settings } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const notificationIcons: Record<string, string> = {
  trade_proposal: "🔄",
  trade_accepted: "✅",
  trade_rejected: "❌",
  trade_completed: "🎉",
  new_message: "💬",
  security_alert: "🔒",
  system: "📢",
};

export default function Notifications() {
  const {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch,
  } = useNotifications({ limit: 100 });

  const getNotificationLink = (notification: any): string | null => {
    if (notification.action_url) return notification.action_url;
    switch (notification.reference_type) {
      case "trade_proposal":
        return "/trades";
      case "message":
        return "/messages";
      default:
        return null;
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <>
      <Helmet>
        <title>Notificaciones | ALAMEXA</title>
        <meta name="description" content="Gestiona tus notificaciones de ALAMEXA" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-20">
        <div className="container-alamexa py-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Notificaciones
                </h1>
                <p className="text-muted-foreground">
                  {unreadCount > 0
                    ? `Tienes ${unreadCount} ${unreadCount === 1 ? "notificación" : "notificaciones"} sin leer`
                    : "Estás al día con tus notificaciones"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Actualizar
                </Button>
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    className="gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Marcar todas como leídas
                  </Button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-card/50">
                <TabsTrigger value="all" className="gap-2">
                  Todas
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    {notifications.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="unread" className="gap-2">
                  Sin leer
                  {unreadCount > 0 && (
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="read">Leídas</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <NotificationList
                  notifications={notifications}
                  loading={loading}
                  markAsRead={markAsRead}
                  deleteNotification={deleteNotification}
                  getNotificationLink={getNotificationLink}
                />
              </TabsContent>

              <TabsContent value="unread">
                <NotificationList
                  notifications={unreadNotifications}
                  loading={loading}
                  markAsRead={markAsRead}
                  deleteNotification={deleteNotification}
                  getNotificationLink={getNotificationLink}
                />
              </TabsContent>

              <TabsContent value="read">
                <NotificationList
                  notifications={readNotifications}
                  loading={loading}
                  markAsRead={markAsRead}
                  deleteNotification={deleteNotification}
                  getNotificationLink={getNotificationLink}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function NotificationList({
  notifications,
  loading,
  markAsRead,
  deleteNotification,
  getNotificationLink,
}: {
  notifications: any[];
  loading: boolean;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  getNotificationLink: (n: any) => string | null;
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="border-border/30">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <Bell className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No hay notificaciones
        </h3>
        <p className="text-muted-foreground">
          Cuando recibas notificaciones, aparecerán aquí
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification, index) => {
        const link = getNotificationLink(notification);
        const icon = notification.icon || notificationIcons[notification.type] || "📢";

        const content = (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={cn(
                "border-border/30 hover:border-accent/30 transition-all group cursor-pointer",
                !notification.read && "bg-accent/5 border-accent/20"
              )}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0",
                      notification.read ? "bg-muted/50" : "bg-accent/10"
                    )}
                  >
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={cn(
                          "font-medium line-clamp-1",
                          notification.read
                            ? "text-muted-foreground"
                            : "text-foreground"
                        )}
                      >
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-1 shrink-0">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-2">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2" />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

        return link ? (
          <Link
            key={notification.id}
            to={link}
            onClick={() => {
              if (!notification.read) markAsRead(notification.id);
            }}
          >
            {content}
          </Link>
        ) : (
          <div
            key={notification.id}
            onClick={() => {
              if (!notification.read) markAsRead(notification.id);
            }}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
