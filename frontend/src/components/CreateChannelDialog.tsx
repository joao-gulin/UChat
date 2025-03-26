// src/components/CreateChannelDialog.tsx
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { api } from "../api/axios";
import { toast } from "sonner";
import { XCircle } from "lucide-react";

export const CreateChannelDialog = ({ serverId }: { serverId: string }) => {
  const queryClient = useQueryClient();
  const form = useForm({ defaultValues: { name: "" } });

  const createChannel = async (name: string) => {
    try {
      await api.post("/channels", {
        name,
        serverId,
      });
      toast({
        title: "Channel created",
        description: `${name} has been created.`,
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to create channel",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mb-4">
          Create Channel
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Channel</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => createChannel(values.name))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter channel name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Create Channel
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
