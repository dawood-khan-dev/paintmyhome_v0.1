"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/design-system/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/design-system/components/ui/form";
import { Input } from "@repo/design-system/components/ui/input";
import type { Dictionary } from "@repo/internationalization";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { submitQuote } from "@/app/[locale]/actions/submit-quote";

interface QuoteModalProps {
  children: React.ReactNode;
  dictionary: Dictionary;
}

const quoteFormSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  phone: z.string().trim().min(1, "Required"),
  city: z.string().trim().min(1, "Required"),
  company: z.string().max(0).optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export const QuoteModal = ({ dictionary, children }: QuoteModalProps) => {
  const [open, setOpen] = useState(false);
  const copy = dictionary.web.header.getQuoteModal;

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      city: "",
      company: "",
    },
  });

  const onSubmit = async (values: QuoteFormValues) => {
    if (values.company) {
      return;
    }

    const { error } = await submitQuote(values.name, values.phone, values.city);

    if (error) {
      toast.error(copy.error);
      return;
    }

    toast.success(copy.success);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{copy.name}</FormLabel>
                  <FormControl>
                    <Input placeholder={copy.namePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{copy.phone}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={copy.phonePlaceholder}
                      type="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{copy.city}</FormLabel>
                  <FormControl>
                    <Input placeholder={copy.cityPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <input
                  {...field}
                  aria-hidden="true"
                  className="hidden"
                  tabIndex={-1}
                />
              )}
            />
            <Button
              className="w-full"
              disabled={form.formState.isSubmitting}
              type="submit"
            >
              {copy.cta}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
