import type { LucideIcon } from "lucide-react";
import type { TranslationDictionary } from "@/i18n/types";

export type NavLabelKey = keyof TranslationDictionary["nav"];

export interface NavItem {
  labelKey: NavLabelKey;
  href: string;
  icon: LucideIcon;
}
