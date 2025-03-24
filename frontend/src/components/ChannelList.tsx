// src/components/ChannelList.tsx
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useChannels } from "../hooks/use-channel";
import { Skeleton } from "./ui/skeleton";
import { useState } from "react";

export const ChannelList = ({
  serverId,
  onClose,
}: {
  serverId: string;
  onClose: () => void;
}) => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const { data: channels, isLoading } = useChannels(serverId);

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Channels</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Channel List */}
        <div className="w-64 border-r">
          <div className="p-2"></div>
          <ScrollArea className="h-full p-2">
            {isLoading ? (
              <div className="space-y-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full rounded" />
                  ))}
              </div>
            ) : (
              <div className="space-y-1">
                {channels?.map((channel) => (
                  <Button
                    key={channel.id}
                    variant={
                      selectedChannel === channel.id ? "secondary" : "ghost"
                    }
                    className="w-full justify-start"
                    onClick={() => setSelectedChannel(channel.id)}
                  >
                    # {channel.name}
                  </Button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Message List */}
      </div>
    </div>
  );
};
