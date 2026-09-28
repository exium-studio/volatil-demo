// src/design-system/components/focus-alert/ui/focus-alerter.tsx

import { useFocusAlerterStore } from "@/design-system/components/focus-alert/stores/focus-alert.store";
import { FocusAlertContext } from "@/design-system/components/focus-alert/ui/focus-alert-key-context";

export const FocusAlerter = () => {
  const alerts = useFocusAlerterStore((s) => s.alerts);

  return (
    <>
      {alerts.map(({ key, render }) => (
        <FocusAlertContext.Provider key={key} value={{ modalKey: key }}>
          {render()}
        </FocusAlertContext.Provider>
      ))}
    </>
  );
};
