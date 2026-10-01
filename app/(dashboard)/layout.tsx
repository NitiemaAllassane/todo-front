/* eslint-disable react/no-unescaped-entities */
import { Sidebar } from "@/components/dashboard/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// À remplacer plus tard par les vraies données du user connecté (GET /users/me)
const user = { fullname: "Nitiema Allassane" };

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const firstName = user.fullname.split(" ")[0];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center gap-4 border-b px-6 py-6">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-base">JD</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">
              {getGreeting()}, <span className="text-primary">{firstName}</span>
            </h2>
            <p className="text-sm text-muted-foreground">Qu'as-tu prévu aujourd'hui ?</p>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}