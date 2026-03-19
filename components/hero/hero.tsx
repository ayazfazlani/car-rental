import Image from "next/image";
import Logo from "@/public/images/black-mercedes-g-wagon-luxury-suv-front-angle-view.png";
import Translated from "../translated";
import { getImageUrl } from "@/lib/utils";
import { getHomeHero } from "@/lib/homeHero";
import HomeBrands from "../brands/brands";
import SearchSection from "./search";
import { Ploygone, Hexgone } from "@/public/icons/icon";
import Link from "next/link";

export async function Hero({ locale }: { locale?: string }) {
  const hero = await getHomeHero();

  const isAr = locale === "ar";
  const taglineAr = hero?.tagline_ar ?? hero?.tagline;
  const taglineEn = hero?.tagline ?? hero?.tagline_ar;
  let tagline: string | null = null;
  if (isAr && taglineAr) {
    tagline = taglineAr
  } else if (!isAr && taglineEn) {
    tagline = taglineEn
  }

  const headingAr = hero?.heading_ar ?? hero?.heading;
  const headingEn = hero?.heading ?? hero?.heading_ar;
  let heading: string | null = null;
  if (isAr && headingAr) {
    heading = headingAr
  } else if (!isAr && headingEn) {
    heading = headingEn
  }

  const descriptionAr = hero?.description_ar ?? hero?.description;
  const descriptionEn = hero?.description ?? hero?.description_ar;
  let description: string | null = null;
  if (isAr && descriptionAr) {
    description = descriptionAr
  } else if (!isAr && descriptionEn) {
    description = descriptionEn
  }
  const imageUrl = hero?.imageUrl ?? null;
  const imageSrc = hero?.imageSrc ?? null;

  return (
    <section className="bg-secondary overflow-hidden">
      <div className="relative">
        <div className="absolute top-0 right-0 hidden  lg:block">
          <Ploygone />
        </div>
        <div className="absolute top-[260px] left-0 hidden lg:block">
          <Hexgone />
        </div>
        <div className="flex gap-8 md:min-h-[375px] mx-auto w-full max-w-[1200px] px-3 lg:px-4 py-10 lg:py-0">
          <div className="flex flex-col justify-center">
            <div className="text-center lg:text-left">
              {tagline ? (
                <div className="inline-block bg-white rounded-2xl px-4 py-2 text-sm text-black mb-6 border border-border">
                  {tagline}
                </div>
              ) : (
                <Translated
                  key="hero.trustedPlatform"
                  fallback="100% Trusted Car rental platform in the world"
                  className="inline-block bg-white rounded-2xl px-4 py-2 text-sm text-black mb-6 border border-border"
                />
              )}
              <div className="">
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground ">
                  {heading ? (
                    <span className="inline-block">{heading}</span>
                  ) : (
                    <>
                      <Translated key="hero.title" fallback="Find Your Best" className="inline-block" />
                      <br />
                      <Translated key="hero.subtitle" fallback="Dream Car for Rental" className="inline-block" />
                    </>
                  )}
                </h1>

                {description ? (
                  <div className="text-muted-foreground mt-3 mb-5 leading-relaxed">{description}</div>
                ) : (
                  <Translated
                    key="hero.description"
                    fallback="Car Rental Dubai Book Directly with Trusted Suppliers, Enjoy Zero Commission & Best Rates"
                    className="text-muted-foreground mt-3 mb-5 leading-relaxed"
                  />
                )}
              </div>
            </div>
          </div>

          <Link className="max-h-[285px] w-full relative hidden md:block" href={imageSrc ? imageSrc : "/"}>
            <Image
              src={imageUrl ? getImageUrl(imageUrl) : Logo}
              alt="Lux Car Rental"
              fill
              className="hidden md:block"
              objectFit="contain"
              objectPosition="right"
              quality={100}
              unoptimized
            />
          </Link>
        </div>
        <div className="container mx-auto relative md:-mt-[90px] z-50 bg-white p-8 rounded-2xl shadow-lg w-full max-w-[1200px] mb-4">
          <div className="flex flex-col items-center px-4 sm:px-0">
            <SearchSection />
            <HomeBrands view="pills" />
          </div>
        </div>
      </div>
    </section>
  );
}
