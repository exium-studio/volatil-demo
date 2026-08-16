// src/design-system/components/layout/ui/scroll-container.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type {
  HScrollContainerProps,
  VScrollContainerProps,
} from "@/design-system/components/layout/types/scroll-container.type";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Box } from "@chakra-ui/react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export const VScrollContainer = forwardRef<
  HTMLDivElement,
  VScrollContainerProps
>((props, ref) => {
  // Props
  const {
    children,
    borderColor = "an1",
    showTopBorderOnScroll = true,
    showScrollButtons = false,
    enableScroll = false,
    ...restProps
  } = props;

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  // States
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const { scrollTop: currentScrollTop, scrollHeight, clientHeight } = el;
    setShowUp(currentScrollTop > 5);
    setShowDown(currentScrollTop < scrollHeight - clientHeight - 5);
    setScrollTop(currentScrollTop);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      updateScrollState();
    };

    if (enableScroll) {
      el.style.overscrollBehavior = "contain";
    } else {
      el.style.overscrollBehavior = "";
    }

    el.addEventListener("scroll", handleScroll);
    updateScrollState();

    const observer = new ResizeObserver(() => updateScrollState());
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      el.style.overscrollBehavior = "";
    };
  }, [enableScroll, updateScrollState]);

  const scroll = (direction: "up" | "down") => {
    const el = containerRef.current;
    if (!el) return;
    const amount = el.clientHeight * 0.8;
    el.scrollBy({
      top: direction === "up" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <Box position={"relative"} h={"full"} w={"full"} role={"group"}>
      {showScrollButtons && showUp && (
        <Box
          position={"absolute"}
          top={2}
          left={"50%"}
          transform={"translateX(-50%)"}
          zIndex={2}
        >
          <IconButton
            size={"xs"}
            variant={"frosted"}
            rounded={"full"}
            onClick={() => scroll("up")}
          >
            <AppIcon icon={ChevronUp} />
          </IconButton>
        </Box>
      )}

      {showScrollButtons && showDown && (
        <Box
          position={"absolute"}
          bottom={2}
          left={"50%"}
          transform={"translateX(-50%)"}
          zIndex={2}
        >
          <IconButton
            size={"xs"}
            variant={"frosted"}
            rounded={"full"}
            onClick={() => scroll("down")}
          >
            <AppIcon icon={ChevronDown} />
          </IconButton>
        </Box>
      )}

      <VStack
        ref={containerRef}
        tabIndex={-1}
        overflowY={"auto"}
        borderTop={showTopBorderOnScroll ? "1px solid" : "none"}
        borderColor={scrollTop !== 0 ? borderColor : "transparent"}
        transition={"200ms"}
        h={"full"}
        w={"full"}
        {...restProps}
      >
        {children}
      </VStack>
    </Box>
  );
});

export const HScrollContainer = (props: HScrollContainerProps) => {
  // Props
  const {
    children,
    showScrollButtons = false,
    enableScroll = false,
    ...restProps
  } = props;

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollVelocity = useRef(0);
  const rafId = useRef<number | null>(null);

  // States
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeft(scrollLeft > 5);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 5);
  }, []);

  const ensureRaf = (el: HTMLDivElement) => {
    if (rafId.current != null) return;
    const step = () => {
      if (!el) return;
      el.scrollLeft += scrollVelocity.current;
      scrollVelocity.current *= 0.85;

      updateScrollState();

      if (Math.abs(scrollVelocity.current) > 0.5) {
        rafId.current = requestAnimationFrame(step);
      } else {
        rafId.current = null;
      }
    };
    rafId.current = requestAnimationFrame(step);
  };

  const scroll = (direction: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (ev: WheelEvent) => {
      const canScroll = el.scrollWidth > el.clientWidth;
      if (!canScroll) return;

      const absX = Math.abs(ev.deltaX);
      const absY = Math.abs(ev.deltaY);
      const isVerticalIntent = absY > absX;

      if (!isVerticalIntent) return;

      ev.preventDefault();
      ev.stopPropagation();

      let multiplier = 1;
      if (ev.deltaMode === 1) multiplier = 16;
      else if (ev.deltaMode === 2) multiplier = window.innerHeight;

      scrollVelocity.current += ev.deltaY * 0.25 * multiplier;
      ensureRaf(el);
    };

    const onScroll = () => {
      updateScrollState();
    };

    if (enableScroll) {
      el.style.overscrollBehavior = "contain";
      el.addEventListener("wheel", onWheel, { passive: false });
    } else {
      el.style.overscrollBehavior = "";
    }

    el.addEventListener("scroll", onScroll);
    updateScrollState();

    const observer = new ResizeObserver(() => updateScrollState());
    observer.observe(el);

    return () => {
      el.removeEventListener("wheel", onWheel as EventListener);
      el.removeEventListener("scroll", onScroll);
      observer.disconnect();
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      el.style.overscrollBehavior = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableScroll, updateScrollState]);

  return (
    <Box position={"relative"} w={"full"} role={"group"}>
      {showScrollButtons && showLeft && (
        <Box
          position={"absolute"}
          left={2}
          top={"50%"}
          transform={"translateY(-50%)"}
          zIndex={2}
        >
          <IconButton
            size={"xs"}
            variant={"frosted"}
            rounded={"full"}
            onClick={() => scroll("left")}
          >
            <AppIcon icon={ChevronLeft} />
          </IconButton>
        </Box>
      )}

      {showScrollButtons && showRight && (
        <Box
          position={"absolute"}
          right={2}
          top={"50%"}
          transform={"translateY(-50%)"}
          zIndex={2}
        >
          <IconButton
            size={"xs"}
            variant={"frosted"}
            rounded={"full"}
            onClick={() => scroll("right")}
          >
            <AppIcon icon={ChevronRight} />
          </IconButton>
        </Box>
      )}

      <HStack
        ref={containerRef}
        overflowX={"auto"}
        overflowY={"hidden"}
        w={"full"}
        {...restProps}
      >
        {children}
      </HStack>
    </Box>
  );
};
