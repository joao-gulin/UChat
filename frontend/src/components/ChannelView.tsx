import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

export const ChannelView = ({ serverId }: { serverId: string }) => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  return (
    <div className="flex flex-1">
      <div className="w-72 bg-background border-r">
        <div className="p-4 pb-2">
          <CreateChannelForm serverId={serverId} />
        </div>
        <Separator />
        <ScrollArea className="h-full">
          <ChannelList
            serverId={serverId}
            onSelectChannel={setSelectedChannel}
          />
        </ScrollArea>
      </div>
    </div>
  );
};
