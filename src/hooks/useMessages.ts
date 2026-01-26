import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
  id: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  trade_proposal_id: string | null;
  content: string;
  message_type: string;
  read_at: string | null;
  metadata: unknown;
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  participant_1: string;
  participant_2: string;
  trade_proposal_id: string | null;
  last_message_id: string | null;
  last_message_at: string | null;
  // Joined data
  other_user?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    username: string | null;
  };
  last_message?: Message;
  unread_count?: number;
}

export function useMessages(conversationPartnerId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Fetch all conversations for current user
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) throw error;

      // Fetch profiles for other participants
      const conversationsWithProfiles = await Promise.all(
        (data || []).map(async (conv) => {
          const otherId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1;
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_id, full_name, avatar_url, username')
            .eq('user_id', otherId)
            .single();

          // Get unread count
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', user.id)
            .eq('sender_id', otherId)
            .is('read_at', null);

          return {
            ...conv,
            other_user: profile ? {
              id: profile.user_id,
              full_name: profile.full_name,
              avatar_url: profile.avatar_url,
              username: profile.username,
            } : undefined,
            unread_count: count || 0,
          };
        })
      );

      setConversations(conversationsWithProfiles);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }, [user]);

  // Fetch messages for a specific conversation partner
  const fetchMessages = useCallback(async (partnerId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as Message[]);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('sender_id', partnerId)
        .eq('receiver_id', user.id)
        .is('read_at', null);

    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Send a message
  const sendMessage = async (
    receiverId: string,
    content: string,
    options?: {
      tradeProposalId?: string;
      messageType?: 'text' | 'image' | 'offer' | 'system';
      metadata?: Record<string, unknown>;
    }
  ): Promise<Message | null> => {
    if (!user || !content.trim()) return null;

    setSending(true);
    try {
      // Ensure conversation exists
      await getOrCreateConversation(receiverId);

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content: content.trim(),
          message_type: options?.messageType || 'text',
          trade_proposal_id: options?.tradeProposalId || null,
          metadata: JSON.stringify(options?.metadata || {}),
        })
        .select()
        .single();

      if (error) throw error;

      // Create notification for receiver
      await supabase.from('notifications').insert([{
        user_id: receiverId,
        type: 'new_message',
        title: 'Nuevo mensaje',
        message: content.length > 50 ? content.substring(0, 50) + '...' : content,
        reference_id: data.id,
        reference_type: 'message',
      }]);

      return data as Message;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el mensaje.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setSending(false);
    }
  };

  // Get or create conversation
  const getOrCreateConversation = async (partnerId: string): Promise<Conversation | null> => {
    if (!user) return null;

    try {
      // Check if conversation exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(participant_1.eq.${user.id},participant_2.eq.${partnerId}),and(participant_1.eq.${partnerId},participant_2.eq.${user.id})`)
        .single();

      if (existing) return existing;

      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          participant_1: user.id,
          participant_2: partnerId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  };

  // Subscribe to real-time messages
  useEffect(() => {
    if (!user) return;

    let channel: RealtimeChannel;

    const setupRealtime = () => {
      channel = supabase
        .channel(`messages:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`,
          },
          (payload) => {
            const newMessage = payload.new as Message;
            
            // If we're viewing this conversation, add the message
            if (conversationPartnerId && newMessage.sender_id === conversationPartnerId) {
              setMessages((prev) => [...prev, newMessage]);
              
              // Mark as read immediately
              supabase
                .from('messages')
                .update({ read_at: new Date().toISOString() })
                .eq('id', newMessage.id);
            }

            // Refresh conversations list
            fetchConversations();
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `sender_id=eq.${user.id}`,
          },
          (payload) => {
            const newMessage = payload.new as Message;
            
            // Add our sent message if viewing that conversation
            if (conversationPartnerId && newMessage.receiver_id === conversationPartnerId) {
              setMessages((prev) => {
                // Avoid duplicates
                if (prev.some((m) => m.id === newMessage.id)) return prev;
                return [...prev, newMessage];
              });
            }
          }
        )
        .subscribe();
    };

    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user, conversationPartnerId, fetchConversations]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchConversations();
      if (conversationPartnerId) {
        fetchMessages(conversationPartnerId);
      } else {
        setLoading(false);
      }
    }
  }, [user, conversationPartnerId, fetchConversations, fetchMessages]);

  // Get total unread count
  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  return {
    messages,
    conversations,
    loading,
    sending,
    totalUnread,
    sendMessage,
    fetchMessages,
    fetchConversations,
    getOrCreateConversation,
  };
}
