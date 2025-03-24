import { useQuery } from "@tanstack/react-query";
import { Server } from "../api/types";
import { api } from "../api/axios";

export const useChannels = (serverId: string) => {
  return useQuery({
    queryKey: ["channels", serverId],
    queryFn: async () => {
      const response = await api.get<Server[]>("/channels", {
        params: { serverId },
      });
      return response.data;
    },
    enabled: !!serverId,
  });
};
