import { useQuery } from "@tanstack/react-query";
import { Message } from "../api/types";
import { api } from "../api/axios";

export const useMessages = (channelId: string) => {
  return useQuery({
    queryKey: ["messages", channelId],
    queryFn: async () => {
      const response = await api.get<Message[]>("/messages", {
        params: { channelId },
      });
      return response.data;
    },
    enabled: !!channelId,
  });
};
