import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import { Server } from "./use-server";

export interface Channel {
  id: string;
  name: string;
  serverId: string;
}

export const useChannels = (serverId: string) => {
  return useQuery({
    queryKey: ["channels", serverId],
    queryFn: async () => {
      const response = await api.get<Channel[]>("/channels", {
        params: { serverId },
      });
      return response.data;
    },
    enabled: !!serverId,
  });
};
