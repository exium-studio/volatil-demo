// src/features/design-system-docs/components/component-playground.tsx

// src\features\design-system-docs\components\component-playground.tsx

// src\features\design-system-docs\components\component-playground.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Input } from "@/design-system/components/input/ui/input";
import { NumberInput } from "@/design-system/components/input/ui/number-input";
import SelectInput from "@/design-system/components/input/ui/select";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { ComponentPlaygroundContainer } from "@/features/design-system-docs/components/component-playground-container";
import type { ComponentDocSpec } from "@/features/design-system-docs/types/ds-docs-spec.type";
import { ColorPaletteSelect } from "@/features/shared/components/color-palette.select";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

export const ComponentPlayground = ({ spec }: { spec: ComponentDocSpec }) => {
  // States
  const [propsState, setPropsState] = useState<Record<string, unknown>>(
    spec.defaultProps,
  );
  const [copied, setCopied] = useState(false);

  // Handlers
  const handlePropChange = (name: string, value: unknown) => {
    setPropsState((prev) => ({ ...prev, [name]: value }));
  };

  const ComponentToRender = spec.component;

  const generateCodeSnippet = () => {
    const propStrings = Object.entries(propsState)
      .filter(([key, val]) => {
        if (key === "children") return false;
        if (val === undefined || val === null || val === false) return false;
        return true;
      })
      .map(([key, val]) => {
        if (typeof val === "boolean" && val === true) return key;
        if (typeof val === "string") return `${key}="${val}"`;
        return `${key}={${JSON.stringify(val)}}`;
      })
      .join(" ");

    const componentName = spec.title.split(" ")[0];
    const propsPrefix = propStrings ? ` ${propStrings}` : "";
    const childrenVal = propsState.children;

    if (
      childrenVal !== undefined &&
      childrenVal !== null &&
      childrenVal !== ""
    ) {
      return `<${componentName}${propsPrefix}>\n  ${String(childrenVal)}\n</${componentName}>`;
    }

    return `<${componentName}${propsPrefix} />`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(
      `${spec.importPath}\n\n${generateCodeSnippet()}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <VStack align={"stretch"} gap={6} w={"full"}>
      {/* Overview Header */}
      <VStack align={"start"} gap={2}>
        <HStack gap={2}>
          <P fontSize={"2xl"} fontWeight={"bold"}>
            {spec.title}
          </P>
          <Badge variant={"subtle"}>{spec.category}</Badge>
        </HStack>
        <P color={"fg.muted"}>{spec.description}</P>
      </VStack>

      {/* Import Path Card */}
      <Box
        p={3}
        rounded={"md"}
        bg={"bg.subtle"}
        border={"1px solid"}
        borderColor={"border.subtle"}
      >
        <P fontSize={"xs"} color={"fg.subtle"} mb={1}>
          IMPORT PATH
        </P>
        <P fontFamily={"mono"} fontSize={"sm"} color={"colorPalette.fg"}>
          {spec.importPath}
        </P>
      </Box>

      {/* Interactive Playground Sandbox */}
      <ComponentPlaygroundContainer>
        {spec.renderPlayground ? (
          spec.renderPlayground(propsState, handlePropChange)
        ) : (
          <ComponentToRender {...propsState} />
        )}
      </ComponentPlaygroundContainer>

      {/* Controls & Props Spec Tabs */}
      <Tabs.Root defaultValue={"controls"} variant={"outline"}>
        <Tabs.List>
          <Tabs.Trigger value={"controls"}>Playground Knobs</Tabs.Trigger>
          <Tabs.Trigger value={"code"}>Generated Code</Tabs.Trigger>
          <Tabs.Trigger value={"props"}>Props Specs</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value={"controls"} pt={4}>
          <SimpleGrid columns={[1, 2, 3]} gap={4}>
            {spec.propsSpec
              .filter((prop) => prop.controlKind !== undefined)
              .map((prop) => (
                <Box key={prop.name} p={3} rounded={"md"} bg={"bg.subtle"}>
                  <P fontSize={"xs"} fontWeight={"bold"} mb={2}>
                    {prop.name}
                  </P>

                  {prop.controlKind === "text" && (
                    <Input
                      size={"sm"}
                      value={(propsState[prop.name] as string) ?? ""}
                      onChange={(e) =>
                        handlePropChange(prop.name, e.target.value)
                      }
                    />
                  )}

                  {prop.controlKind === "number" && (
                    <NumberInput
                      size={"sm"}
                      min={prop.name === "page" ? 1 : undefined}
                      value={String(propsState[prop.name] ?? 0)}
                      onValueChange={(details) =>
                        handlePropChange(
                          prop.name,
                          prop.name === "page"
                            ? Math.max(1, Number(details.value) || 1)
                            : Number(details.value) || 0,
                        )
                      }
                    />
                  )}

                  {prop.controlKind === "boolean" && (
                    <Switch
                      checked={(propsState[prop.name] as boolean) ?? false}
                      onCheckedChange={(e) =>
                        handlePropChange(prop.name, e.checked)
                      }
                    >
                      <P fontSize={"xs"}>
                        {propsState[prop.name] ? "True" : "False"}
                      </P>
                    </Switch>
                  )}

                  {prop.name === "colorPalette" ? (
                    <ColorPaletteSelect
                      value={String(propsState[prop.name] ?? "")}
                      onValueChange={(val) =>
                        handlePropChange(prop.name, String(val ?? ""))
                      }
                      size={"sm"}
                      selectMode={"default"}
                    />
                  ) : prop.controlKind === "select" && prop.options ? (
                    <SelectInput
                      size={"sm"}
                      placeholder={`Pilih ${prop.name}`}
                      value={String(propsState[prop.name] ?? "")}
                      options={prop.options.map((opt) => ({
                        label: String(opt),
                        value: String(opt),
                      }))}
                      onValueChange={(val) =>
                        handlePropChange(prop.name, String(val ?? ""))
                      }
                    />
                  ) : null}
                </Box>
              ))}
          </SimpleGrid>
        </Tabs.Content>

        <Tabs.Content value={"code"} pt={4}>
          <Box pos={"relative"} p={4} rounded={"md"} bg={"bg.muted"}>
            <Button
              size={"xs"}
              variant={"ghost"}
              pos={"absolute"}
              top={2}
              right={2}
              onClick={handleCopyCode}
            >
              {copied ? (
                <AppIcon icon={CheckIcon} size={"sm"} />
              ) : (
                <AppIcon icon={CopyIcon} size={"sm"} />
              )}
              {copied ? "Copied!" : "Copy Code"}
            </Button>
            <pre
              style={{ margin: 0, fontFamily: "monospace", fontSize: "13px" }}
            >
              {spec.importPath}
              {"\n\n"}
              {generateCodeSnippet()}
            </pre>
          </Box>
        </Tabs.Content>

        <Tabs.Content value={"props"} pt={4}>
          <Box overflowX={"auto"}>
            <table
              style={{
                width: "100%",
                textAlign: "left",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom:
                      "1px solid var(--chakra-colors-border-subtle)",
                  }}
                >
                  <th style={{ padding: "8px" }}>Prop</th>
                  <th style={{ padding: "8px" }}>Type</th>
                  <th style={{ padding: "8px" }}>Required</th>
                  <th style={{ padding: "8px" }}>Default</th>
                  <th style={{ padding: "8px" }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {spec.propsSpec.map((p) => {
                  const isRequired =
                    p.required ??
                    (p.description.toLowerCase().includes("(wajib)") ||
                      p.description.toLowerCase().includes("wajib"));

                  return (
                    <tr
                      key={p.name}
                      style={{
                        borderBottom:
                          "1px solid var(--chakra-colors-border-subtle)",
                      }}
                    >
                      <td style={{ padding: "8px", fontWeight: "bold" }}>
                        {p.name}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          fontFamily: "monospace",
                          color: "#3182ce",
                        }}
                      >
                        {p.type}
                      </td>
                      <td style={{ padding: "8px" }}>
                        {isRequired ? (
                          <Badge colorPalette={"red"} size={"xs"}>
                            Required
                          </Badge>
                        ) : (
                          <Badge colorPalette={"gray"} variant={"subtle"} size={"xs"}>
                            Optional
                          </Badge>
                        )}
                      </td>
                      <td style={{ padding: "8px" }}>
                        {p.defaultValue !== undefined
                          ? String(p.defaultValue)
                          : "-"}
                      </td>
                      <td style={{ padding: "8px" }}>{p.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </VStack>
  );
};
