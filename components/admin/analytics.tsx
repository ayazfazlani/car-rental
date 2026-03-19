"use client";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { AnalyticsResponse } from "@/lib/data/analytics";
import { revalidateAnalytics } from "@/lib/actions/revalidate";

export function Analytics({ analytics }: { analytics: AnalyticsResponse }) {
    const traffic = analytics?.traffic || [];
    const cities = analytics?.cities || [];
    const devices = analytics?.devices || [];
    // const sources = analytics?.sources || [];
    // const topCars = analytics?.topCars || [];

    return (
        <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-[560px]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Traffic</CardTitle>
                            <div className="text-sm text-muted-foreground">Users over time</div>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={{ users: { label: "Users", color: "#7c3aed" } }}
                            >
                                <LineChart data={traffic}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Line
                                        type="monotone"
                                        dataKey="users"
                                        stroke="var(--color-users)"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Top Cars</CardTitle>
                            <div className="text-sm text-muted-foreground">Most viewed cars</div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                {topCars.map((c) => (
                                    <TableRow key={c.carId || c.views}>
                                        <Link href={`/admin/cars/${c.carId}`}>
                                            <TableCell>{c.name || c.carId || "—"}</TableCell>
                                        </Link>
                                        <TableCell>{c.views.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </CardContent>
                    </Card> */}
                </div>

                <div className="space-y-6 h-[560px]">
                    <Card className="h-[280px] p-0">
                        <CardHeader className="m-0 p-3 px4">
                            <CardTitle className="text-xl">Top Cities</CardTitle>
                            <div className="text-sm text-muted-foreground">Users by city</div>
                        </CardHeader>
                        <CardContent className="p-0 m-0">
                            <ChartContainer config={{ cities: { label: "Cities", color: "#06b6d4" } }} style={{ height: 200 }}>
                                <BarChart data={cities}>
                                    <XAxis dataKey="city" />
                                    <YAxis />
                                    <Bar dataKey="users" fill="var(--color-cities)" />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card className="h-[280px] p-0">
                        <CardHeader className="m-0 p-3 px4">
                            <CardTitle className="text-xl">Devices</CardTitle>
                            <div className="text-sm text-muted-foreground">Users by device</div>
                        </CardHeader>
                        <CardContent className="p-0 m-0">
                            <ChartContainer config={{ devices: { label: "Devices", color: "#10b981" } }} style={{ height: 200 }}>
                                <BarChart data={devices}>
                                    <XAxis dataKey="device" />
                                    <YAxis />
                                    <Bar dataKey="users" fill="var(--color-devices)" />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* <Card>
                        <CardHeader>
                            <CardTitle>Sources</CardTitle>
                            <div className="text-sm text-muted-foreground">Traffic sources</div>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{ sources: { label: "Sources", color: "#f59e0b" } }}>
                                <BarChart data={sources}>
                                    <XAxis dataKey="source" />
                                    <YAxis />
                                    <Bar dataKey="users" fill="var(--color-sources)" />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card> */}
                </div>
            </div>
        </div>
    );
}


export const RefreshAnalytics = () => {
    const router = useRouter()
    return (
        <Button variant="outline" size="sm"
            onClick={async () => {
                await revalidateAnalytics()
                router.refresh()
            }}
        >
            Refresh
        </Button>
    )
}