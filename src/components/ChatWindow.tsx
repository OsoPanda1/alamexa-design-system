import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessages, type Message } from '@/hooks/useMessages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Send, 
  Image as ImageIcon, 
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Loader2
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string | null;
  tradeProposalId?: string;
  onBack?: () => void;
}

export function ChatWindow({
  partnerId,
  partnerName,
  partnerAvatar,
  tradeProposalId,
  onBack,
}: ChatWindowProps) {
  const { user } = useAuth();
  const { messages, loading, sending, sendMessage } = useMessages(partnerId);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    const content = newMessage;
    setNewMessage('');
    
    await sendMessage(partnerId, content, { tradeProposalId });
    
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    }
    if (isYesterday(date)) {
      return `Ayer ${format(date, 'HH:mm')}`;
    }
    return format(date, 'd MMM HH:mm', { locale: es });
  };

  const groupMessagesByDate = (msgs: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    
    msgs.forEach((msg) => {
      const date = new Date(msg.created_at);
      let dateLabel: string;
      
      if (isToday(date)) {
        dateLabel = 'Hoy';
      } else if (isYesterday(date)) {
        dateLabel = 'Ayer';
      } else {
        dateLabel = format(date, 'd MMMM yyyy', { locale: es });
      }
      
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.date === dateLabel) {
        lastGroup.messages.push(msg);
      } else {
        groups.push({ date: dateLabel, messages: [msg] });
      }
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/30 bg-card/50">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        <Avatar className="h-10 w-10">
          <AvatarImage src={partnerAvatar || undefined} />
          <AvatarFallback className="bg-accent text-accent-foreground">
            {partnerName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{partnerName}</h3>
          <p className="text-xs text-muted-foreground">En línea</p>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={cn("flex gap-2", i % 2 === 0 ? "justify-end" : "")}>
                {i % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                <Skeleton className="h-16 w-48 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <Avatar className="h-20 w-20 mb-4">
              <AvatarImage src={partnerAvatar || undefined} />
              <AvatarFallback className="bg-accent text-accent-foreground text-2xl">
                {partnerName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-foreground text-lg">{partnerName}</h3>
            <p className="text-muted-foreground mt-2">
              Inicia la conversación enviando un mensaje
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messageGroups.map((group) => (
              <div key={group.date}>
                {/* Date separator */}
                <div className="flex items-center justify-center mb-4">
                  <span className="px-3 py-1 text-xs text-muted-foreground bg-muted/50 rounded-full">
                    {group.date}
                  </span>
                </div>
                
                {/* Messages */}
                <div className="space-y-2">
                  {group.messages.map((message) => {
                    const isOwn = message.sender_id === user?.id;
                    
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-2",
                          isOwn ? "justify-end" : "justify-start"
                        )}
                      >
                        {!isOwn && (
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={partnerAvatar || undefined} />
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                              {partnerName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-2",
                            isOwn
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          <p
                            className={cn(
                              "text-[10px] mt-1",
                              isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}
                          >
                            {formatMessageDate(message.created_at)}
                            {isOwn && message.read_at && " ✓✓"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border/30 bg-card/50">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
            <ImageIcon className="h-5 w-5" />
          </Button>
          
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-muted/50 border-border/50"
            disabled={sending}
          />
          
          <Button
            variant="hero"
            size="icon"
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="shrink-0"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
