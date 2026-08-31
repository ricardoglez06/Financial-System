import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Skip navigation link for keyboard users */}
      <a
        href="#main-content"
        className="skip-link visually-hidden"
      >
        Skip to main content
      </a>

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto bg-background p-6"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
