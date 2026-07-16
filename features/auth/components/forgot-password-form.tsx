"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";

import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Once the request is accepted we swap the form for a confirmation. We never
  // learn (and must not reveal) whether an email actually went out.
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordInput) {
    setIsSubmitting(true);

    const response = await fetch("/api/auth/password/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setIsSubmitting(false);

    if (response.status === 429) {
      toast.error("محاولات كثيرة. يُرجى المحاولة لاحقًا");
      return;
    }
    if (!response.ok) {
      toast.error("تعذّر إرسال الطلب، حاول مرة أخرى");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <Card className="shadow-xl shadow-primary/5 [--card-spacing:--spacing(6)]">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck className="size-6" />
          </div>
          <CardTitle className="font-heading text-2xl">تحقّق من بريدك</CardTitle>
          <CardDescription>
            إذا كان هناك حساب مرتبط بـ{" "}
            <span dir="ltr" className="font-medium text-foreground">
              {getValues("email")}
            </span>
            ، فستصلك رسالة تحتوي على رابط لإعادة تعيين كلمة المرور. الرابط صالح
            لمدة ساعة.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            لم تصلك الرسالة؟ تفقّد مجلد الرسائل غير المرغوب فيها، أو{" "}
            <Link
              href="/auth/sign-in"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              عُد لتسجيل الدخول
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl shadow-primary/5 [--card-spacing:--spacing(6)]">
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-2xl">
          نسيت كلمة المرور؟
        </CardTitle>
        <CardDescription>
          أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            {errors.email && (
              <p role="alert" className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
            {isSubmitting && <Loader2 className="animate-spin" />}
            إرسال رابط إعادة التعيين
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">أو</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          تذكّرت كلمة المرور؟{" "}
          <Link
            href="/auth/sign-in"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            سجّل الدخول
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
