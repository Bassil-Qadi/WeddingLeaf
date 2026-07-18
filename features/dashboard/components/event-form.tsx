"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFieldArray, useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  BookHeart,
  CalendarDays,
  Clock,
  Heart,
  ListChecks,
  Loader2,
  MailCheck,
  MessageSquare,
  Plus,
  Trash2,
} from "lucide-react";

import {
  createEventSchema,
  DEFAULT_OPEN_RSVP_LIMIT,
  type CreateEventInput,
} from "@/lib/validations/event";
import { STYLE_OPTIONS } from "@/lib/wedding-styles";
import { THEME_OPTIONS, THEME_SWATCHES } from "@/lib/wedding-themes";
import { TEMPLATE_OPTIONS } from "@/lib/wedding-templates";
import {
  TIME_ZONE_OPTIONS,
  defaultTimeZoneForStyle,
  formatArabicDate,
  formatArabicDateDetail,
  zonedToUtc,
} from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  CardAction,
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
  theme: "classic",
  template: "thread",
  groomName: "",
  brideName: "",
  date: "",
  time: "20:00",
  timeZone: "Asia/Amman",
  city: "",
  venueName: "",
  venueAddress: "",
  mapUrl: "",
  dressCode: "",
  schedule: [],
  message: "",
  story: "",
  hashtag: "",
  rsvpPhone: "",
  rsvpEnabled: true,
  rsvpDeadline: null,
  allowOpenRsvp: true,
  maxPartySize: 4,
  openRsvpLimit: DEFAULT_OPEN_RSVP_LIMIT,
};

function SectionIcon({ icon: Icon }: { icon: typeof Heart }) {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon className="size-4" />
    </span>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-xs text-destructive">
      {message}
    </p>
  );
}

export function EventForm({ mode, eventId, defaultValues }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
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

  // The couple never types the Arabic date — they pick a day, an hour and a
  // city, and see exactly what the invitation will print.
  const [style, date, time, timeZone, rsvpEnabled, allowOpenRsvp] = useWatch({
    control,
    name: [
      "style",
      "date",
      "time",
      "timeZone",
      "rsvpEnabled",
      "allowOpenRsvp",
    ],
  });

  const preview =
    date && time && timeZone
      ? (() => {
          const instant = zonedToUtc(date, time, timeZone);
          return {
            display: formatArabicDate(instant, style, timeZone),
            detail: formatArabicDateDetail(instant, style, timeZone),
          };
        })()
      : null;

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
          <CardTitle className="flex items-center gap-2.5">
            <SectionIcon icon={Heart} />
            معلومات العروسين
          </CardTitle>
          <CardDescription>
            الأسماء والمنطقة وتصميم الدعوة والرابط العام
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="brideName">اسم العروس</Label>
            <Input id="brideName" {...register("brideName")} />
            <FieldError message={errors.brideName?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="groomName">اسم العريس</Label>
            <Input id="groomName" {...register("groomName")} />
            <FieldError message={errors.groomName?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">الرابط العام</Label>
            <div className="flex" dir="ltr">
              <span className="flex h-8 select-none items-center rounded-s-lg border border-e-0 border-input bg-muted px-2.5 text-sm text-muted-foreground">
                /i/
              </span>
              <Input
                id="slug"
                placeholder="sara-omar"
                className="rounded-s-none"
                disabled={mode === "edit"}
                aria-invalid={Boolean(errors.slug)}
                {...register("slug")}
              />
            </div>
            {mode === "edit" ? (
              <p className="text-xs text-muted-foreground">
                لا يمكن تغيير الرابط بعد إنشاء الدعوة
              </p>
            ) : (
              <FieldError message={errors.slug?.message} />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="style">المنطقة</Label>
            <Controller
              control={control}
              name="style"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    // The style says where the wedding is, which decides both the
                    // timezone and whether the invitation prints "تشرين الثاني"
                    // or "نوفمبر". Follow it, but never overwrite a deliberate
                    // choice the couple already made on an existing event.
                    if (mode === "create") {
                      setValue(
                        "timeZone",
                        defaultTimeZoneForStyle(
                          value as CreateEventInput["style"],
                        ),
                      );
                    }
                  }}
                >
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="template">تصميم الدعوة</Label>
            <Controller
              control={control}
              name="template"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="template" className="w-full">
                    <SelectValue placeholder="اختر التصميم" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-xs text-muted-foreground">
              يختار شكل الدعوة وتجربتها — عاينها من زر «معاينة» بعد الحفظ
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="theme">ألوان الدعوة</Label>
            <Controller
              control={control}
              name="theme"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="theme" className="w-full">
                    <SelectValue placeholder="اختر الألوان" />
                  </SelectTrigger>
                  <SelectContent>
                    {THEME_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className="size-3 shrink-0 rounded-full border border-black/10"
                            style={{ background: THEME_SWATCHES[option.value] }}
                          />
                          {option.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-xs text-muted-foreground">
              مجموعة الألوان التي تُطبَّق على التصميم الذي اخترته
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5">
            <SectionIcon icon={CalendarDays} />
            موعد ومكان الحفل
          </CardTitle>
          <CardDescription>التاريخ والقاعة والموقع</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="date">تاريخ الحفل</Label>
            <Input id="date" type="date" {...register("date")} />
            <FieldError message={errors.date?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="time">ساعة البدء</Label>
            <Input id="time" type="time" {...register("time")} />
            <FieldError message={errors.time?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="timeZone">المنطقة الزمنية</Label>
            <Controller
              control={control}
              name="timeZone"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="timeZone" className="w-full">
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_ZONE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-xs text-muted-foreground">
              يضبط العد التنازلي على التوقيت الصحيح
            </p>
          </div>

          <div className="flex flex-col justify-center gap-1 rounded-xl border border-dashed bg-muted/40 px-4 py-3">
            <p className="text-[11px] text-muted-foreground">
              كما سيظهر في الدعوة
            </p>
            {preview ? (
              <>
                <p className="font-heading text-lg leading-tight">
                  {preview.display}
                </p>
                <p className="text-xs text-muted-foreground">
                  {preview.detail}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground/70">
                اختر التاريخ والساعة
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="city">المدينة</Label>
            <Input id="city" {...register("city")} />
            <FieldError message={errors.city?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="venueName">اسم القاعة</Label>
            <Input id="venueName" {...register("venueName")} />
            <FieldError message={errors.venueName?.message} />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="venueAddress">عنوان القاعة</Label>
            <Input id="venueAddress" {...register("venueAddress")} />
            <FieldError message={errors.venueAddress?.message} />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="mapUrl">رابط خرائط جوجل</Label>
            <Input
              id="mapUrl"
              dir="ltr"
              placeholder="https://maps.google.com/?q=..."
              {...register("mapUrl")}
            />
            <FieldError message={errors.mapUrl?.message} />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="dressCode">الزي المطلوب (اختياري)</Label>
            <Input id="dressCode" {...register("dressCode")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5">
            <SectionIcon icon={ListChecks} />
            برنامج الحفل
          </CardTitle>
          <CardDescription>فقرات الحفل بالترتيب الزمني</CardDescription>
          <CardAction>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ time: "", title: "" })}
            >
              <Plus /> إضافة فقرة
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {fields.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-8 text-center">
              <Clock className="size-5 text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">
                لم تتم إضافة أي فقرات بعد
              </p>
              <p className="text-xs text-muted-foreground/70">
                مثال: ٨:٠٠ — استقبال الضيوف
              </p>
            </div>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-3">
              <Input
                placeholder="٨:٠٠"
                className="w-28 text-center"
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
                aria-label="حذف الفقرة"
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
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
          <CardTitle className="flex items-center gap-2.5">
            <SectionIcon icon={BookHeart} />
            قصتكما
          </CardTitle>
          <CardDescription>
            الفصل الذي يرويه الضيوف قبل كل شيء — بكلماتكما أنتما
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Textarea
              rows={4}
              placeholder="التقينا في مساءٍ عاديّ لم يكن يعرف أنه سيغيّر كل ما بعده…"
              {...register("story")}
            />
            <p className="text-xs text-muted-foreground">
              إن تركتموها فارغة، لن يظهر فصل «قصتنا» في الدعوة
            </p>
            <FieldError message={errors.story?.message} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="hashtag">وسم الزفاف (اختياري)</Label>
              <Input
                id="hashtag"
                placeholder="#سارة_و_عمر"
                {...register("hashtag")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="rsvpPhone">رقم للتواصل (اختياري)</Label>
              <Input
                id="rsvpPhone"
                dir="ltr"
                placeholder="+962 79 000 0000"
                {...register("rsvpPhone")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5">
            <SectionIcon icon={MailCheck} />
            تأكيد الحضور
          </CardTitle>
          <CardDescription>
            كيف يؤكّد ضيوفكم حضورهم من داخل الدعوة
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <Controller
            control={control}
            name="rsvpEnabled"
            render={({ field }) => (
              <label className="flex items-center justify-between gap-4 rounded-xl border p-4">
                <span>
                  <span className="block text-sm font-medium">
                    تفعيل تأكيد الحضور
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    يضيف فصل «تأكيد الحضور» إلى الدعوة
                  </span>
                </span>
                <Switch
                  checked={field.value ?? true}
                  onCheckedChange={field.onChange}
                />
              </label>
            )}
          />

          {rsvpEnabled !== false && (
            <>
              <Controller
                control={control}
                name="allowOpenRsvp"
                render={({ field }) => (
                  <label className="flex items-center justify-between gap-4 rounded-xl border p-4">
                    <span>
                      <span className="block text-sm font-medium">
                        السماح بالرد من الرابط العام
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        أوقفوه إن أردتم قبول ردود المدعوّين بالاسم فقط
                      </span>
                    </span>
                    <Switch
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                    />
                  </label>
                )}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="rsvpDeadline">آخر موعد للرد (اختياري)</Label>
                  <Input
                    id="rsvpDeadline"
                    type="date"
                    {...register("rsvpDeadline")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="maxPartySize">
                    أقصى عدد مرافقين للرد العام
                  </Label>
                  <Input
                    id="maxPartySize"
                    type="number"
                    min={1}
                    max={20}
                    {...register("maxPartySize", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">
                    المدعوّون بالاسم محدودون بعدد مقاعدهم
                  </p>
                </div>

                {allowOpenRsvp !== false && (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="openRsvpLimit">
                      أقصى عدد للردود العامة
                    </Label>
                    <Input
                      id="openRsvpLimit"
                      type="number"
                      min={0}
                      max={2000}
                      {...register("openRsvpLimit", { valueAsNumber: true })}
                    />
                    <p className="text-xs text-muted-foreground">
                      حدٌّ يحمي قائمتكم من الردود العشوائية. لا يشمل المدعوّين
                      بالاسم
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5">
            <SectionIcon icon={MessageSquare} />
            رسالة الدعوة (اختياري)
          </CardTitle>
          <CardDescription>
            تظهر أسفل الأسماء في مقدمة الدعوة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={3}
            placeholder="بقلوب مليئة بالفرح، ندعوكم لمشاركتنا حفل زفافنا…"
            {...register("message")}
          />
        </CardContent>
      </Card>

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-xl border bg-background/85 p-3 shadow-lg shadow-black/5 backdrop-blur-lg">
        <p className="hidden text-xs text-muted-foreground sm:block">
          {mode === "create"
            ? "يمكنك إضافة الصور والضيوف ونشر الدعوة بعد الإنشاء"
            : "التغييرات تنعكس على الرابط العام مباشرة بعد الحفظ"}
        </p>
        <div className="flex flex-1 justify-end gap-3">
          {mode === "create" && (
            <Button
              nativeButton={false}
              variant="ghost"
              size="lg"
              render={<Link href="/dashboard" />}
            >
              إلغاء
            </Button>
          )}
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            {mode === "create" ? "إنشاء الدعوة" : "حفظ التغييرات"}
          </Button>
        </div>
      </div>
    </form>
  );
}
