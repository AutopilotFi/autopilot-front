import ClientDashboardPage from './ClientDashboardPage';

type RouteParams = { network: string; project: string; coin: string };

export default async function DashboardPage({ params }: { params: Promise<RouteParams> }) {
  const resolved = await params; // unwrap the promise

  return <ClientDashboardPage params={resolved} />;
}
