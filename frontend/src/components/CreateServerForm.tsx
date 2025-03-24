import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api/axios";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export const CreateServerForm = () => {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const { mutate: createServer } = useMutation({
    mutationFn: async () => {
      await api.post("/createServer", { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servers"] });
      setName("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) createServer();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New server name"
        className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <Button
        type="submit"
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        Create
      </Button>
    </form>
  );
};
