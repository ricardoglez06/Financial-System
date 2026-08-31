import { Moon, Sun, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { isDark, toggle } = useThemeStore();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div>
        <h1 className="text-lg font-semibold">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="sr-only">
            {isDark ? "Switch to light mode" : "Switch to dark mode"}
          </span>
        </Button>

        <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5">
          <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm">{user?.email}</span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => logout()}
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Log out</span>
        </Button>
      </div>
    </header>
  );
}
