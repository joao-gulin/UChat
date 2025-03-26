import { useEffect, useState } from "react";
import { useSocket } from "../context/socket-context";
import { Avatar, AvatarFallback } from "./ui/avatar";

export const TypingIndicator = ({ channelId }: { channelId: string }) => {
  const { socket } = useSocket();
  const [typingUsers, setTypingUsers] = useState<
    { id: string; username: string }[]
  >([]);

  useEffect(() => {
    const handleTypingStart = (user: { id: string; username: string }) => {
      setTypingUsers((prev) => [...prev, user]);
    };

    const handleTypingStop = (userId: string) => {
      setTypingUsers((prev) => prev.filter((u) => u.id !== userId));
    };

    socket.on("userTypingStart", handleTypingStart);
    socket.on("userTypingStop", handleTypingStop);

    return () => {
      socket.off("userTypingStart", handleTypingStart);
      socket.off("userTypingStop", handleTypingStop);
    };
  }, [socket]);

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
      <div className="flex space-x-2">
        {typingUsers.slice(0, 3).map((user) => (
          <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
            <AvatarFallback className="text-xs">
              {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <span>
        {typingUsers.length > 1
          ? `${typingUsers.length} people are typing...`
          : `${typingUsers[0].username} is typing...`}
      </span>
    </div>
  );
};
