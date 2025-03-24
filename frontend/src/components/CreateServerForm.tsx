// src/components/CreateServerForm.tsx
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../components/ui/form";
import { api } from "../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const CreateServerForm = () => {
  const form = useForm({ defaultValues: { name: "" } });
  const queryClient = useQueryClient();

  const { mutate: createServer } = useMutation({
    mutationFn: async (name: string) => {
      await api.post("/createServer", { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servers"] });
      form.reset();
    },
  });

  const onSubmit = (values: { name: string }) => {
    createServer(values.name);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
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
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
};
