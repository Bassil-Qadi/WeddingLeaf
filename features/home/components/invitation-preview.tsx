"use client";

import { motion } from "framer-motion";
import { motion as motionPreset } from "@/config/motion";

export function InvitationPreview() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={motionPreset.cinematic}
      className="relative mx-auto mt-24 w-full max-w-xl"
    >
      <div className="rounded-[32px] border bg-white p-10 shadow-2xl">

        <p className="text-center text-primary tracking-[0.3em] uppercase">
          Wedding Invitation
        </p>

        <h2 className="mt-8 text-center font-heading text-5xl">
          أحمد
          <br />
          &
          <br />
          سارة
        </h2>

        <div className="my-10 h-px bg-border"/>

        <div className="space-y-4 text-center">

          <p>📅 الجمعة 20 يونيو 2027</p>

          <p>🕘 8:00 مساءً</p>

          <p>📍 عمّان، الأردن</p>

        </div>

      </div>
    </motion.div>
  );
}