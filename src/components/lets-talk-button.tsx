"use client";

import { useState } from "react";
import { usePostHog } from "posthog-js/react";
import { PhoneModal } from "./phone-modal";

interface LetsTalkButtonProps {
  className?: string;
  children?: React.ReactNode;
  serviceName?: string;
}

export function LetsTalkButton({ className, children, serviceName }: LetsTalkButtonProps) {
  const [open, setOpen] = useState(false);
  const posthog = usePostHog();

  const handleClick = () => {
    posthog?.capture("cta_book_call_clicked", { service_name: serviceName });
    setOpen(true);
  };

  return (
    <>
      <button onClick={handleClick} className={className}>
        {children ?? "Let\u2019s Talk"}
      </button>
      {open && (
        <PhoneModal
          serviceName={serviceName ?? "Let's Talk"}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
