// src/design-system/components/typography/ui/p.tsx

import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Span, Text } from "@chakra-ui/react";
import parse, { domToReact, type DOMNode } from "html-react-parser";
import { forwardRef } from "react";
import type {
  PProps,
  TNumProps,
} from "@/design-system/components/typography/types/p.type";
import { useThemeStore } from "@/design-system/stores/theme-store";

export const P = forwardRef<HTMLParagraphElement, PProps>(
  function P(props, ref) {
    // Props
    const { children = "", ...restProps } = props;

    return (
      <Text
        ref={ref}
        as={"p"}
        wordBreak={"break-word"}
        fontFamily={"inherit"}
        fontWeight={"normal"}
        {...restProps}
      >
        {typeof children === "string"
          ? parse(children, {
              replace: (domNode) => {
                if (
                  domNode.type === "tag" &&
                  domNode.name === "b" &&
                  domNode.children.length
                ) {
                  return (
                    <b style={{ fontWeight: 700 }}>
                      {domToReact(domNode.children as DOMNode[])}
                    </b>
                  );
                }
              },
            })
          : children}
      </Text>
    );
  },
);

export const PSerif = forwardRef<HTMLParagraphElement, PProps>(
  function PSerif(props, ref) {
    // Props
    const { children = "", ...restProps } = props;

    return (
      <P
        ref={ref}
        as={"p"}
        fontFamily={"'Sorts Mill Goudy', serif"}
        {...restProps}
      >
        {children}
      </P>
    );
  },
);

export const PLink = forwardRef<HTMLParagraphElement, PProps>(
  function PLink(props, ref) {
    // Props
    const { children = "", ...restProps } = props;

    // Stores
    const { theme } = useThemeStore();

    return (
      <P
        ref={ref}
        color={`${theme.colorPalette}.fg`}
        cursor={"pointer"}
        borderBottom={"1px solid"}
        borderColor={"transparent"}
        _hover={{ borderColor: `${theme.colorPalette}.fg` }}
        {...restProps}
      >
        {children}
      </P>
    );
  },
);

export const ClampedP = forwardRef<HTMLParagraphElement, PProps>(
  function ClampedP(props, ref) {
    // Props
    const { children, ...restProps } = props;

    return (
      <Tooltip content={children} w={restProps.w ?? restProps.width}>
        <P ref={ref} lineClamp={1} {...restProps}>
          {children}
        </P>
      </Tooltip>
    );
  },
);

export const TNum = forwardRef<HTMLSpanElement, TNumProps>(
  function TNum(props, ref) {
    // Props
    const { children = "", numberFont = true, ...restProps } = props;

    // Constants
    const characters = String(children).split("");

    if (numberFont)
      return (
        <Span
          ref={ref}
          fontFamily={"number"}
          fontSize={"inherit"}
          fontWeight={"inherit"}
          fontVariantNumeric={"tabular-nums"}
          {...restProps}
        >
          {children}
        </Span>
      );

    return (
      <Span
        ref={ref}
        display={"inline-flex"}
        fontSize={"inherit"}
        fontWeight={"inherit"}
        color={"inherit"}
        {...restProps}
      >
        {characters.map((char, index) => {
          const isSeparator = char === "." || char === ",";
          const isSpace = char === " ";
          const isDigit = /^[0-9]$/.test(char);
          const width = isSeparator
            ? "0.35ch"
            : isSpace
              ? "0.35ch"
              : isDigit
                ? "0.875ch"
                : "auto";

          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                width,
                textAlign: "center",
                fontWeight: "inherit",
                fontSize: "inherit",
                color: "inherit",
              }}
            >
              {char}
            </span>
          );
        })}
      </Span>
    );
  },
);
