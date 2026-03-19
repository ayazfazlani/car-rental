import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Users, Tag, Layers } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAnalytics } from "@/lib/data/analytics";
import { Eye, Activity } from "lucide-react";
import { Analytics, RefreshAnalytics } from "@/components/admin/analytics";

export default async function AdminDashboard() {
  const [
    totalCars,
    totalBrands,
    totalCategories,
    analytics,
  ] = await Promise.all([
    prisma.car.count({ where: { deletedAt: null, status: { not: "DELETED" } } }),
    prisma.carBrand.count({ where: { deletedAt: null } }),
    prisma.carCategory.count({ where: { deletedAt: null } }),
    getAnalytics()
  ]);

  const trafficStats = analytics.kpis
  const carViewStats = analytics.carViewKpis

  const statCards = [
    {
      title: "Total Cars",
      value: totalCars,
      icon: Car,
      description: "Active Vehicles",
    },
    {
      title: "Brands",
      value: totalBrands,
      icon: Tag,
    },
    {
      title: "Categories",
      value: totalCategories,
      icon: Layers,
    },
    {
      title: "Visitors (30d)",
      value: trafficStats.visitors,
      icon: Users,
      description: "Unique visitors",
    },
    {
      title: "Page Views (30d)",
      value: trafficStats.pageViews,
      icon: Activity,
      description: "Total page views",
    },
    {
      title: "Car Views (30d)",
      value: carViewStats.carViews,
      icon: Eye,
      description: "Listing views",
    },
  ]

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">
          Dashboard
        </h1>
        <RefreshAnalytics />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.value}
                </div>
                {stat.description ? (
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Analytics analytics={analytics} />
    </div>
  );
}
