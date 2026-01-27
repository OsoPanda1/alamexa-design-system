import { Star, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewerName?: string;
  reviewerAvatar?: string;
  helpfulCount?: number;
  onHelpful?: () => void;
}

export function ReviewCard({
  rating,
  comment,
  createdAt,
  reviewerName = "Usuario",
  reviewerAvatar,
  helpfulCount = 0,
  onHelpful,
}: ReviewCardProps) {
  return (
    <Card className="border-border/30 bg-card/50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={reviewerAvatar} alt={reviewerName} />
            <AvatarFallback className="bg-muted text-muted-foreground">
              {reviewerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-medium text-foreground truncate">
                {reviewerName}
              </span>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatDistanceToNow(new Date(createdAt), {
                  addSuffix: true,
                  locale: es,
                })}
              </span>
            </div>

            {/* Rating stars */}
            <div className="flex items-center gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-4 h-4",
                    star <= rating
                      ? "fill-amber-500 text-amber-500"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>

            {comment && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {comment}
              </p>
            )}

            {onHelpful && (
              <div className="flex items-center gap-2 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onHelpful}
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  Útil ({helpfulCount})
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  size?: "sm" | "md" | "lg";
}

export function RatingSummary({
  averageRating,
  totalReviews,
  size = "md",
}: RatingSummaryProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const starSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSizes[size],
              star <= Math.round(averageRating)
                ? "fill-amber-500 text-amber-500"
                : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>
      <span className={cn("font-medium text-foreground", sizeClasses[size])}>
        {averageRating.toFixed(1)}
      </span>
      <span className={cn("text-muted-foreground", sizeClasses[size])}>
        ({totalReviews} {totalReviews === 1 ? "reseña" : "reseñas"})
      </span>
    </div>
  );
}
