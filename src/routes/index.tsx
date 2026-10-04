import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  CheckCircle2,
  Code2,
  Database,
  Download,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";

import { Reveal } from "@/hooks/use-reveal";
import { contactSchema, sendContactMessage } from "@/lib/contact.functions";

import airQualityPipeline from "../assets/air-quality-pipeline.png";
import avatarImage from "../assets/avatar-angela.png";
import expenseTracker from "../assets/expense-tracker.png";
import eventSync from "../assets/eventsync.png";
import tacoLoco from "../assets/tacoloco-fullbleed.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Angela Harimalala — Portfolio front-end" },
      {
        name: "description",
        content:
          "Portfolio d'Angela Harimalala, développeuse front-end en recherche d'alternance. HTML, CSS, JavaScript, React, WordPress.",
      },
      {
        property: "og:title",
        content: "Angela Harimalala — Portfolio front-end",
      },
      {
        property: "og:description",
        content:
          "Développement front-end, React, JavaScript, WordPress et création de sites web.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const PROFILE = {
  name: "HARIMALALA Vololontsoa Angela",
  shortName: "Angela Harimalala",
  role: "Développeuse front-end en alternance",
  tagline: "HTML · CSS · JavaScript · React · WordPress",
  email: "hei.angela.5@gmail.com",
  phone: "+261 38 58 189 74",
  location: "Antananarivo, Madagascar",
  linkedin: "https://www.linkedin.com/in/angela-harimalala-26b4a0394",
  github: "https://github.com/Angela-Harim",
};

type FormStatus = "idle" | "sending" | "success" | "error";

function ContactForm() {
  const submit = useServerFn(sendContactMessage);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const fieldClass =
    "w-full rounded-2xl border border-charcoal-border/50 bg-charcoal-elevated/60 px-5 py-3.5 text-sm text-stone-100 placeholder:text-stone-500 outline-none transition-all duration-300 focus:border-ember focus:bg-charcoal-elevated focus:shadow-[0_0_0_4px_rgba(232,93,58,0.12)]";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const parsed = contactSchema.safeParse(raw);

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setServerError(null);
    setStatus("sending");
    try {
      const result = await submit({ data: parsed.data });
      if (result.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setServerError(result.error);
      }
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof z.ZodError
          ? "Certains champs sont invalides."
          : "Impossible d'envoyer le message. Réessayez plus tard.",
      );
    }
  };

  if (status === "success") {
    return (
      <div className="flex h-full min-h-[360px] flex-col items-center justify-center rounded-[2rem] border border-ember/40 bg-charcoal-elevated/60 p-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ember/15 text-ember">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-2xl italic text-ember-soft">Message envoyé !</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone-400">
          Merci pour votre message. Je vous réponds dès que possible.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-stone-300 underline-offset-4 transition-colors hover:text-ember hover:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <input name="name" placeholder="Votre nom" autoComplete="name" maxLength={100} className={fieldClass} />
          {errors.name && <p className="mt-1.5 pl-2 text-xs text-ember">{errors.name}</p>}
        </div>
        <div>
          <input name="email" type="email" placeholder="Votre email" autoComplete="email" maxLength={255} className={fieldClass} />
          {errors.email && <p className="mt-1.5 pl-2 text-xs text-ember">{errors.email}</p>}
        </div>
      </div>
      <div>
        <input name="subject" placeholder="Sujet" maxLength={150} className={fieldClass} />
        {errors.subject && <p className="mt-1.5 pl-2 text-xs text-ember">{errors.subject}</p>}
      </div>
      <div>
        <textarea name="message" placeholder="Votre message" rows={6} maxLength={2000} className={`${fieldClass} resize-none`} />
        {errors.message && <p className="mt-1.5 pl-2 text-xs text-ember">{errors.message}</p>}
      </div>

      {serverError && (
        <p className="rounded-2xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember-soft">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-ember px-6 py-3.5 text-sm font-medium tracking-wide text-charcoal-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-10px_rgba(232,93,58,0.7)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Envoi en cours…
          </>
        ) : (
          <>
            Envoyer le message
            <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
          </>
        )}
      </button>
    </form>
  );
}

const SKILLS = [
  {
    title: "Développement web",
    icon: Code2,
    items: [
      "HTML / CSS / JavaScript",
      "React",
      "Bootstrap / Tailwind CSS",
      "Java",
      "Next.js (bases)",
      "Spring Boot (bases)",
    ],
  },
  {
    title: "Données & Business Intelligence",
    icon: Database,
    items: [
      "Modélisation de données",
      "PostgreSQL / MySQL",
      "ETL et orchestration",
      "Apache Airflow",
      "Python pour la data",
    ],
  },
  {
    title: "Transformation numérique",
    icon: Sparkles,
    items: [
      "WordPress",
      "Odoo",
      "Marketing digital",
      "Gestion de contenu",
    ],
  },
  {
    title: "Outils & environnement",
    icon: Wrench,
    items: [
      "GitHub",
      "VS Code",
      "IntelliJ IDEA",
      "Git",
      "Méthodes agiles",
    ],
  },
];



const JOURNEY = [
  {
    year: "Septembre 2024 – 2025",
    title: "Licence 1 : fondations du développement web",
    description:
      "Premiers pas en informatique avec HTML, CSS, JavaScript, Java et React. Découverte des frameworks CSS Bootstrap et Tailwind CSS, et des premières interfaces responsives.",
    tags: ["HTML", "CSS", "JavaScript", "Java", "React", "Bootstrap", "Tailwind CSS"],
  },
  {
    year: "2025 – 2026",
    title: "Licence 2 : front-end, back-end et données",
    description:
      "Approfondissement du web avec Next.js et initiation au back-end avec Spring Boot. Cours de Donnée 2 avec modélisation de données, ETL, orchestration de workflows avec Python et Apache Airflow, et découverte de la Business Intelligence. Année validée.",
    tags: ["Next.js", "Spring Boot", "ETL", "Airflow", "Python", "BI"],
  },
  {
    year: "Prochaine rentrée",
    title: "Licence 3 : transformation numérique et alternance",
    description:
      "Licence 1 et Licence 2 validées, j'entre en Licence 3 dans deux mois. Je poursuis ma spécialisation en transformation numérique (WordPress, Odoo, marketing digital) et je recherche une alternance en front-end.",
    tags: ["Licence 3", "Odoo", "WordPress", "Marketing digital", "Alternance"],
  },
];

const PROJECTS = [
  {
    category: "Application web · Gestion d’événements",
    title: "EventSync",
    description:
      "Plateforme de gestion d’événements et d’engagement des participants en temps réel. Elle remplace les supports statiques (PDF, programmes papier) par une interface dynamique permettant de naviguer facilement dans un événement et d’interagir avec les sessions. Réalisé en Licence 2.",
    image: eventSync,
    imageAlt: "Aperçu du projet EventSync",
    tags: ["Next.js", "TypeScript", "Événements", "Temps réel"],
    aspect: "aspect-[4/3]",
  },
  {
    category: "Application web · Finance personnelle",
    title: "Expense Tracker",
    description:
      "Application de suivi des finances personnelles réalisée en Licence 1 avec React et JavaScript. Permet d’ajouter, de catégoriser et de visualiser les revenus et les dépenses pour mieux gérer son budget au quotidien.",
    image: expenseTracker,
    imageAlt: "Aperçu du projet Expense Tracker",
    tags: ["React", "JavaScript", "Finance personnelle", "Visualisation"],
    aspect: "aspect-[4/3]",
  },
  {
    category: "Data engineering · Qualité de l’air",
    title: "Pipeline de données de qualité de l’air",
    description:
      "Développement d’un pipeline automatisé collectant, nettoyant et stockant des données de qualité de l’air pour plusieurs villes. Les données sont ensuite intégrées dans un data warehouse pour faciliter leur analyse.",
    image: airQualityPipeline,
    imageAlt: "Aperçu du pipeline de données de qualité de l’air",
    tags: ["Python", "Airflow", "API", "SQL", "Data Warehouse"],
    aspect: "aspect-[4/3]",
  },
  {
    category: "Site web · Restauration",
    title: "TacoLoco",
    description:
      "Plateforme web dédiée à la présentation d’une offre de restauration, avec une navigation structurée, un espace blog, des témoignages et un formulaire de contact. Le site intègre également des fonctionnalités de référencement et de sauvegarde pour assurer sa visibilité et sa gestion.",
    image: tacoLoco,
    imageAlt: "Aperçu du site TacoLoco",
    tags: ["WordPress", "Elementor", "Yoast SEO", "WPForms"],
    aspect: "aspect-[4/3]",
  },
];

function SectionTitle({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <Reveal className="mb-12 text-center">
      <span className="mb-3 block text-[10px] font-medium uppercase tracking-[0.25em] text-ember">
        {eyebrow}
      </span>
      <h2 className="font-display text-3xl md:text-4xl text-ember-soft">{title}</h2>
      {intro ? (
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-stone-400">{intro}</p>
      ) : null}
    </Reveal>
  );
}

function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-charcoal-border/60 bg-charcoal-elevated/60 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.15em] text-stone-400">
      {children}
    </span>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-stone-200 font-body selection:bg-ember selection:text-white">
      <nav className="fixed top-0 z-50 w-full mix-blend-difference">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-6 text-[11px] font-medium uppercase tracking-[0.2em] text-stone-200">
          <a href="#accueil" className="transition-colors duration-300 hover:text-ember">
            {PROFILE.shortName}
          </a>
          <div className="hidden gap-8 sm:flex">
            <a href="#apropos" className="transition-colors duration-300 hover:text-ember">
              À propos
            </a>
            <a href="#parcours" className="transition-colors duration-300 hover:text-ember">
              Parcours
            </a>
            <a href="#projets" className="transition-colors duration-300 hover:text-ember">
              Projets
            </a>
            <a href="#contact" className="transition-colors duration-300 hover:text-ember">
              Contact
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-32 md:py-40">
        <section
          id="accueil"
          className="mb-28 flex animate-avatar-entrance flex-col items-center text-center md:mb-36"
        >
          <div className="relative mb-10">
            {/* Soft glow backdrop */}
            <div className="absolute inset-0 -m-12 rounded-full bg-ember/20 blur-3xl animate-avatar-glow" />

            {/* Avatar container */}
            <div className="relative z-10 animate-avatar-breathe">
              {/* Circular gradient border */}
              <div className="animate-avatar-border relative h-44 w-44 rounded-full bg-gradient-to-br from-ember-soft via-ember to-charcoal-elevated p-[3px] shadow-[0_20px_50px_-20px_rgba(232,93,58,0.3)] md:h-56 md:w-56">
                <div className="h-full w-full overflow-hidden rounded-full bg-charcoal-base">
                  <img
                    src={avatarImage}
                    alt={`Portrait de ${PROFILE.name}`}
                    width={512}
                    height={512}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Subtle status dot */}
              <div className="absolute bottom-3 right-2 flex h-6 w-6 items-center justify-center rounded-full border border-charcoal-border/60 bg-charcoal-elevated/90 shadow-md">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-ember-soft" />
              </div>
            </div>
          </div>

          <span className="mb-4 text-[11px] uppercase tracking-[0.25em] text-stone-500">
            Bonjour, je suis
          </span>
          <h1 className="mb-4 font-display text-5xl leading-tight text-ember-soft md:text-6xl">
            {PROFILE.shortName}
          </h1>
          <p className="text-base text-stone-300 md:text-lg">{PROFILE.role}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone-500">
            {PROFILE.tagline}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href="#contact"
              className="rounded-full bg-ember px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(232,93,58,0.6)]"
            >
              Me contacter
            </a>
            <a
              href="/cv-angela-harimalala.pdf"
              download="CV_Angela_Harimalala.pdf"
              className="inline-flex items-center gap-2 rounded-full border border-charcoal-border px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-stone-300 transition-colors duration-300 hover:border-ember hover:text-ember"
            >
              <Download className="h-4 w-4" />
              Télécharger mon CV
            </a>
          </div>
        </section>

        <section id="apropos" className="mb-28 md:mb-36">
          <SectionTitle eyebrow="À propos" title="À propos de moi" />

          <Reveal className="mx-auto max-w-3xl">
            <p className="font-display text-2xl leading-snug text-stone-100 md:text-3xl">
              Développeuse <span className="text-ember-soft">front-end en formation</span>, basée à{" "}
              {PROFILE.location}.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-stone-400 md:text-base">
              Étudiante en licence d'informatique, filière{" "}
              <span className="text-ember-soft">Transformation numérique</span> — L1 et L2 validées,
              entrée en Licence 3 à la prochaine rentrée. J'ai découvert le
              développement web en Licence 1 avec HTML, CSS, JavaScript et React, puis je l'ai
              approfondi en Licence 2 avec Next.js, TypeScript et les bases du back-end. Au fil des
              projets d'école, créer des interfaces claires, réactives et agréables à utiliser est
              devenu bien plus qu'un exercice : c'est ce que je préfère faire.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-stone-400 md:text-base">
              J'aime comprendre comment les choses fonctionnent, résoudre des problèmes et
              transformer une idée en une interface concrète. Ma filière m'amène aussi à travailler
              le marketing digital, WordPress et les outils métiers (CRM, ERP, Odoo) : une double
              culture technique et métier qui m'aide à mieux comprendre les besoins réels des
              entreprises.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-stone-500">
              Mon objectif : rejoindre une équipe en alternance pour progresser en front-end et
              contribuer à des produits web modernes, utiles et bien conçus.
            </p>

            <div className="mt-14 flex items-center gap-5">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-charcoal-border to-transparent" />
              <span className="font-display text-sm italic text-ember-soft">
                Depuis 2024 · Licence d'informatique en cours · 4 projets · alternance front-end
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-charcoal-border to-transparent" />
            </div>
          </Reveal>


          <div className="grid gap-6 md:grid-cols-2">
            {SKILLS.map((skill, i) => {
              const Icon = skill.icon;
              return (
                <Reveal
                  key={skill.title}
                  delay={i * 90}
                  from={i % 2 === 0 ? "left" : "right"}
                  className="group relative h-full overflow-hidden rounded-[2rem] border border-charcoal-border/50 bg-charcoal-elevated/50 p-7 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-ember/50 hover:bg-charcoal-elevated/80"
                >
                  <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-ember/0 blur-2xl transition-all duration-500 group-hover:bg-ember/20" />
                  <span className="pointer-events-none absolute right-6 top-6 font-display text-4xl text-charcoal-border/40 transition-colors duration-500 group-hover:text-ember/30">
                    0{i + 1}
                  </span>

                  <span className="relative mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-ember/30 bg-ember/10 text-ember transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>

                  <h3 className="relative mb-4 font-display text-xl text-stone-100">
                    {skill.title}
                  </h3>

                  <div className="relative flex flex-wrap gap-2">
                    {skill.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-charcoal-border/60 bg-background/40 px-3 py-1.5 text-xs text-stone-300 transition-colors duration-300 hover:border-ember/50 hover:text-ember-soft"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>


        <section id="parcours" className="mb-28 md:mb-36">
          <SectionTitle
            eyebrow="Parcours"
            title="Mon parcours"
            intro="Du premier fichier HTML à l'accompagnement digital des entreprises."
          />

          <div className="mx-auto max-w-3xl space-y-12">
            {JOURNEY.map((step, i) => (
              <Reveal key={step.year} delay={i * 120} from={i % 2 === 0 ? "left" : "right"} className="relative border-l border-ember/30 pl-6">
                <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-ember" />
                <span className="text-[11px] uppercase tracking-[0.25em] text-ember">
                  {step.year}
                </span>
                <h3 className="mt-1.5 font-display text-xl text-stone-100">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-400">
                  {step.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {step.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="projets" className="mb-28 md:mb-36">
          <SectionTitle
            eyebrow="Projets"
            title="Mes projets"
            intro="Une sélection de réalisations entre web, marketing digital et outils métiers."
          />

          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-2">
            {PROJECTS.map((project, i) => (
              <Reveal as="article" key={project.title} delay={i * 90} from={i % 2 === 0 ? "left" : "right"} className="group flex h-full cursor-pointer">
                <div className="flex h-full flex-col overflow-hidden rounded-lg border border-charcoal-border/50 bg-charcoal-elevated/60 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-ember/40 hover:shadow-[0_10px_24px_-18px_rgba(232,93,58,0.25)]">
                  <div className="relative aspect-[2/1] w-full shrink-0 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.imageAlt}
                      width={300}
                      height={150}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-80 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-2.5">
                    <span className="mb-0.5 block text-[7px] font-medium uppercase tracking-[0.2em] text-ember">
                      {project.category}
                    </span>
                    <h3 className="font-display text-sm leading-tight text-stone-100">{project.title}</h3>
                    <p className="mt-1 line-clamp-2 min-h-[1.9rem] text-[10px] leading-snug text-stone-400">
                      {project.description}
                    </p>
                    <div className="mt-auto flex flex-wrap content-start gap-1 pt-2">
                      {project.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="contact">
          <SectionTitle
            eyebrow="Contact"
            title="Me contacter"
            intro="Une alternance front-end, un stage ou un projet web à lancer ? Écrivons-nous."
          />

          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <Reveal from="left">
              <ContactForm />
            </Reveal>

            <Reveal delay={140} from="right">
              <div className="rounded-[2rem] border border-charcoal-border/50 bg-charcoal-elevated/60 p-6 md:p-8">
                <div className="space-y-4">
                  {[
                    { label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}`, Icon: Mail },
                    { label: "Téléphone", value: PROFILE.phone, href: `tel:${PROFILE.phone.replace(/\s+/g, "")}`, Icon: Phone },
                    { label: "Adresse", value: PROFILE.location, href: undefined, Icon: MapPin },
                  ].map(({ label, value, href, Icon }) => (
                    <div
                      key={label}
                      className="group flex items-center gap-4 rounded-2xl border border-charcoal-border/40 bg-charcoal-base/60 p-4 transition-colors duration-300 hover:border-ember/50"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ember/10 text-ember transition-colors duration-300 group-hover:bg-ember/20">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <span className="block text-[10px] uppercase tracking-[0.2em] text-stone-500">
                          {label}
                        </span>
                        {href ? (
                          <a
                            href={href}
                            className="block truncate text-sm text-stone-200 transition-colors duration-300 hover:text-ember"
                          >
                            {value}
                          </a>
                        ) : (
                          <span className="block truncate text-sm text-stone-200">{value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <a
                    href={PROFILE.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl border border-charcoal-border/50 bg-charcoal-base/60 px-4 py-3 text-sm text-stone-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-ember hover:text-ember"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                  <a
                    href={PROFILE.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl border border-charcoal-border/50 bg-charcoal-base/60 px-4 py-3 text-sm text-stone-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-ember hover:text-ember"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                </div>

                <p className="mt-6 font-display text-lg italic text-ember-soft">
                  Actuellement en recherche d'une alternance front-end.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="mt-24 text-center text-[9px] font-light tracking-[0.3em] opacity-20">
            © MMXXVI {PROFILE.shortName.toUpperCase()}
          </div>
        </section>
      </main>
    </div>
  );
}
