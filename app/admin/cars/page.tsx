"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, } from "lucide-react";
import Link from "next/link";
import { authenticatedFetch } from "@/lib/admin-api";
import { useCurrency } from "@/lib/contexts/CurrencyContext";
import { useAdminTranslation } from "@/lib/admin-translations";
import { API } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { PaginationResult, querify } from "@/lib/utils";
import { Pagination } from "@/components/pagination";
import { Input } from "@/components/ui/input";

interface Car {
  id: string;
  brand: { name: string };
  category: { name: string };
  model: string;
  year: number;
  baseDailyPrice: number;
  status: string;
  images: Array<{ url: string; isPrimary: boolean }>;
}

export default function AdminCars() {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const { t } = useAdminTranslation();
  const [query, setQuery] = useQueryStates({
    search: parseAsString,
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  });

  const { data, isLoading: loading, refetch: fetchCars } = useQuery<{ cars: Car[], pagination: PaginationResult }>({
    queryKey: ["admin-cars", query],
    queryFn: () => API.queryGet({ url: "/api/admin/cars" + querify(query), auth: true }),
  });
  const cars = data?.cars || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 };

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.areYouSureDeleteCar"))) return;

    try {
      const res = await authenticatedFetch(
        `/api/admin/cars/${id}`,
        { method: "DELETE" },
        router
      );

      if (res.ok) {
        fetchCars();
      }
    } catch (error) {
      console.error("Failed to delete car:", error);
    }
  };

  const getPrimaryImage = (car: Car) => {
    const primaryImage = car.images?.find((img) => img.isPrimary);
    return primaryImage?.url || car.images?.[0]?.url || null;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("admin.cars")}</h1>
        <div className="flex gap-2">
          <Input
            placeholder={t("search.search")}
            value={query.search || ""}
            onChange={(e) => setQuery({ search: e.target.value })}
          />
          <Button asChild>
            <Link href="/admin/cars/new">
              <Plus className="h-4 w-4 mr-2" />
              {t("admin.addCar")}
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <div>{t("admin.loading")}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {cars.map((car) => (
            <Card key={car.id}>
              <div className="relative h-48 w-full">
                {getPrimaryImage(car) ? (
                  <img
                    src={getPrimaryImage(car)!}
                    alt={car.model}
                    className="w-full h-full object-cover rounded-t-lg"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}
                {!getPrimaryImage(car) && (
                  <div className="w-full h-full bg-muted flex items-center justify-center rounded-t-lg">
                    <span className="text-muted-foreground text-sm">
                      {t("admin.noImage")}
                    </span>
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{car.model}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {car.brand.name} • {car.year}
                    </p>
                  </div>
                  <Badge
                    variant={car.status === "ACTIVE" ? "default" : "secondary"}>
                    {car.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold mb-4">
                  {formatPrice(Number(car.baseDailyPrice)).value}/
                  {t("admin.day")}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/cars/edit/${car.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      {t("admin.edit")}
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(car.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {pagination.total > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            page={pagination.page}
            limit={pagination.limit}
            total={pagination.total}
            totalPages={pagination.totalPages}
            onPageChange={(page) => {
              setQuery({ page });
            }}
            onLimitChange={(limit) => {
              setQuery({ limit });
            }}
          />
        </div>
      )}
    </div>
  );
}
