import { ChevronDown } from "lucide-react";
import { CarFeature } from "@prisma/client";
import Translated from "./translated";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
interface CarDetailFeaturesProps {
  carFeatures: CarFeature[]
}

export function CarDetailFeatures({ carFeatures }: CarDetailFeaturesProps) {

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-foreground mb-6">
        <Translated key="details.features" fallback="Features" withFragment />
      </h2>
      <div className="space-y-2">
        {carFeatures
          .map((feature) => (
            <Collapsible key={feature.id} className="border-b border-border group">
              <CollapsibleTrigger
                className="w-full flex items-center justify-between py-4 text-left"
              >
                <span className="text-sm font-medium text-foreground">
                  {feature.title}
                </span>
                <ChevronDown className="h-5 w-5 text-muted-foreground group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-wrap gap-2 pb-4">
                  {feature.tags.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary rounded-full text-sm text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
      </div>
    </div>
  );
}
