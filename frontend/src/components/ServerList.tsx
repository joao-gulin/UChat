// src/components/ServerList.tsx
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { ServerIcon, ServerIconSkeleton } from "./ServerIcon";
import { CreateServerForm } from "./CreateServerForm";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useServers } from "../hooks/use-server";

export const ServerList = ({
  onSelectServer,
}: {
  onSelectServer: (id: string) => void;
}) => {
  const { data: servers, isLoading } = useServers();

  return (
    <div className="p-2 space-y-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <CreateServerForm />
        </DialogContent>
      </Dialog>

      {isLoading
        ? Array(3)
            .fill(0)
            .map((_, i) => <ServerIconSkeleton key={i} />)
        : servers?.map((server) => (
            <ServerIcon
              key={server.id}
              server={server}
              onClick={() => onSelectServer(server.id)}
              isActive={false}
            />
          ))}
    </div>
  );
};
