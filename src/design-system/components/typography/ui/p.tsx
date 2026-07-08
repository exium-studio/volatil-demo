// src/design-system/components/typography/ui/p.tsx

"use client";

import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Span, Text, type TextProps, type SpanProps } from "@chakra-ui/react";
import parse, { domToReact, type DOMNode } from "html-react-parser";
import { forwardRef } from "react";

export type PProps = TextProps;

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
      <P ref={ref} as={"p"} fontFamily={"Times New Roman"} {...restProps}>
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
      <Tooltip content={children}>
        <P ref={ref} lineClamp={1} {...restProps}>
          {children}
        </P>
      </Tooltip>
    );
  },
);

export type TNumProps = {
  numberFont?: boolean;
} & SpanProps;

export const TNum = forwardRef<HTMLParagraphElement, TNumProps>(
  function TNum(props, ref) {
    // Props
    const { children = "", numberFont = false, ...restProps } = props;

    // Constants
    const characters = String(children).split("");

    if (numberFont)
      return (
        <Span
          fontFamily={"number"}
          fontSize={"inherit"}
          fontVariantNumeric={"tabular-nums"}
        >
          {children}
        </Span>
      );

    return (
      <Span
        ref={ref}
        display={"inline-flex"}
        fontSize={"inherit"}
        {...restProps}
      >
        {characters.map((char, index) => (
          <Span
            key={index}
            display={"inline-block"}
            w={"0.85ch"}
            fontSize={"inherit"}
            textAlign={"center"}
          >
            {char}
          </Span>
        ))}
      </Span>
    );
  },
);
