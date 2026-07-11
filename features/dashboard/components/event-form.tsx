"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { createEventSchema, type CreateEventInput } from "@/lib/validations/event";
import { STYLE_OPTIONS } from "@/lib/wedding-styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EventFormProps {
  mode: "create" | "edit";
  eventId?: string;
  defaultValues?: Partial<CreateEventInput>;
}

const EMPTY_DEFAULTS: CreateEventInput = {
  slug: "",
  style: "jordanian",
  groomName: "",
  brideName: "",
  date: "",
  dateDisplay: "",
  city: "",
  venueName: "",
  venueAddress: "",
  mapUrl: "",
  dressCode: "",
  schedule: [],
  message: "",
};

export function EventForm({ mode, eventId, defaultValues }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: { ...EMPTY_DEFAULTS, ...defaultValues },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule",
  });

  async function onSubmit(values: CreateEventInput) {
    setIsSubmitting(true);

    const endpoint =
      mode === "create" ? "/api/events" : `/api/events/${eventId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const body = await response.json();
      const fieldErrors = body?.error as
        | Partial<Record<keyof CreateEventInput, string[]>>
        | string
        | undefined;

      if (typeof fieldErrors === "object" && fieldErrors) {
        for (const [field, messages] of Object.entries(fieldErrors)) {
          setError(field as keyof CreateEventInput, {
            message: messages?.[0],
          });
        }
      } else {
        toast.error("تعذّر حفظ الدعوة، تحقق من البيانات وحاول مرة أخرى");
      }
      return;
    }

    const { event } = await response.json();

    if (mode === "create") {
      toast.success("تم إنشاء الدعوة");
      router.push(`/dashboard/events/${event.id}`);
    } else {
      toast.success("تم حفظ التغييرات");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>معلومات العروسين</CardTitle>
          <CardDescription>الأسماء ونمط الدعوة والرابط العام</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="brideName">اسم العروس</Label>
            <Input id="brideName" {...register("brideName")} />
            {errors.brideName && (
              <p className="text-xs text-destructive">
                {errors.brideName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="groomName">اسم العريس</Label>
            <Input id="groomName" {...register("groomName")} />
            {errors.groomName && (
              <p className="text-xs text-destructive">
                {errors.groomName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">الرابط العام</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">/i/</span>
              <Input
                id="slug"
                placeholder="sara-omar"
                disabled={mode === "edit"}
                {...register("slug")}
              />
            </div>
            {errors.slug && (
              <p className="text-xs text-destructive">
                {errors.slug.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="style">نمط الدعوة</Label>
            <Controller
              control={control}
              name="style"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="style" className="w-full">
                    <SelectValue placeholder="اختر النمط" />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>موعد ومكان الحفل</CardTitle>
          <CardDescription>التاريخ والقاعة والموقع</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="date">تاريخ الحفل</Label>
            <Input id="date" type="date" {...register("date")} />
            {errors.date && (
              <p className="text-xs text-destructive">
                {errors.date.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="dateDisplay">التاريخ بصيغة العرض</Label>
            <Input
              id="dateDisplay"
              placeholder="١٤ نوفمبر ٢٠٢٦"
              {...register("dateDisplay")}
            />
            {errors.dateDisplay && (
              <p className="text-xs text-destructive">
                {errors.dateDisplay.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="city">المدينة</Label>
            <Input id="city" {...register("city")} />
            {errors.city && (
              <p className="text-xs text-destructive">
                {errors.city.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="venueName">اسم القاعة</Label>
            <Input id="venueName" {...register("venueName")} />
            {errors.venueName && (
              <p className="text-xs text-destructive">
                {errors.venueName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="venueAddress">عنوان القاعة</Label>
            <Input id="venueAddress" {...register("venueAddress")} />
            {errors.venueAddress && (
              <p className="text-xs text-destructive">
                {errors.venueAddress.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="mapUrl">رابط خرائط جوجل</Label>
            <Input
              id="mapUrl"
              placeholder="https://maps.google.com/?q=..."
              {...register("mapUrl")}
            />
            {errors.mapUrl && (
              <p className="text-xs text-destructive">
                {errors.mapUrl.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="dressCode">الزي المطلوب (اختياري)</Label>
            <Input id="dressCode" {...register("dressCode")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>برنامج الحفل</CardTitle>
              <CardDescription>فقرات الحفل بالترتيب الزمني</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ time: "", title: "" })}
            >
              <Plus /> إضافة فقرة
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              لم تتم إضافة أي فقرات بعد
            </p>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-3">
              <Input
                placeholder="٨:٠٠"
                className="w-28"
                {...register(`schedule.${index}.time`)}
              />
              <Input
                placeholder="عقد القِران"
                className="flex-1"
                {...register(`schedule.${index}.title`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => remove(index)}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>رسالة الدعوة (اختياري)</CardTitle>
          <CardDescription>
            تظهر أسفل الأسماء في مقدمة الدعوة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea rows={3} {...register("message")} />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {mode === "create" ? "إنشاء الدعوة" : "حفظ التغييرات"}
        </Button>
      </div>
    </form>
  );
}
