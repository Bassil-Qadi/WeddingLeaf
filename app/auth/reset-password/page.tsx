import type { Metadata } from "next";
import Link from "next/link";

import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "إعادة تعيين كلمة المرور",
};

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  // No token means the link was mangled or opened by hand. Don't render a form
  // that can only fail — send them back to request a fresh one.
  if (!token) {
    return (
      <Card className="shadow-xl shadow-primary/5 [--card-spacing:--spacing(6)]">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl">رابط غير صالح</CardTitle>
          <CardDescription>
            هذا الرابط غير مكتمل أو منتهي الصلاحية.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              اطلب رابطًا جديدًا
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  return <ResetPasswordForm token={token} />;
}
