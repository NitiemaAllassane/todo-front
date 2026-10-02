/* eslint-disable react/no-unescaped-entities */
import { Sidebar } from "@/components/dashboard/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCurrentUserServer } from "@/lib/users";
import { capitalizeWords } from "@/lib/utils";
import { redirect } from "next/navigation";


function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

function getInitials(fullname: string) {
  return fullname
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUserServer();

  if (!user) {
    redirect('/register');
  }

  const firstName = capitalizeWords(user?.fullname);
  const initials =  getInitials(user.fullname);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center gap-4 border-b px-6 py-6">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-base">
              {initials}
            </AvatarFallback>
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