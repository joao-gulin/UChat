import { useEffect, useState, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { useSocket } from "../context/socket-context";
import { cn } from "../lib/utils";
import { useMessages, type Message } from "../hooks/use-messages";

interface TypingUser {
  userId: string;
  username: string;
}

export const MessageList = ({ channelId }: { channelId: string }) => {
  const { socket } = useSocket();
  const { messages: initialMessages, isLoading } = useMessages(channelId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const messagesRef = useRef(new Set<string>()); // Track message IDs to prevent duplicates
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Initialize messages from the query
  useEffect(() => {
    if (initialMessages?.length) {
      const newMessages: Message[] = [];
      
      initialMessages.forEach((msg: Message) => {
        if (!messagesRef.current.has(msg.id)) {
          messagesRef.current.add(msg.id);
          newMessages.push(msg);
        }
      });
      
      setMessages(prev => [...prev, ...newMessages]);
      
      // Scroll to bottom when initial messages load
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [initialMessages]);

  // Function to scroll to the bottom of messages
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (message: Message) => {
      // Only add the message if it belongs to this channel and isn't a duplicate
      if (message.channelId === channelId && !messagesRef.current.has(message.id)) {
        messagesRef.current.add(message.id);
        setMessages(prev => [...prev, message]);
        
        // Scroll to bottom when new message arrives
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    };

    // Listen for typing indicators
    const onTyping = ({ userId, username }: TypingUser) => {
      if (userId !== socket.id) {
        setTypingUsers(prev => {
          if (!prev.find(user => user.userId === userId)) {
            return [...prev, { userId, username }];
          }
          return prev;
        });
      }
    };

    const onStopTyping = ({ userId }: { userId: string }) => {
      setTypingUsers(prev => prev.filter(user => user.userId !== userId));
    };

    // Subscribe to events
    socket.on("message", onNewMessage);
    socket.on("typing", onTyping);
    socket.on("stopTyping", onStopTyping);

    // Clean up
    return () => {
      socket.off("message", onNewMessage);
      socket.off("typing", onTyping);
      socket.off("stopTyping", onStopTyping);
    };
  }, [socket, channelId]);

  // Reset messages and message tracking when channel changes
  useEffect(() => {
    messagesRef.current.clear();
    setMessages([]);
  }, [channelId]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4 pb-4">
          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.userId === socket?.id ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-lg px-4 py-2",
                  message.userId === socket?.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <div className="text-xs font-semibold mb-1">
                  {message.userId === socket?.id ? "You" : `User-${message.userId.substring(0, 6)}`}
                </div>
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-70">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          {typingUsers.length > 0 && (
            <div className="text-sm text-muted-foreground italic">
              {typingUsers.map((user) => user.username).join(", ")} typing...
            </div>
          )}
          <div ref={scrollRef} /> {/* Empty div for scrolling to bottom */}
        </div>
      </ScrollArea>
    </div>
  );
}; 