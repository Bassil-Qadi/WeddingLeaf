"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DeleteEventCard({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const response = await fetch(`/api/events/${eventId}`, {
      method: "DELETE",
    });
    setIsDeleting(false);

    if (!response.ok) {
      toast.error("تعذّر حذف الدعوة");
      return;
    }

    toast.success("تم حذف الدعوة");
    router.push("/dashboard");
  }

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-destructive">منطقة الخطر</CardTitle>
        <CardDescription>حذف الدعوة إجراء لا يمكن التراجع عنه</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
          <Trash2 /> حذف الدعوة نهائيًا
        </Button>
      </CardContent>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف الدعوة؟</DialogTitle>
            <DialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيتم حذف جميع بيانات الدعوة
              نهائيًا.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="animate-spin" />}
              حذف نهائيًا
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
