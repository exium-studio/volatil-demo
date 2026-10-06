import { SigninShell } from "@/features/auth/components/ui/signin-shell";
import { InternalSignin } from "@/features/auth/components/ui/signin.form";

export const InternalSigninPage = () => {
  return (
    <SigninShell portalType={"internal"}>
      <InternalSignin px={[0, null, 8]} mt={8} />
    </SigninShell>
  );
};
