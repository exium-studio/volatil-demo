---
name: exium-charts
description: "Guidelines and API reference for Exium Charts components and ChartTooltip."
---

# Exium Charts Components

Located in `@/design-system/components/charts/ui/`.

---

## 1. ChartTooltip (`chart-tooltip.tsx`)

Custom styled tooltip for Recharts and interactive data charts conforming to Exium dark/light theme tokens.

### Usage Example:
```tsx
import { ChartTooltip } from "@/design-system/components/charts/ui/chart-tooltip";
import { Tooltip as RechartsTooltip } from "recharts";

<RechartsTooltip content={<ChartTooltip />} />
```
