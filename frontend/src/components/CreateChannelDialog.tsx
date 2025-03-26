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

  const { mutate: createChannel } = useMutation({
    mutationFn: async (values: { name: string }) => {
      try {
        await api.post("/createChannel", {
          name: values.name,
          serverId,
        });
      } catch (error) {
        toast.error("Failed to create channel", {
          icon: <XCircle className="h-4 w-4" />,
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels", serverId] });
      form.reset();
      toast.success("Channel created successfully");
    },
  });

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
            onSubmit={form.handleSubmit((values) => createChannel(values))}
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
