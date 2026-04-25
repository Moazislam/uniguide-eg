"use client";

import { useLanguage } from "@/lib/LanguageContext";

interface Props {
  tKey: string;
  className?: string;
}

export function LocalizedText({ tKey, className }: Props) {
  const { t } = useLanguage();
  return <span className={className}>{t(tKey)}</span>;
}

export function LocalizedHeading({ tKey, className }: Props) {
  const { t } = useLanguage();
  return <h1 className={className}>{t(tKey)}</h1>;
}

export function LocalizedParagraph({ tKey, className }: Props) {
  const { t } = useLanguage();
  return <p className={className}>{t(tKey)}</p>;
}
