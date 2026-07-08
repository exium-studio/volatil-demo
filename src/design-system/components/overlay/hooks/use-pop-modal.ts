// src/design-system/components/overlay/hooks/use-pop-modal.ts

import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";

type UsePopModalOptions = {
  modalKey: string;
  depth?: number;
};

export const MODAL_SEARCH_PARAM_KEY = "activeModalKey";

export function usePopModal(options: UsePopModalOptions) {
  // Options
  const { modalKey, depth } = options;

  const lastCloseAtRef = useRef(0);
  const { activeModalKey } = useSearch({ strict: false }) as Record<
    string,
    string | undefined
  >;
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

  function open() {
    navigate({
      to: ".",
      resetScroll: false,
      search: (old) => ({ ...old, activeModalKey: modalKey }),
    });
  }

  function toggle() {
    if (isOpen) {
      navigate({
        to: ".",
        resetScroll: false,
        search: (old) => old,
      });
      return;
    }
    open();
  }

  function close() {
    const now = Date.now();

    if (now - lastCloseAtRef.current < 300) {
      return;
    }

    lastCloseAtRef.current = now;

    if (depth && depth > 1) {
      window.history.go(-depth);
    } else {
      window.history.back();
    }
  }

  return {
    modalKey,
    isOpen,
    open,
    toggle,
    close,
    depth,
  };
}
