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
    Dna,
    BaggageClaim,
    Banana,
    Accessibility,
    Axe,
    Beef,
    Anchor,
    Amphora,
    Atom,
    Anvil,
    AppWindow,
    BicepsFlexed,
    Beer,
    Bus,
    Cat,
    Code,
    Egg,
    CreditCard,
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
    "Dna": Dna,
    "BaggageClaim": BaggageClaim,
    "Banana": Banana,
    "Accessibility": Accessibility,
    "Axe": Axe,
    "Beef": Beef,
    "Anchor": Anchor,
    "Amphora": Amphora,
    "Atom": Atom,
    "Anvil": Anvil,
    "AppWindow": AppWindow,
    "BicepsFlexed": BicepsFlexed,
    "Beer": Beer,
    "Bus": Bus,
    "Cat": Cat,
    "Code": Code,
    "Egg": Egg,
    "CreditCard": CreditCard,
  };

  export function getComponentFromString(componentName: string): React.ElementType | null {
    const Component = iconMap[componentName];
    if (!Component) {
      console.error(`Icon component "${componentName}" not found.`);
      return null;
    }
    return Component;
  }