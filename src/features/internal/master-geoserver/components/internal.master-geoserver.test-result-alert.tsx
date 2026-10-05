// src/features/internal/master-geoserver/components/internal.master-geoserver.test-result-alert.tsx

import { Alert } from "@/design-system/components/feedback/ui/alert";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import type { InternalMasterGeoserverTestResultAlertProps } from "@/features/internal/master-geoserver/types/master-geoserver.type";
import { memo } from "react";

export const InternalMasterGeoserverTestResultAlert = memo(
  (props: InternalMasterGeoserverTestResultAlertProps) => {
    // Props
    const { testResult, testError } = props;

    if (!testResult && !testError) return null;

    return (
      <VStack align={"stretch"} gap={"xs"} w={"full"}>
        {testResult && (
          <Alert.Root status={"success"} variant={"subtle"} size={"sm"}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{testResult.message}</Alert.Title>

              {(testResult.version ||
                typeof testResult.latencyMs === "number" ||
                typeof testResult.workspacesCount === "number") && (
                <Alert.Description>
                  <VStack align={"start"} gap={"2xs"} w={"full"} mt={"2xs"}>
                    {testResult.version && <P>{`• ${testResult.version}`}</P>}

                    {typeof testResult.latencyMs === "number" && (
                      <P>
                        {"• "}
                        <TNum>{`${testResult.latencyMs} ms`}</TNum>
                      </P>
                    )}

                    {typeof testResult.workspacesCount === "number" && (
                      <P>
                        {"• "}
                        <TNum>{`${testResult.workspacesCount} workspace`}</TNum>
                      </P>
                    )}
                  </VStack>
                </Alert.Description>
              )}
            </Alert.Content>
          </Alert.Root>
        )}

        {testError && (
          <Alert.Root status={"error"} variant={"subtle"} size={"sm"}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description fontSize={"xs"}>{testError}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}
      </VStack>
    );
  },
);
