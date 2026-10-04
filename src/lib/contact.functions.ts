import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Votre nom est requis")
    .max(100, "Le nom doit faire moins de 100 caractères"),
  email: z
    .string()
    .trim()
    .email("Adresse email invalide")
    .max(255, "L'email doit faire moins de 255 caractères"),
  subject: z
    .string()
    .trim()
    .min(1, "Le sujet est requis")
    .max(150, "Le sujet doit faire moins de 150 caractères"),
  message: z
    .string()
    .trim()
    .min(10, "Votre message doit faire au moins 10 caractères")
    .max(2000, "Le message doit faire moins de 2000 caractères"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];

    if (!url || !key) {
      return { ok: false as const, error: "Service indisponible pour le moment." };
    }

    const supabase = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { error } = await supabase.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

    if (error) {
      console.error("contact_messages insert failed:", error.message);
      return {
        ok: false as const,
        error: "Impossible d'envoyer le message. Réessayez plus tard.",
      };
    }

    const resendKey = process.env["RESEND_API_KEY"];
    const notifyEmail = process.env["CONTACT_NOTIFY_EMAIL"] ?? "hei.angela.5@gmail.com";

    if (!resendKey) {
      console.warn("RESEND_API_KEY manquante : email de notification non envoyé.");
      return { ok: true as const };
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio <onboarding@resend.dev>",
          to: [notifyEmail],
          reply_to: data.email,
          subject: `[Portfolio] ${data.subject}`,
          text: `Nouveau message depuis ton portfolio.\n\nNom: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
        }),
      });

      if (!response.ok) {
        console.error("Resend email failed:", response.status, await response.text());
      }
    } catch (err) {
      console.error("Resend email error:", err);
    }

    return { ok: true as const };
  });
