import { Calendar, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const scheduleItems = [
  { time: "09:00", title: "Réunion d'équipe", tag: "réunion" },
  { time: "11:30", title: "Revue de design", tag: "révision" },
  { time: "14:00", title: "Appel client", tag: "appel" },
  { time: "16:30", title: "Planification projet", tag: "planification" },
];

export function SchedulePanel() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold">
          <Calendar className="h-4 w-4" />
          Planning du jour
        </h3>
        <Button variant="ghost" size="sm">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      <div className="space-y-4">
        {scheduleItems.map((item) => (
          <div key={item.time} className="flex gap-3 text-sm">
            <span className="w-12 shrink-0 text-muted-foreground">{item.time}</span>
            <div className="space-y-1">
              <p className="font-medium">{item.title}</p>
              <Badge variant="outline" className="text-xs">
                {item.tag}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}