// src/design-system/components/disclosure/ui/breadcrumb.tsx

"use client";

import { forwardRef } from "react";
import { Breadcrumb as ChakraBreadcrumb } from "@chakra-ui/react";
import type {
  BreadcrumbRootProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbCurrentLinkProps,
  BreadcrumbSeparatorProps,
  BreadcrumbEllipsisProps,
} from "@/design-system/components/disclosure/type/breadcrumb.type";

const BreadcrumbRoot = forwardRef<HTMLDivElement, BreadcrumbRootProps>(
  (props, ref) => {
    return <ChakraBreadcrumb.Root ref={ref} {...props} />;
  }
);

const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(
  (props, ref) => {
    return <ChakraBreadcrumb.List ref={ref} {...props} />;
  }
);

const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  (props, ref) => {
    return <ChakraBreadcrumb.Item ref={ref} {...props} />;
  }
);

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  (props, ref) => {
    return <ChakraBreadcrumb.Link ref={ref} {...props} />;
  }
);

const BreadcrumbCurrentLink = forwardRef<HTMLSpanElement, BreadcrumbCurrentLinkProps>(
  (props, ref) => {
    return <ChakraBreadcrumb.CurrentLink ref={ref} {...props} />;
  }
);

const BreadcrumbSeparator = forwardRef<HTMLSpanElement, BreadcrumbSeparatorProps>(
  (props, ref) => {
    return <ChakraBreadcrumb.Separator ref={ref} {...props} />;
  }
);

const BreadcrumbEllipsis = forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(
  (props, ref) => {
    return <ChakraBreadcrumb.Ellipsis ref={ref} {...props} />;
  }
);

export const Breadcrumb = {
  Root: BreadcrumbRoot,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  CurrentLink: BreadcrumbCurrentLink,
  Separator: BreadcrumbSeparator,
  Ellipsis: BreadcrumbEllipsis,
};
