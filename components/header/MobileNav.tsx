"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, Home, Globe, DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CarBrand, CarCategory } from "@prisma/client";
import { use } from "react";

interface MobileNavProps {
    brandsPromise: Promise<CarBrand[]>;
    categoriesPromise: Promise<CarCategory[]>;
}

export function MobileNav({ brandsPromise, categoriesPromise }: MobileNavProps) {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Use the promises
    const brands = use(brandsPromise);
    const categories = use(categoriesPromise);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
            </Button>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="fixed inset-y-0 left-0 z-50 h-full w-[80%] max-w-[300px] border-r bg-background p-0 shadow-lg duration-300 sm:max-w-[400px] sm:rounded-none flex flex-col translate-x-0 translate-y-0 top-0 left-0">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center p-4 border-b">
                        <span className="font-bold text-lg">Menu</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto py-4">
                        <nav className="flex flex-col px-2 space-y-1">
                            {/* Home */}
                            <Link
                                href="/"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
                                onClick={() => setOpen(false)}
                            >
                                <Home className="h-5 w-5 text-primary" />
                                {t("common.rentACar")}
                            </Link>

                            {/* Brands Accordion */}
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="brands" className="border-none">
                                    <AccordionTrigger className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium hover:no-underline [&[data-state=open]>svg]:rotate-90">
                                        <div className="flex items-center gap-3">
                                            <div className="h-5 w-5 flex items-center justify-center">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            </div>
                                            {t("common.carBrands")}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-2">
                                        <div className="flex flex-col ml-12 space-y-1">
                                            {brands.map((brand) => (
                                                <Link
                                                    key={brand.id}
                                                    href={{ pathname: "/brands/[slug]", params: { slug: brand.slug } }}
                                                    className="px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors border-l border-border"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    {brand.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Categories Accordion */}
                                <AccordionItem value="categories" className="border-none">
                                    <AccordionTrigger className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium hover:no-underline [&[data-state=open]>svg]:rotate-90">
                                        <div className="flex items-center gap-3">
                                            <div className="h-5 w-5 flex items-center justify-center">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            </div>
                                            {t("common.carType")}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-2">
                                        <div className="flex flex-col ml-12 space-y-1">
                                            {categories.map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    href={{ pathname: "/categories/[slug]", params: { slug: cat.slug } }}
                                                    className="px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors border-l border-border"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    {cat.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            {/* Car with Driver */}
                            <Link
                                // @ts-expect-error query not in type
                                href="/cars?hasChauffeur=true"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
                                onClick={() => setOpen(false)}
                            >
                                <div className="h-5 w-5 flex items-center justify-center">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                </div>
                                {t("common.carWithDriver")}
                            </Link>

                            {/* Blog */}
                            <Link
                                href="/blog"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
                                onClick={() => setOpen(false)}
                            >
                                <div className="h-5 w-5 flex items-center justify-center">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                </div>
                                {t("admin.blog.title")}
                            </Link>
                        </nav>
                    </div>

                    {/* Footer / Copyright */}
                    <div className="p-4 border-t bg-muted/30">
                        <p className="text-xs text-center text-muted-foreground">
                            © Luxus Car Rental 2026. All rights reserved.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
