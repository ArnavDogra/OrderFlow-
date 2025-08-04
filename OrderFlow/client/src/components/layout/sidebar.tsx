import { Link, useLocation } from "wouter";
import { LayoutDashboard, Plus, List, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Create Order",
    href: "/create",
    icon: Plus,
  },
  {
    name: "All Orders", 
    href: "/orders",
    icon: List,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-purple-700 text-white">
      <div className="p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
