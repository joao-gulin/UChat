// src/components/ServerSidebar.tsx
import { useState } from "react";
import { ServerIcon, ServerIconSkeleton } from "./ServerIcon";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { CreateServerForm } from "./CreateServerForm";
import { useServers } from "../hooks/use-server";
import { ChannelList } from "./ChannelList";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../lib/utils";

export const ServerSidebar = () => {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const { data: servers, isLoading } = useServers();

  return (
    <div className="flex h-full">
      {/* Server List */}
      <div className="flex flex-col items-center w-20 bg-background border-r gap-2 py-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full mb-4"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <CreateServerForm />
          </DialogContent>
        </Dialog>

        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, i) => <ServerIconSkeleton key={i} />)
        ) : (
          <ScrollArea className="flex-1">
            {servers?.map((server) => (
              <ServerIcon
                key={server.id}
                server={server}
                isActive={selectedServer === server.id}
                onClick={() =>
                  setSelectedServer((prev) =>
                    prev === server.id ? null : server.id,
                  )
                }
              />
            ))}
          </ScrollArea>
        )}
      </div>

      {/* Channels Panel */}
      <AnimatePresence>
        {selectedServer && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 240 }}
            exit={{ width: 0 }}
            className={cn(
              "border-r bg-background overflow-hidden",
              "flex flex-col justify-center",
            )}
          >
            <ChannelList
              serverId={selectedServer}
              onClose={() => setSelectedServer(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
