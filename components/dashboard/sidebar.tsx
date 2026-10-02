"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListTodo, FolderKanban, User, LogOut, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/lib/auth";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Tâches", href: "/tasks", icon: ListTodo },
  { label: "Catégories", href: "/categories", icon: FolderKanban },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter()

  async function handleLogout() {
    try {
      await logoutUser();
      router.push("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  }


  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold">TaskFlow</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t px-3 py-4">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <User className="h-4 w-4" />
          Profil
        </Link>
        <button 
          className="flex w-full items-center gap-3 rounded-lg px-3 
          py-2 text-sm font-medium text-destructive 
          hover:bg-destructive/10 cursor-pointer"
          onClick={() => handleLogout()}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}