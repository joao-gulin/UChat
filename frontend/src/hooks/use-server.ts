import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import { Server } from "../api/types";

export const useServers = () => {
  return useQuery({
    queryKey: ["servers"],
    queryFn: async () => {
      const response = await api.get<Server[]>("/servers");
      return response.data;
    },
  });
};
