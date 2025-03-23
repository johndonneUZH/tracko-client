import ClientWrapper from "./clientWrapper";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientWrapper>{children}</ClientWrapper>;
}
