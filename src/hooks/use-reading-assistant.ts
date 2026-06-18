"use client";

import { useEffect, useState, useCallback } from "react";
import { lookupWord } from "@/services/dictionary";
import { translateText } from "@/services/search";
import type { CefrLevel } from "@/types/dictionary";

interface SelectionToolbarState {
  visible: boolean;
  text: string;
  x: number;
  y: number;
  definition?: string;
  pronunciation?: string;
  examples?: string[];
  synonyms?: string[];
  level?: CefrLevel;
  translation?: string;
  loading: boolean;
}

export function useReadingAssistant() {
  const [state, setState] = useState<SelectionToolbarState>({
    visible: false,
    text: "",
    x: 0,
    y: 0,
    loading: false,
  });

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (!text || text.length > 100) {
        setState((s) => ({ ...s, visible: false }));
        return;
      }

      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (!rect) return;

      setState({
        visible: true,
        text,
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
        loading: false,
      });
    };

    document.addEventListener("mouseup", handleSelection);
    return () => document.removeEventListener("mouseup", handleSelection);
  }, []);

  const lookup = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const result = await lookupWord(state.text);
    setState((s) => ({
      ...s,
      loading: false,
      definition: result.definition,
      pronunciation: result.pronunciation,
      examples: result.examples,
      synonyms: result.synonyms,
      level: result.level,
    }));
  }, [state.text]);

  const translate = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const result = await translateText(state.text);
    setState((s) => ({ ...s, loading: false, translation: result }));
  }, [state.text]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(state.text);
  }, [state.text]);

  const close = useCallback(() => {
    setState((s) => ({ ...s, visible: false }));
  }, []);

  return { state, lookup, translate, copy, close };
}
