import { CheckCircle2, ListTodo, FolderKanban, Zap } from "lucide-react";

const features = [
  { icon: ListTodo, text: "Organise tes tâches par priorité et échéance" },
  { icon: FolderKanban, text: "Regroupe-les par catégorie, à ta façon" },
  { icon: Zap, text: "Reste concentré sur ce qui compte vraiment" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/10">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">TaskFlow</span>
        </div>

        <div className="space-y-8">
          <h1 className="text-3xl font-bold leading-tight">
            Organise tes journées, atteins tes objectifs.
          </h1>
          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature.text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <feature.icon className="h-4 w-4" />
                </div>
                <p className="text-sm text-primary-foreground/90">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-primary-foreground/60">
          © 2026 TaskFlow. Fait avec soin.
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}