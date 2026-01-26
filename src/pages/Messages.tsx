import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatWindow } from '@/components/ChatWindow';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MessageSquare, 
  Search, 
  Plus,
  ArrowLeft 
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { conversations, loading, totalUnread } = useMessages();
  
  const [selectedConversation, setSelectedConversation] = useState<{
    partnerId: string;
    partnerName: string;
    partnerAvatar?: string | null;
    tradeProposalId?: string;
  } | null>(() => {
    // Check URL params for initial conversation
    const userId = searchParams.get('user');
    const userName = searchParams.get('name');
    if (userId && userName) {
      return {
        partnerId: userId,
        partnerName: userName,
        partnerAvatar: null,
      };
    }
    return null;
  });
  
  const [searchQuery, setSearchQuery] = useState('');

  const formatLastMessageTime = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    }
    if (isYesterday(date)) {
      return 'Ayer';
    }
    return format(date, 'd MMM', { locale: es });
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const name = conv.other_user?.full_name || conv.other_user?.username || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSelectConversation = (conv: typeof conversations[0]) => {
    setSelectedConversation({
      partnerId: conv.other_user?.id || '',
      partnerName: conv.other_user?.full_name || conv.other_user?.username || 'Usuario',
      partnerAvatar: conv.other_user?.avatar_url,
      tradeProposalId: conv.trade_proposal_id || undefined,
    });
  };

  const handleBack = () => {
    setSelectedConversation(null);
    // Clear URL params
    navigate('/messages', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16 flex">
        <div className="container-alamexa flex-1 flex">
          <div className="flex w-full h-[calc(100vh-4rem)] border-x border-border/30">
            {/* Conversations List */}
            <div
              className={cn(
                "w-full md:w-80 lg:w-96 border-r border-border/30 flex flex-col",
                selectedConversation ? "hidden md:flex" : "flex"
              )}
            >
              {/* Header */}
              <div className="p-4 border-b border-border/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-foreground">Mensajes</h1>
                    {totalUnread > 0 && (
                      <Badge variant="default" className="rounded-full">
                        {totalUnread}
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar conversaciones..."
                    className="pl-10 bg-muted/50"
                  />
                </div>
              </div>

              {/* Conversations */}
              <ScrollArea className="flex-1">
                {loading ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {searchQuery ? 'Sin resultados' : 'Sin mensajes'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery
                        ? 'Prueba con otra búsqueda'
                        : 'Inicia una conversación desde el marketplace o tus propuestas de trueque'}
                    </p>
                    <Button variant="outline" className="mt-4" asChild>
                      <Link to="/marketplace">Explorar Marketplace</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-border/30">
                    {filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv)}
                        className={cn(
                          "w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left",
                          selectedConversation?.partnerId === conv.other_user?.id && "bg-muted/50"
                        )}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={conv.other_user?.avatar_url || undefined} />
                            <AvatarFallback className="bg-accent text-accent-foreground">
                              {conv.other_user?.full_name?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          {/* Online indicator */}
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-foreground truncate">
                              {conv.other_user?.full_name || conv.other_user?.username || 'Usuario'}
                            </span>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {formatLastMessageTime(conv.last_message_at)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-0.5">
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.trade_proposal_id ? '📦 Trueque en progreso' : 'Conversación activa'}
                            </p>
                            {conv.unread_count && conv.unread_count > 0 ? (
                              <Badge variant="default" className="rounded-full h-5 min-w-5 flex items-center justify-center">
                                {conv.unread_count}
                              </Badge>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Chat Window */}
            <div
              className={cn(
                "flex-1 flex flex-col",
                selectedConversation ? "flex" : "hidden md:flex"
              )}
            >
              {selectedConversation ? (
                <ChatWindow
                  partnerId={selectedConversation.partnerId}
                  partnerName={selectedConversation.partnerName}
                  partnerAvatar={selectedConversation.partnerAvatar}
                  tradeProposalId={selectedConversation.tradeProposalId}
                  onBack={handleBack}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
                    <MessageSquare className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Mensajes ALAMEXA
                  </h2>
                  <p className="text-muted-foreground max-w-md">
                    Coordina tus trueques, negocia precios y conecta con otros usuarios de forma segura.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
