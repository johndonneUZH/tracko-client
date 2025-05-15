import {
    FileTextIcon,
    PersonIcon,
    MagicWandIcon,
    ArchiveIcon,
    SymbolIcon
  } from "@radix-ui/react-icons";
   
  import { BentoCard, BentoGrid } from "./bento-grid";
   
  const features = [
    {
      Icon: FileTextIcon,
      name: "Brainstorming",
      description: "Discuss about project ideas in a team, vote on the ideas to ensure alignment and organize your project implementation optimally.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute top-5 opacity-60" src="Dashboard.png" />,
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: PersonIcon,
      name: "Friends",
      description: "Invite and connect with friends via common projects.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute top-5 opacity-60 h-70 right-10" src="FriendsDialog.png" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: SymbolIcon,
      name: "Collaboration",
      description: "Changes to the dashboard are synchronized in real-time for all users to see.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute h-30 right-2 top-2 opacity-60" src="Realtime.png" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: MagicWandIcon,
      name: "AI Integration",
      description: "Generate new ideas and create reports of the dashboard with AI.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute top-5 h-30 right-5 opacity-60" src="AIDialog.png" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: ArchiveIcon,
      name: "Projects",
      description:
        "Manage multiple projects all in one application.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute top-5 right-10 opacity-60 h-60" src="TeamSwitcher.png"/>,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
  ];
   
  export function Functions() {
    return (
      <BentoGrid className="sm:grid-rows-1 md:grid-rows-2 lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    );
  }