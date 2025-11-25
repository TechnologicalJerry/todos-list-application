import SideNav from '@/components/layout/SideNav/SideNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SideNav />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}

