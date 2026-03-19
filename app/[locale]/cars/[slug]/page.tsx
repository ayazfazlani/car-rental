import { getCarDetails } from "@/lib/data/cars";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import CarSchema from "@/components/seo/CarSchema";
import { CarDetailGallery } from "@/components/car-detail-gallery";
import { CarDetailPricing } from "@/components/car-detail-pricing";
import { CarDetailOverview } from "@/components/car-detail-overview";
import { CarDetailRentalTerms } from "@/components/car-detail-rental-terms";
import {
  ChevronRight,
  Calendar,
  Settings,
  ChevronDown,
  Dot,
  Phone,
  Home,
  Globe
} from "lucide-react";
import { CarFilterdSection } from "@/components/listing/cars-filtered-section";
import Translated from "@/components/translated";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CarDetailFeatures } from "@/components/car-detail-features";
import { Button } from "@/components/ui/button";
import TrackViewCar from "@/components/tracking/view-car";
import { getActiveContacts } from "@/lib/data/contact";
import { toNumberSafe, whatsAppMessage, getImageUrl } from "@/lib/utils";
import { ContactType } from "@prisma/client";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import Logo from "@/public/images/luxuslogo.png";


export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const car = await getCarDetails(slug);
  if (!car) return {
    title: 'Car Not Found',
  }
  const primaryImage =
    car.images?.find((img) => img.isPrimary)?.url || car.images?.[0]?.url;

  return {
    title: {
      template: '%s | Luxus Car Rental',
      default: car.seo_title || car.brand?.name + " " + car.model,
    },
    description: car.seo_description || car.description,
    keywords: car.seo_keywords || car.brand?.name + ", " + car.model,
    assets: [getImageUrl(primaryImage)],
    openGraph: {
      title: car.brand?.name + " " + car.model,
      description: car.description,
      siteName: "Luxus Car Rental",
      locale: 'en_US, ar',
      images: [getImageUrl(primaryImage)],
      type: 'article'
    },
  }
}
interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function CarDetailPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const car = await getCarDetails(slug);
  const contacts = await getActiveContacts();
  if (!car) {
    notFound();
  }

  const phone = contacts?.find(c => c.type === ContactType.PHONE)?.value || "971561234567";
  const whatsapp = contacts?.find(c => c.type === ContactType.WHATSAPP)?.value || "+971561234567";

  return (
    <div className="bg-background">
      <CarSchema car={car} locale={locale} />
      <Header />
      <TrackViewCar car={{
        id: car.id,
        name: car.name,
        brandId: car.brandId,
        categoryId: car.categoryId,
        model: car.model,
      }} />
      
      {/* Breadcrumbs */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-6 lg:px-12 py-3">
          <ul className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground overflow-x-auto whitespace-nowrap scrollbar-hide">
            <li className="flex items-center gap-2">
              <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <Home className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </li>
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <li>
              <Link
                href={{ pathname: "/brands/[slug]", params: { slug: car.brand?.slug || '' } }}
                className="hover:text-primary transition-colors"
              >
                {car.brand?.name || "Brand"}
              </Link>
            </li>
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <li className="text-foreground font-medium truncate">
              {car.name} {car.model}
            </li>
          </ul>
        </div>
      </nav>

        {/* Title Section */}
        <section className="container mx-auto px-6 lg:px-12 pb-8">
          <div className="flex items-start gap-3 sm:gap-4">
            {car.brand?.logoUrl && (
              <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 rounded-lg bg-secondary flex items-center justify-center">
                <Image
                  src={getImageUrl(car.brand.logoUrl)}
                  alt={car.brand.name}
                  width={40}
                  height={40}
                  className="rounded"
                />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {car.brand?.name} {car.model}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                <Translated
                  key="details.rentInDubai"
                  fallback="Rent in Dubai"
                  withFragment
                />
                : {car.category?.name || "Luxury"}, {car.seats}{" "}
                <Translated
                  key="details.passengers"
                  fallback="Passengers"
                  withFragment
                />
                , {car.color || "Premium"}
              </p>
            </div>
          </div>
        </section>

        {/* Gallery and Pricing Section */}
        <section className="container mx-auto px-6 lg:px-12 py-12">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <CarDetailGallery
                images={
                  car.images?.map((img: any) => img.url) || ["/placeholder.svg"]
                }
                name={`${car.brand?.name} ${car.model}`}
              />

              {/* Car Info Tags */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-6 mb-8">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex-shrink-0">
                  {car.brand?.name} {car.model}
                </h2>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <span className="flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground whitespace-nowrap">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    {car.year}
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground whitespace-nowrap">
                    <Settings className="h-3 w-3 flex-shrink-0" />
                    {car.transmission}
                  </span>
                  <span className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground whitespace-nowrap">
                    {car.category?.name || "Luxury"}
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <CarDetailPricing
                pricePerDay={toNumberSafe(car.baseDailyPrice)}
                pricePerMonth={
                  toNumberSafe(car.baseMonthlyPrice) ||
                  toNumberSafe(car.baseDailyPrice) * 20
                }
                pricePerWeek={
                  toNumberSafe(car.baseWeeklyPrice) ||
                  toNumberSafe(car.baseDailyPrice) * 6
                }
                mileageLimit={toNumberSafe(car.mileageLimit) || 250}
                additionalMileage={toNumberSafe(car.additionalMileage) || 10}
                oneDayRental={car.oneDayRental}
                insurance={car.insurance}
              />
            </div>
            <div className="lg:col-span-1 space-y-4">
              {/* <div className="bg-card border border-border rounded-xl p-4 sm:p-6 lg:sticky lg:top-24 flex flex-col gap-4"> */}
              <div className="bg-card border border-border rounded-xl p-4 sm:p-6  flex flex-col gap-4">
                <h5 className="text-sm font-light text-center">
                  {" "}
                  Luxus Car Rental
                </h5>
                <div className="w-full flex justify-center">
                  <Image
                    src={Logo}
                    alt="Lux Car Rental"
                    width={132}
                    height={66}
                    className="rounded-lg object-contain"
                    priority
                  />
                </div>
                <h5 className="text-sm font-light text-center">
                  Book Directly from the Dealer
                </h5>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm"
                  >
                    <a href={`tel:${phone || '971561234567'}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      <Translated key="details.callNow" fallback="Call Now" />

                    </a>
                  </Button>
                  <Button
                    asChild
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg text-sm"
                  >
                    <a
                      href={whatsAppMessage(whatsapp || '971561234567', car)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <Translated key="details.whatsapp" fallback="WhatsApp" />

                    </a>
                  </Button>
                </div>
                <div className="border rounded-lg p-3 text-xs space-y-1">
                  <p className="font-semibold">Dealer Note</p>
                  <p className="text-muted-foreground">
                    15+ years of experience. We have the latest models for
                    luxury, SUV.
                  </p>
                </div>
              </div>
              {/* Open Now Card */}
              <div className="border rounded-xl p-4 bg-[#F0FFF4] flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-green-600">
                    Open Now
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Today Open 24hrs
                  </p>
                </div>
                <span className="text-lg text-green-600">›</span>
              </div>

              {car.rentalTerms && car.rentalTerms.length > 0 && (
                <CarDetailRentalTerms rentalTerms={car.rentalTerms} />
              )}

            </div>
          </div>
        </section>

        {/* Car Overview */}
        <section className="container mx-auto px-6 lg:px-12 py-12">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <CarDetailOverview
                bodyType={car.category?.name}
                bodyId={car.category?.id}
                bodySlug={car.category?.slug}
                make={car.brand?.name}
                makeId={car.brand?.id}
                makeSlug={car.brand?.slug}
                model={car.model}
                gearbox={car.transmission}
                seats={car.seats}
                doors={car.doors}
                bags={car.bags}
                fuelType={car.fuelType}
                color={car.color || undefined}
              />

              {/* Features */}
              {car.carFeatures && (
                <CarDetailFeatures carFeatures={car.carFeatures} />
              )}

              {/* Description */}
              {car.description && (
                <div className="mt-8">
                  <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
                    <Translated
                      key="details.desAndHighlights"
                      fallback="Description & Highlights"
                    />
                  </h2>
                  <div 
                    className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: car.description }}
                  />
                  {car.highlights && (
                    <div className="text-sm text-muted-foreground mt-4">
                      {car.highlights.map((highlight, index) => (
                        <p key={index}>{highlight}</p>
                      ))}
                    </div>
                  )}
                  {car.doors && car.seats && (
                    <p className="text-sm text-muted-foreground mt-4">
                      <Translated
                        key="details.seatAndDoor1"
                        fallback="This car has"
                        withFragment
                      />{" "}
                      {car.doors}{" "}
                      <Translated
                        key="details.seatAndDoor2"
                        fallback="doors and seats up to"
                        withFragment
                      />{" "}
                      {car.seats}{" "}
                      <Translated
                        key="details.seatAndDoor3"
                        fallback="passengers with premium comfort features."
                        withFragment
                      />
                    </p>
                  )}
                </div>
              )}

              {/* Requirements & FAQ Links */}
              <div className="mt-8 space-y-4">
                <Collapsible className="border border-border rounded-xl overflow-hidden hover:border-primary group">
                  <CollapsibleTrigger className="w-full flex items-center justify-between p-4 bg-card transition-colors text-left">
                    <span className="font-medium text-foreground text-sm sm:text-base">
                      <Translated
                        key="details.requirements"
                        fallback="Requirements to Rent this Car"
                      />
                    </span>
                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-3 border-t border-border">
                    {car.requirments?.map((faq, index) => (
                      <p
                        key={index}
                        className="text-sm text-muted-foreground flex items-center gap-1"
                      >
                        <Dot className="h-4 w-4 text-muted-foreground" />
                        {faq}
                      </p>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible className="border border-border rounded-xl overflow-hidden hover:border-primary group">
                  <CollapsibleTrigger className="w-full flex items-center justify-between p-4 bg-card transition-colors text-left">
                    <span className="font-medium text-foreground text-sm sm:text-base">
                      <Translated
                        key="details.faq"
                        fallback="Frequently Asked Questions"
                      />
                    </span>
                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-3 border-t border-border">
                    {car.carFaqs?.map((faq, index) => (
                      <div
                        key={index}
                        className="text-sm text-muted-foreground space-y-1"
                      >
                        <p className="font-bold">{faq.question}</p>
                        <div 
                          className="text-sm text-muted-foreground prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        />
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>

            {/* Rental Terms Sidebar */}
            {/* <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-4 sm:p-6 lg:sticky lg:top-24">
                <h3 className="font-semibold text-foreground mb-4 text-sm sm:text-base">
                  Rental Terms
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="text-muted-foreground">
                      Mileage Policy
                    </span>
                    <span className="h-4 w-4 rounded-full border border-muted-foreground flex items-center justify-center text-[10px]">
                      i
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="text-muted-foreground">Fuel Policy</span>
                    <span className="h-4 w-4 rounded-full border border-muted-foreground flex items-center justify-center text-[10px]">
                      i
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="text-muted-foreground">
                      Deposit Policy
                    </span>
                    <span className="h-4 w-4 rounded-full border border-muted-foreground flex items-center justify-center text-[10px]">
                      i
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="text-muted-foreground">Cancellation</span>
                    <span className="h-4 w-4 rounded-full border border-muted-foreground flex items-center justify-center text-[10px]">
                      i
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-secondary rounded-lg text-xs sm:text-sm text-foreground hover:bg-secondary/80 transition-colors">
                    <span>📋</span>
                    <span className="whitespace-nowrap">Report Listing</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-secondary rounded-lg text-xs sm:text-sm text-foreground hover:bg-secondary/80 transition-colors">
                    <span>📄</span>
                    <span className="whitespace-nowrap">Disclaimer</span>
                  </button>
                </div>
              </div>
            </div> */}
          </div>
        </section>
        <CarFilterdSection
          titleFallback={car.category.name}
          subtitleFallback=""
          query={{
            categoryId: car.category?.id,
            deletedAt: null,
            id: {
              not: car.id,
            },
          }}
        />
      <Footer />
    </div>
  );
}
