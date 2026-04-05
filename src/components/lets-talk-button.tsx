"use client";

import { useState } from "react";
import { PhoneModal } from "./phone-modal";

interface LetsTalkButtonProps {
  className?: string;
  children?: React.ReactNode;
  serviceName?: string;
}

export function LetsTalkButton({ className, children, serviceName }: LetsTalkButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
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
