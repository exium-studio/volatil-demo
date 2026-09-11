// src/features/design-system-docs/components/component-playground.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Input } from "@/design-system/components/input/ui/input";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import type { ComponentDocSpec } from "@/features/design-system-docs/types/ds-docs-spec.type";
import { CopyIcon, CheckIcon } from "lucide-react";
import { useState } from "react";

export const ComponentPlayground = ({ spec }: { spec: ComponentDocSpec }) => {
  const [propsState, setPropsState] = useState<Record<string, unknown>>(
    spec.defaultProps,
  );
  const [copied, setCopied] = useState(false);

  const handlePropChange = (name: string, value: unknown) => {
    setPropsState((prev) => ({ ...prev, [name]: value }));
  };

  const ComponentToRender = spec.component;

  const generateCodeSnippet = () => {
    const propStrings = Object.entries(propsState)
      .filter(([_, val]) => val !== undefined && val !== false)
      .map(([key, val]) => {
        if (key === "children") return null;
        if (typeof val === "boolean" && val === true) return key;
        if (typeof val === "string") return `${key}="${val}"`;
        return `${key}={${JSON.stringify(val)}}`;
      })
      .filter(Boolean)
      .join(" ");

    const childrenVal = propsState.children;
    if (childrenVal && typeof childrenVal === "string") {
      return `<${spec.title.split(" ")[0]} ${propStrings}>\n  ${childrenVal}\n</${spec.title.split(" ")[0]}>`;
    }

    return `<${spec.title.split(" ")[0]} ${propStrings} />`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`${spec.importPath}\n\n${generateCodeSnippet()}`);
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
          <Badge variant={"subtle"} colorPalette={"blue"}>
            {spec.category}
          </Badge>
        </HStack>
        <P color={"fg.muted"}>{spec.description}</P>
      </VStack>

      {/* Import Path Card */}
      <Box p={3} rounded={"md"} bg={"bg.subtle"} border={"1px solid"} borderColor={"border.subtle"}>
        <P fontSize={"xs"} color={"fg.subtle"} mb={1}>
          IMPORT PATH
        </P>
        <P fontFamily={"mono"} fontSize={"sm"} color={"colorPalette.fg"}>
          {spec.importPath}
        </P>
      </Box>

      {/* Interactive Playground Sandbox */}
      <Box
        p={6}
        rounded={"lg"}
        border={"1px solid"}
        borderColor={"border.subtle"}
        bg={"bg.canvas"}
        minH={"220px"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        {spec.renderPlayground
          ? spec.renderPlayground(propsState)
          : <ComponentToRender {...propsState} />}
      </Box>

      {/* Controls & Props Spec Tabs */}
      <Tabs.Root defaultValue={"controls"} variant={"outline"}>
        <Tabs.List>
          <Tabs.Trigger value={"controls"}>Playground Knobs</Tabs.Trigger>
          <Tabs.Trigger value={"code"}>Generated Code</Tabs.Trigger>
          <Tabs.Trigger value={"props"}>Props Specs</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value={"controls"} pt={4}>
          <SimpleGrid columns={[1, 2, 3]} gap={4}>
            {spec.propsSpec.map((prop) => (
              <Box key={prop.name} p={3} rounded={"md"} bg={"bg.subtle"}>
                <P fontSize={"xs"} fontWeight={"bold"} mb={1}>
                  {prop.name}
                </P>

                {prop.controlKind === "text" && (
                  <Input
                    size={"sm"}
                    value={(propsState[prop.name] as string) ?? ""}
                    onChange={(e) => handlePropChange(prop.name, e.target.value)}
                  />
                )}

                {prop.controlKind === "number" && (
                  <Input
                    type={"number"}
                    size={"sm"}
                    value={(propsState[prop.name] as number) ?? 0}
                    onChange={(e) => handlePropChange(prop.name, Number(e.target.value))}
                  />
                )}

                {prop.controlKind === "boolean" && (
                  <Switch
                    checked={(propsState[prop.name] as boolean) ?? false}
                    onCheckedChange={(e) => handlePropChange(prop.name, e.checked)}
                  >
                    <P fontSize={"xs"}>{propsState[prop.name] ? "True" : "False"}</P>
                  </Switch>
                )}

                {prop.controlKind === "select" && prop.options && (
                  <select
                    style={{
                      width: "100%",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      border: "1px solid var(--chakra-colors-border-subtle)",
                      background: "var(--chakra-colors-bg-panel)",
                      color: "var(--chakra-colors-fg-default)",
                    }}
                    value={(propsState[prop.name] as string) ?? ""}
                    onChange={(e) => handlePropChange(prop.name, e.target.value)}
                  >
                    {prop.options.map((opt) => (
                      <option key={String(opt)} value={String(opt)}>
                        {String(opt)}
                      </option>
                    ))}
                  </select>
                )}
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
              {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
              {copied ? "Copied!" : "Copy Code"}
            </Button>
            <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "13px" }}>
              {spec.importPath}
              {"\n\n"}
              {generateCodeSnippet()}
            </pre>
          </Box>
        </Tabs.Content>

        <Tabs.Content value={"props"} pt={4}>
          <Box overflowX={"auto"}>
            <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--chakra-colors-border-subtle)" }}>
                  <th style={{ padding: "8px" }}>Prop</th>
                  <th style={{ padding: "8px" }}>Type</th>
                  <th style={{ padding: "8px" }}>Default</th>
                  <th style={{ padding: "8px" }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {spec.propsSpec.map((p) => (
                  <tr key={p.name} style={{ borderBottom: "1px solid var(--chakra-colors-border-subtle)" }}>
                    <td style={{ padding: "8px", fontWeight: "bold" }}>{p.name}</td>
                    <td style={{ padding: "8px", fontFamily: "monospace", color: "#3182ce" }}>{p.type}</td>
                    <td style={{ padding: "8px" }}>{String(p.defaultValue ?? "-")}</td>
                    <td style={{ padding: "8px" }}>{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </VStack>
  );
};
