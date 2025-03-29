import {
    BellIcon,
    CalendarIcon,
    FileTextIcon,
    PersonIcon,
    MagicWandIcon,
  } from "@radix-ui/react-icons";
   
  import { BentoCard, BentoGrid } from "../magicui/bento-grid";
   
  const features = [
    {
      Icon: FileTextIcon,
      name: "Brainstorming",
      description: "Discuss about project ideas in a team, vote on the ideas to ensure alignment and organize your project implementation optimally.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: MagicWandIcon,
      name: "AI Integration",
      description: "Generate new ideas with the assistance of AI.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: PersonIcon,
      name: "Collaboration",
      description: "Changes to the dashboard are synchronized in real-time for all users to see.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: CalendarIcon,
      name: "Calendar",
      description: "Use the calendar to keep track of deadlines and meetings.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: BellIcon,
      name: "Notifications",
      description:
        "Get notified when someone shares a project or mentions you in a comment.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
  ];
   
  export function Functions() {
    return (
      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    );
  }