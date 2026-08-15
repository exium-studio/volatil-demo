// src/design-system/components/overlay/hooks/use-pop-modal.ts

import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef } from "react";

type UsePopModalOptions = {
  modalKey: string;
  depth?: number;
};

export const MODAL_SEARCH_PARAM_KEY = "activeModalKey";

export function usePopModal(options: UsePopModalOptions) {
  // Options
  const { modalKey, depth } = options;

  // Refs — stable references so callbacks have zero unstable dependencies
  const modalKeyRef = useRef(modalKey);
  const depthRef = useRef(depth);
  const lastCloseAtRef = useRef(0);

  useEffect(() => {
    modalKeyRef.current = modalKey;
    depthRef.current = depth;
  }, [modalKey, depth]);

  // Select only activeModalKey — component re-renders only when this specific
  // param changes, not on any other search param mutation
  const activeModalKey = useSearch({
    strict: false,
    select: (s: Record<string, string | undefined>) => s.activeModalKey,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!activeModalKey) {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    }
  }, [activeModalKey]);

  const isOpen = useMemo(() => {
    if (typeof activeModalKey !== "string") return false;

    return (
      activeModalKey === modalKey || activeModalKey.startsWith(modalKey + ".")
    );
  }, [modalKey, activeModalKey]);

  const open = useCallback(() => {
    navigate({
      to: ".",
      resetScroll: false,
      search: (old) => ({ ...old, activeModalKey: modalKeyRef.current }),
    });
  }, [navigate]);

  const close = useCallback(() => {
    const now = Date.now();

    if (now - lastCloseAtRef.current < 300) {
      return;
    }

    lastCloseAtRef.current = now;

    const d = depthRef.current;
    if (d && d > 1) {
      window.history.go(-d);
    } else {
      window.history.back();
    }
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) {
      navigate({
        to: ".",
        resetScroll: false,
        search: (old) => old,
      });
      return;
    }
    open();
  }, [isOpen, navigate, open]);

  return {
    modalKey,
    isOpen,
    open,
    toggle,
    close,
    depth,
  };
}
