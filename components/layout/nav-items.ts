import { Boxes, LayoutDashboard, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** When true, only highlight on an exact path match (used for the home route). */
  exact?: boolean;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/registry", label: "Registry", icon: Boxes },
];
