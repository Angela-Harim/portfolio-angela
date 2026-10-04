import { useEffect, useRef, useState } from "react";

/**
 * Reveals an element when it enters the viewport (scroll-triggered animation).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  delay = 0,
  from: "up" | "left" | "right" = "up",
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const base =
    from === "left" ? "reveal reveal-left" : from === "right" ? "reveal reveal-right" : "reveal";

  return {
    ref,
    className: visible ? `${base} reveal-visible` : base,
    style: { transitionDelay: `${delay}ms` } as React.CSSProperties,
  };
}

export function Reveal({
  children,
  delay = 0,
  from = "up",
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  from?: "up" | "left" | "right";
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const reveal = useReveal<HTMLDivElement>(delay, from);
  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={reveal.ref}
      style={reveal.style}
      className={`${reveal.className} ${className}`.trim()}
    >
      {children}
    </Component>
  );
}

