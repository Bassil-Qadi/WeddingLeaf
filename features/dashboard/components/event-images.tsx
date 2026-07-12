"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EventImagesProps {
  eventId: string;
  coverImageUrl: string | null;
  galleryImages: string[];
}

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body?.error ?? "تعذّر رفع الصورة");
  }

  return body.url as string;
}

async function patchEvent(eventId: string, payload: Record<string, unknown>) {
  const response = await fetch(`/api/events/${eventId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body?.error ?? "تعذّر حفظ التغييرات");
  }
}

export function EventImages({
  eventId,
  coverImageUrl,
  galleryImages,
}: EventImagesProps) {
  const router = useRouter();
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const url = await uploadFile(file);
      await patchEvent(eventId, { coverImageUrl: url });
      toast.success("تم تحديث صورة الغلاف");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ");
    } finally {
      setIsUploadingCover(false);
      e.target.value = "";
    }
  }

  async function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setIsUploadingGallery(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        uploaded.push(await uploadFile(file));
      }
      await patchEvent(eventId, {
        galleryImages: [...galleryImages, ...uploaded],
      });
      toast.success("تمت إضافة الصور");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ");
    } finally {
      setIsUploadingGallery(false);
      e.target.value = "";
    }
  }

  async function removeGalleryImage(url: string) {
    try {
      await patchEvent(eventId, {
        galleryImages: galleryImages.filter((image) => image !== url),
      });
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ImagePlus className="size-4" />
          </span>
          الصور
        </CardTitle>
        <CardDescription>صورة الغلاف ومعرض صور الدعوة</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div>
          <p className="mb-2 text-sm font-medium">صورة الغلاف</p>
          <div className="flex items-center gap-4">
            <div className="flex h-24 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted ring-1 ring-border">
              {coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverImageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlus className="text-muted-foreground" />
              )}
            </div>

            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
            <Button
              type="button"
              variant="outline"
              disabled={isUploadingCover}
              onClick={() => coverInputRef.current?.click()}
            >
              {isUploadingCover && <Loader2 className="animate-spin" />}
              {coverImageUrl ? "تغيير الصورة" : "رفع صورة الغلاف"}
            </Button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">معرض الصور</p>
          <div className="flex flex-wrap gap-3">
            {galleryImages.map((url) => (
              <div
                key={url}
                className="group relative h-24 w-24 overflow-hidden rounded-xl bg-muted ring-1 ring-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  type="button"
                  aria-label="حذف الصورة"
                  onClick={() => removeGalleryImage(url)}
                  className="absolute top-1 end-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}

            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleGalleryChange}
            />
            <button
              type="button"
              disabled={isUploadingGallery}
              onClick={() => galleryInputRef.current?.click()}
              className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed text-muted-foreground transition hover:border-primary/50 hover:bg-primary/5 hover:text-primary disabled:opacity-50"
            >
              {isUploadingGallery ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <ImagePlus />
                  <span className="text-[11px]">إضافة صور</span>
                </>
              )}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
