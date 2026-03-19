import {
  CarIcon,
  Settings,
  Hash,
  Users,
  Briefcase,
  Fuel,
  Palette,
  LucideIcon,
} from "lucide-react";
import Translated from "./translated";
import { Link } from "@/i18n/routing";

interface CarDetailOverviewProps {
  bodyId?: string;
  bodySlug?: string;
  makeId?: string;
  makeSlug?: string;
  bodyType?: string;
  make?: string;
  model?: string;
  gearbox?: string;
  seats?: number;
  doors?: number;
  bags?: number;
  fuelType?: string;
  color?: string;
}

export function CarDetailOverview({
  bodyType,
  bodyId,
  bodySlug,
  make,
  model,
  makeId,
  makeSlug,
  gearbox,
  seats,
  doors,
  bags,
  fuelType,
  color,
}: CarDetailOverviewProps) {
  const specs = [
    { label: "Body Type", value: bodyType || "-", icon: CarIcon, t: 'bodyType', link: bodySlug ? '/categories/' + bodySlug : '/cars?categoryId=' + bodyId },
    { label: "Transmission", value: gearbox || "-", icon: Settings, t: 'transmission' },
    { label: "Make", value: make || "-", icon: CarIcon, t: 'make', link: makeSlug ? '/brands/' + makeSlug : '/cars?brandId=' + makeId },
    { label: "Model", value: model || "-", icon: CarIcon, t: 'model' },
    { label: "Gearbox", value: gearbox || "-", icon: Settings, t: 'gearbox' },
    {
      label: "Seating Capacity",
      value: seats ? `${seats} passengers` : "-",
      icon: Users,
      t: 'seatingCapacity',
    },
    { label: "No. of Doors", value: doors || "-", icon: Hash, t: 'noDoors' },
    { label: "Luggage", value: bags ? `${bags} bags` : "-", icon: Briefcase, t: 'luggage' },
    { label: "Fuel Type", value: fuelType || "-", icon: Fuel, t: 'fuelType' },
    { label: "Color", value: color || "-", icon: Palette, t: 'color' },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">
        <Translated key="details.overview" fallback="Car Overview" withFragment />
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {specs.map((spec, index) => spec.link ? (
          <WithLink href={spec.link} key={index}>
            <Item
              label={spec.label}
              value={spec.value}
              Icon={spec.icon}
              link={true}
            />
          </WithLink>
        ) : (
          <Item
            label={spec.label}
            value={spec.value}
            Icon={spec.icon}
            link={false}
          />
        ))}
      </div>
    </div>
  );
}

const WithLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link href={href as any}>
      {children}
    </Link>
  );
};

const Item = ({ label, value, Icon, link = false }: { label: string; value: string | number; Icon: LucideIcon, link: boolean }) => {
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
        <span className="text-xs sm:text-sm text-muted-foreground truncate">
          {label}
        </span>
      </div>
      <span
        className={`text-xs sm:text-sm font-medium flex-shrink-0 ml-2 ${link ? "text-foreground" : "text-foreground"
          }`}
      >
        {value}
        {link && <span className="ml-1">›</span>}
      </span>
    </div>
  );
};