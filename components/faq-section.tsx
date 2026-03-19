"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Faq } from "@prisma/client";

interface FaqSectionProps {
  items?: Faq[];
}

const defaultFaqItemsLeft: Partial<Faq>[] = [
  {
    id: '1',
    question: "How do I rent a car through Luxus Car Rental?",
    answer:
      "Browse our selection of cars, select your preferred vehicle, choose rental dates, and contact the dealer directly via call or WhatsApp.",
    isEnabled: true,
  },
  {
    id: '2',
    question: "What documents do I need to rent a car?",
    answer:
      "You'll need a valid driver's license, passport or Emirates ID, and a credit card for the security deposit.",
    isEnabled: true,
  },
  {
    id: '3',
    question: "Is insurance included in the rental price?",
    answer:
      "Basic insurance is included in all our rental packages. Additional coverage options are available at checkout.",
    isEnabled: true,
  },
];

const defaultFaqItemsRight: Partial<Faq>[] = [
  {
    id: '4',
    question: "Can I modify or cancel my booking?",
    answer:
      "Yes, you can modify or cancel your booking up to 24 hours before the pickup time. Contact our support team for assistance.",
    isEnabled: true,
  },
  {
    id: '5',
    question: "What is your fuel policy?",
    answer:
      "All cars are provided with a full tank of fuel and should be returned with a full tank. Alternatively, you can opt for our fuel package.",
    isEnabled: true,
  },
  {
    id: '6',
    question: "Do you offer delivery and pickup services?",
    answer:
      "Yes, we offer complimentary delivery and pickup services within Dubai. Additional charges may apply for other emirates.",
    isEnabled: true,
  },
];

export function FaqSection({ items = [] }: FaqSectionProps) {
  const t = useTranslations();
  const locale = useLocale()
  const isAr = locale === 'ar'
  const [openIndex, setOpenIndex] = useState<string | null>("1");

  // Split items into left and right columns
  const faqItemsLeft = items.length > 0 ? items.slice(0, Math.ceil(items.length / 2)) : defaultFaqItemsLeft;
  const faqItemsRight = items.length > 0 ? items.slice(Math.ceil(items.length / 2)) : defaultFaqItemsRight;

  return (
    <section className="py-12 bg-secondary relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl lg:text-[28px] font-bold text-foreground">
            {t("faq.title") || "Frequently Asked Questions"}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("faq.description") || "Find quick solutions to common queries"}
          </p>
        </div>

        {/* Two Column FAQ Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-base">
              {t("faq.rentalGuide") || "Luxus Car Rental Guide"}
            </h3>
            <div className="space-y-3">
              {faqItemsLeft.map((faq) => (
                <div
                  key={faq.id}
                  className="rounded-xl overflow-hidden bg-card border border-border"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === faq.id ? null : faq.id || null)
                    }
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    {/* Orange left border indicator */}
                    <div className="flex items-center">
                      <div
                        className={`w-1 h-6 rounded-full mx-3 ${openIndex === faq.id ? "bg-primary" : "bg-primary/40"
                          }`}
                      />
                      <span className="text-primary font-medium text-sm">
                        {isAr ? faq.question_ar ?? faq.question : faq.question}
                      </span>
                    </div>
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ml-4 ${openIndex === faq.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {openIndex === faq.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </button>
                  {openIndex === faq.id && (
                    <div className="px-4 pb-4 pl-8">
                      <p className="text-sm text-muted-foreground">
                        {isAr ? faq.answer_ar : faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-base">
              {t("faq.rentalGuide") || "Luxus Car Rental Guide"}
            </h3>
            <div className="space-y-3">
              {faqItemsRight.map((faq) => (
                <div
                  key={faq.id}
                  className="rounded-xl overflow-hidden bg-card border border-border"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === faq.id ? null : faq.id || null)
                    }
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-1 h-6 rounded-full mx-3 ${openIndex === faq.id
                          ? "bg-primary"
                          : "bg-primary/40"
                          }`}
                      />
                      <span className="text-primary font-medium text-sm">
                        {isAr ? faq.question_ar ?? faq.question : faq.question}
                      </span>
                    </div>
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ml-4 ${openIndex === faq.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {openIndex === faq.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </button>
                  {openIndex === faq.id && (
                    <div className="px-4 pb-4 pl-8">
                      <p className="text-sm text-muted-foreground">
                        {isAr ? faq.answer_ar : faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
