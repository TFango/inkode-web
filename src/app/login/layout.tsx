// app/login/layout.tsx
import Header from "@/components/layout/header/page";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header variant="login" />
      {children}
    </>
  );
}
