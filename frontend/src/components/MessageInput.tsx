import { useRef, useState, useEffect } from "react";
import { useSocket } from "../context/socket-context";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormControl, FormField } from "./ui/form";
import { useMessages } from "../hooks/use-messages";

interface MessageFormData {
  content: string;
}

export const MessageInput = ({ channelId }: { channelId: string }) => {
  const { socket } = useSocket();
  const { sendMessage } = useMessages(channelId);
  const form = useForm<MessageFormData>({ defaultValues: { content: "" } });
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (socket && channelId) {
      socket.emit("joinChannel", channelId);
    }
  }, [socket, channelId]);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket?.emit("typing", { channelId, userId: socket.id, username: "User" });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket?.emit("stopTyping", { channelId, userId: socket.id });
    }, 1000);
  };

  const onSubmit = (data: MessageFormData) => {
    if (!data.content.trim() || !socket?.id) return;

    sendMessage({
      channelId,
      content: data.content.trim(),
      userId: socket.id,
    });

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 p-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormControl>
              <Input
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  handleTyping();
                }}
                placeholder="Type a message..."
                className="flex-1"
              />
            </FormControl>
          )}
        />
        <Button type="submit">Send</Button>
      </form>
    </Form>
  );
};
