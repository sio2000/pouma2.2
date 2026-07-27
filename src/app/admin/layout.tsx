import type { Metadata } from "next";
import "./admin-theme.css";

export const metadata: Metadata = {
  title: "Πίνακας Διαχείρισης | The Pouma Academy",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="admin-theme min-h-screen bg-ivory text-plum"
      style={{ fontFamily: "Outfit, system-ui, sans-serif" }}
    >
      {children}
    </div>
  );
}
