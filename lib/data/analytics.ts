import "server-only";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

type TopCarGA = {
  carId: string;
  views: number;
};

const getClient = () => {
  try {
    const creds = require("@/service-account.json");
    // Check if the service account is just a dummy
    if (!creds.private_key || creds.private_key.includes("dummy")) {
      console.warn("Using dummy service account credentials, analytics will return fallback data.");
      return null;
    }
    return new BetaAnalyticsDataClient({
      credentials: creds,
    });
  } catch (error) {
    console.warn("Analytics credentials not found, analytics will return fallback data.");
    return null;
  }
};

const property = `properties/519615072`;

async function getKpis(client: BetaAnalyticsDataClient | null) {
  if (!client) return { visitors: 0, pageViews: 0 };
  try {
    const [report] = await client.runReport({
      property,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [{ name: "activeUsers" }, { name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: "page_view" },
        },
      },
    });
    const matic = report.rows?.[0]?.metricValues || [];
    return {
      visitors: Number(matic?.[0]?.value || 0),
      pageViews: Number(matic?.[1]?.value || 0),
    };
  } catch (e) {
    console.warn("Analytics KPis failed:", e);
    return { visitors: 0, pageViews: 0 };
  }
}

async function getCarViewKpis(client: BetaAnalyticsDataClient | null) {
  if (!client) return { carViews: 0 };
  try {
    const [report] = await client.runReport({
      property,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: "view_car" },
        },
      },
    });
    const matic = report.rows?.[0]?.metricValues || [];
    return {
      carViews: Number(matic?.[0]?.value || 0),
    };
  } catch (e) {
    console.warn("Car View KPIs failed:", e);
    return { carViews: 0 };
  }
}

async function getTrafficTrend(client: BetaAnalyticsDataClient | null) {
  if (!client) return [];
  try {
    const [report] = await client.runReport({
      property,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }],
    });
    return (
      report.rows?.map((r) => {
        const rawDate = r.dimensionValues![0].value || "";
        const formattedDate = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
        return {
          date: formattedDate,
          users: Number(r.metricValues![0].value),
        };
      }) || []
    );
  } catch (e) {
    console.warn("Traffic Trend failed:", e);
    return [];
  }
}

async function getTopCities(client: BetaAnalyticsDataClient | null) {
  if (!client) return [];
  try {
    const [report] = await client.runReport({
      property,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "city" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [
        {
          metric: { metricName: "activeUsers" },
          desc: true,
        },
      ],
      limit: 10,
    });
    return (
      report.rows?.map((r) => ({
        city: r.dimensionValues![0].value,
        users: Number(r.metricValues![0].value),
      })) || []
    );
  } catch (e) {
    console.warn("Top Cities failed:", e);
    return [];
  }
}

async function getDevices(client: BetaAnalyticsDataClient | null) {
  if (!client) return [];
  try {
    const [report] = await client.runReport({
      property,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "deviceCategory" }],
      metrics: [{ name: "activeUsers" }],
    });
    return (
      report.rows?.map((r) => ({
        device: r.dimensionValues![0].value,
        users: Number(r.metricValues![0].value),
      })) || []
    );
  } catch (e) {
    console.warn("Devices failed:", e);
    return [];
  }
}

async function getSources(client: BetaAnalyticsDataClient | null) {
  if (!client) return [];
  try {
    const [report] = await client.runReport({
      property,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "activeUsers" }],
    });
    return (
      report.rows?.map((r) => ({
        source: r.dimensionValues![0].value,
        users: Number(r.metricValues![0].value),
      })) || []
    );
  } catch (e) {
    console.warn("Sources failed:", e);
    return [];
  }
}

async function getTopCars(client: BetaAnalyticsDataClient | null) {
  if (!client) return [];
  try {
    const [report] = await client.runReport({
      property,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "customEvent:car_id" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: "view_car" },
        },
      },
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 10,
    });
    return (
      report.rows?.map((r) => ({
        carId: r.dimensionValues?.[0]?.value ?? "unknown",
        views: Number(r.metricValues?.[0]?.value ?? 0),
      })) || []
    );
  } catch (e) {
    console.warn("Top Cars failed:", e);
    return [];
  }
}

async function enrichCarsWithNames(topCars: TopCarGA[]) {
  if (!topCars.length) return [];
  const carIds = topCars.map((c) => c.carId);
  const cars = await prisma.car.findMany({
    where: {
      id: { in: carIds },
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      model: true,
      brand: { select: { name: true } },
    },
  });
  const carMap = new Map(cars.map((c) => [c.id, `${c.brand.name} ${c.model}`]));
  return topCars.map((c) => ({
    carId: c.carId,
    name: carMap.get(c.carId) ?? "Unknown Car",
    views: c.views,
  }));
}

async function getTopCarsWithNames(client: BetaAnalyticsDataClient | null) {
  const topCarsFromGA = await getTopCars(client);
  return enrichCarsWithNames(topCarsFromGA);
}

export type AnalyticsResponse = {
  kpis: { visitors: number; pageViews: number };
  carViewKpis: { carViews: number };
  traffic: { date: string; users: number }[];
  cities: { city: string | null | undefined; users: number }[];
  devices: { device: string | null | undefined; users: number }[];
};

export const getAnalytics = unstable_cache(
  async (): Promise<AnalyticsResponse> => {
    console.log("Analytics refreshed");
    try {
      const client = getClient();
      const [kpis, carViewKpis, traffic, cities, devices] = await Promise.all([
        getKpis(client),
        getCarViewKpis(client),
        getTrafficTrend(client),
        getTopCities(client),
        getDevices(client),
      ]);
      return { kpis, carViewKpis, traffic, cities, devices };
    } catch (e) {
      console.warn("getAnalytics top-level failed:", e);
      return {
        kpis: { visitors: 0, pageViews: 0 },
        carViewKpis: { carViews: 0 },
        traffic: [],
        cities: [],
        devices: [],
      };
    }
  },
  ["admin-analytics"],
  {
    tags: ["admin-analytics"],
    revalidate: 3600,
  }, // 1 hour cache
);
