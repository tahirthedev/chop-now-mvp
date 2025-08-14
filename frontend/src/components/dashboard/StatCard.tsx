import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
  icon?: ReactNode;
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "orange" | "amber";
}

export default function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  color = "orange",
}: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    amber: "bg-amber-500",
  };

  const changeClasses = {
    increase: "text-green-600",
    decrease: "text-red-600",
    neutral: "text-amber-600",
  };

  return (
    <Card className="border-orange-200 hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-orange-700">
          {title}
        </CardTitle>
        {icon && (
          <div className={`${colorClasses[color]} p-2 rounded-lg`}>
            <div className="text-white">{icon}</div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-orange-800 mb-1">{value}</div>
        {change && (
          <Badge
            variant="secondary"
            className={`text-xs ${changeClasses[changeType]} bg-orange-50`}
          >
            {changeType === "increase" && "+"}
            {changeType === "decrease" && "-"}
            {change}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
