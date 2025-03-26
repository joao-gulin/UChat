import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../context/socket-context";

export interface Message {
  id: string;
  content: string;
  userId: string;
  channelId: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
  };
}

export const useMessages = (channelId: string) => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", channelId],
    queryFn: async () => {
      const response = await fetch(`/api/messages?channelId=${channelId}`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      return response.json();
    },
    enabled: !!channelId,
    refetchOnWindowFocus: false,
    staleTime: Infinity, // Only rely on socket updates, not refetches
  });

  const sendMessage = useMutation({
    mutationFn: async (message: Omit<Message, "id" | "createdAt">) => {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: (newMessage) => {
      // Don't emit the message via socket as the server will do that
      // Don't update the cache - wait for the socket message event
    },
  });

  return {
    messages,
    isLoading,
    sendMessage: sendMessage.mutate,
  };
};
