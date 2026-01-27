import { useState } from "react";
import { Bell, Check, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const notificationIcons: Record<string, string> = {
  trade_proposal: "🔄",
  trade_accepted: "✅",
  trade_rejected: "❌",
  trade_completed: "🎉",
  new_message: "💬",
  security_alert: "🔒",
  system: "📢",
};

const notificationColors: Record<string, string> = {
  trade_proposal: "bg-accent/10 border-accent/30",
  trade_accepted: "bg-flag-green/10 border-flag-green/30",
  trade_rejected: "bg-cherry/10 border-cherry/30",
  trade_completed: "bg-amber-500/10 border-amber-500/30",
  new_message: "bg-blue-500/10 border-blue-500/30",
  security_alert: "bg-cherry/10 border-cherry/30",
  system: "bg-muted border-border/30",
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications({ limit: 20 });

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-cherry text-[10px] font-bold"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h3 className="font-semibold text-foreground">Notificaciones</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <Check className="w-3 h-3 mr-1" />
              Marcar leídas
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Cargando...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No tienes notificaciones</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {notifications.map((notification) => {
                const link = getNotificationLink(notification);
                const icon =
                  notification.icon ||
                  notificationIcons[notification.type] ||
                  "📢";
                const colorClass =
                  notificationColors[notification.type] || "bg-muted";

                const content = (
                  <div
                    className={cn(
                      "p-4 transition-colors hover:bg-muted/50 cursor-pointer relative group",
                      !notification.read && "bg-accent/5"
                    )}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id);
                      }
                      if (link) setOpen(false);
                    }}
                  >
                    <div className="flex gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 border",
                          colorClass
                        )}
                      >
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm font-medium line-clamp-1",
                            notification.read
                              ? "text-muted-foreground"
                              : "text-foreground"
                          )}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          {formatDistanceToNow(
                            new Date(notification.created_at),
                            {
                              addSuffix: true,
                              locale: es,
                            }
                          )}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2" />
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                );

                return link ? (
                  <Link key={notification.id} to={link}>
                    {content}
                  </Link>
                ) : (
                  <div key={notification.id}>{content}</div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="p-2 border-t border-border/50">
          <Link to="/notifications" onClick={() => setOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full text-xs">
              Ver todas las notificaciones
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
