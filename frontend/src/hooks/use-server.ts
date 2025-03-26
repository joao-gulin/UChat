import { api } from "../api/axios";
import { useQuery } from "@tanstack/react-query";

export interface Server {
  id: string;
  name: string;
  channels: any[];
}

export const useServers = () => {
  return useQuery({
    queryKey: ["servers"],
    queryFn: async () => {
      const response = await api.get<Server[]>("/servers");
      return response.data;
    },
  });
};
