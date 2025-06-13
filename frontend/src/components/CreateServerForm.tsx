// src/components/CreateServerForm.tsx
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form";
import { api } from "../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const CreateServerForm = () => {
  const form = useForm({ defaultValues: { name: "" } });
  const queryClient = useQueryClient();

  const { mutate: createServer } = useMutation({
    mutationFn: async (name: string) => {
      await api.post("/servers", { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servers"] });
      form.reset();
      toast.success("Server created!");
    },
    onError: (error) => {
      toast.error("Failed to create server");
      console.error(error);
    },
  });

  const onSubmit = (values: { name: string }) => {
    createServer(values.name);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 mt-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="New server name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="cursor-pointer">
          Create
        </Button>
      </form>
    </Form>
  );
};
