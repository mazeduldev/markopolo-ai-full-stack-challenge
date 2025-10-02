import type { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  // Center the children both vertically and horizontally
  return (
    <div className="flex min-h-screen flex-col items-center px-4 justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
