// src/features/auth/pages/mitra.signin.page.tsx

import { SigninShell } from "@/features/auth/components/ui/signin-shell";
import { MitraSignin } from "@/features/auth/components/ui/signin.form";

export const MitraSigninPage = () => {
  return (
    <SigninShell portalType={"mitra"}>
      <MitraSignin px={[0, null, 8]} mt={8} />
    </SigninShell>
  );
};
