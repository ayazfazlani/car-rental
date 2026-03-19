"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
// import Logo from "@/public/images/black-mercedes-g-wagon-luxury-suv-front-angle-view.png";
const testimonials = [
  {
    name: "Nikko Jake Angelo Jarlan",
    date: "13 December 2025",
    rating: 5,
    title: "Luxus car rental is always my on the go rental company.",
    review:
      "It is fast, reliable, friendly staff and easy to deal with. Specially Gulzar who look after my entire experience from handing over to returning back. Thank you and will always come back!",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocIEqt0ZACqJ_NsG6RDOd2RATZxHYYgRNZOhbvY5oy3i5LM4BQ=w48-h48-p-rp-mo-br100",
    link: "https://maps.app.goo.gl/ZYxddcKqM1WFhrST9",
  },
  {
    name: "Vijayabaskar Vijayan",
    date: "10 December 2025",
    rating: 5,
    title: "A Wonderful Experience",
    review:
      "From Luxus, we got Staria 11 seater for 9 days and had a wonderful experience. Simple procedure for vehicle receiving and handed over, salik payment and any fine payment. Got it in clean and good condition. Recommend for my friends and families.",
    avatar: "http://lh3.googleusercontent.com/a-/ALV-UjUvWUZgA0PVwSGvNIaf3TSgoknEkPg-Shpw1sCygNOdjiPWfjiD=w48-h48-p-rp-mo-br100",
    link: "https://maps.app.goo.gl/2kig5t8mrGUi3xuH8",
  },
  {
    name: "Elena-Andreea BUGA",
    date: "8 December 2025",
    rating: 5,
    title: "Highly Recommended",
    review:
      "We had an amazing experience with Luxus Car Rental. Gulzar was extremely polite, punctual, and professional from start to finish. He personally picked us up from the airport and made sure everything went smoothly with the car — a beautiful green Mustang, perfectly clean and in excellent condition. The whole rental process was seamless, and his communication was clear and helpful at every step. Highly recommended for anyone looking for a premium and reliable car rental service in Dubai!",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocKLCzFj_EE0vvn9m6vyAi17PU3F_LeI-wOSoN5jNUTe8XFQ6g=w48-h48-p-rp-mo-br100",
    link: "https://maps.app.goo.gl/bbYPBjn7YpfdDsn47",
  },
  {
    name: "Sufyan Bajaber",
    date: "5 December 2025",
    rating: 5,
    title: "Truly one of the best car rental companies.",
    review:
      "I had an amazing experience with Luxus Car Rental, the car Range Rover Sport was in excellent condition. Mr. Gulzar was cooperative, supportive, and made the whole process smooth and enjoyable. Truly one of the best car rental companies.Highly recommended!",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjVZ5cHc1zXLCkMZ-cq56pqNbH5bWfujiE_Ds8tIZyphgs0jowuK=w48-h48-p-rp-mo-ba6-br100",
    link: "https://maps.app.goo.gl/bbYPBjn7YpfdDsn47",
  },
];

export function TestimonialsSection() {
  const t = useTranslations();

  return (
    <section className="py-12  bg-[#FFF9F3]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl lg:text-[28px] font-bold text-foreground">
            {t("testimonials.title") || "What Our Customers Say"}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("testimonials.description") ||
              "Real reviews from customers who trust our car rental services."}
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-5 border-2 border-dashed border-primary/40"
            >
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.date}
                  </p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Title and Review */}
              <h5 className="font-medium text-foreground mb-2 text-sm">
                {testimonial.title}
              </h5>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {testimonial.review}
              </p>

              {/* Read More Link */}
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-primary mt-3 inline-block"
              >
                {t("testimonials.readMore") || "Read more"}
              </Link>
            </div>
          ))}
        </div>

        {/* Read All Reviews Link */}
        <div className="flex justify-center mt-8">
          <Link
            href="https://maps.app.goo.gl/gb136bwGEoi6SSTb7"
            className="flex items-center gap-1 text-foreground font-medium hover:text-primary transition-colors text-sm"
          >
            {t("testimonials.readAllReviews") || "Read all reviews"}
            <ChevronRight className="h-4 w-4" />
            <ChevronRight className="h-4 w-4 -ml-2.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
