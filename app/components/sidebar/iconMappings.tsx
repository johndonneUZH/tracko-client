import {
    University,
    Settings2,
    Apple,
    Brain,
    LayoutDashboard,
    FileClock,
    Users,
    Calendar,
    Archive,
    Bell,
  } from "lucide-react";
  
  export const iconMap: Record<string, React.ElementType> = {
    "University": University,
    "Settings2": Settings2,
    "Apple": Apple,
    "Brain": Brain,
    "LayoutDashboard": LayoutDashboard,
    "FileClock": FileClock,
    "Users": Users,
    "Calendar": Calendar,
    "Archive": Archive,
    "Bell": Bell,
  };

  export function getComponentFromString(componentName: string): React.ElementType | null {
    const Component = iconMap[componentName];
    if (!Component) {
      console.error(`Icon component "${componentName}" not found.`);
      return null;
    }
    return Component;
  }