import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "primary";
}

export default function StatsCard({ title, value, icon: Icon, variant = "default" }: StatsCardProps) {
  return (
    <Card className={variant === "primary" ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white border-0" : ""}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${variant === "primary" ? "text-white/80" : "text-muted-foreground"}`}>
              {title}
            </p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${variant === "primary" ? "text-white/80" : "text-muted-foreground"}`} />
        </div>
      </CardContent>
    </Card>
  );
}
