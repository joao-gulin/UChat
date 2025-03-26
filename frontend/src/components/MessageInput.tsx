import { useRef, useState } from "react";
import { useSocket } from "../context/socket-context";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormControl, FormField } from "./ui/form";

interface MessageFormData {
  content: string;
}

export const MessageInput = ({ channelId }: { channelId: string }) => {
  const { socket } = useSocket();
  const form = useForm<MessageFormData>({ defaultValues: { content: "" } });
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket?.emit("typing", { channelId });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket?.emit("stopTyping", { channelId });
    }, 1000);
  };

  const onSubmit = (data: MessageFormData) => {
    if (!data.content.trim()) return;

    socket?.emit("message", {
      channelId,
      content: data.content.trim(),
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
