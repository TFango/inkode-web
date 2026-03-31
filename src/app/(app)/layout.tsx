// app/boards/layout.tsx
import Header from "@/components/layout/header/page";

export default function BoardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header variant="app" />
      {children}
    </>
  );
}