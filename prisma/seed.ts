import {
  PrismaClient,
  UserRole,
  HomePageSectionType,
  ContactType,
} from "@prisma/client";
import { hashPassword } from "../lib/auth";
import { createBrands } from "./seed/brands";
import { createCategories } from "./seed/category";
import { createCars } from "./seed/cars";
import 'dotenv/config';

const prisma = new PrismaClient();

async function createDefaultHomeSections() {
  console.log("📄 Creating default home page sections...");

  const defaultSections = [
    {
      type: HomePageSectionType.HERO,
      name: "Hero Section",
      name_ar: "قسم البطل",
      order: 0,
      isVisible: true,
      config: undefined,
      config_ar: undefined,
    },
    {
      type: HomePageSectionType.AFFORDABLE_CARS,
      name: "Affordable Cars",
      name_ar: "السيارات الميسورة",
      order: 1,
      isVisible: true,
      config: {
        title: "Affordable Cars",
        subtitle: "Still looking? Here are affordable cars for you.",
      },
      config_ar: {
        title: "السيارات الميسورة",
        subtitle: "لا تزال تبحث؟ إليك سيارات ميسورة الثمن لك.",
      },
    },
    {
      type: HomePageSectionType.RECOMMENDED_CARS,
      name: "Recommended Cars",
      name_ar: "السيارات الموصى بها",
      order: 2,
      isVisible: true,
      config: {
        title: "Recommended Cars Just for You",
        subtitle: "Still looking? Here are personalized car recommendations for you.",
        backgroundColor: "#FBF1E7",
      },
      config_ar: {
        title: "السيارات الموصى بها خصيصاً لك",
        subtitle: "لا تزال تبحث؟ إليك توصيات سيارات مخصصة لك.",
        backgroundColor: "#FBF1E7",
      },
    },
    {
      type: HomePageSectionType.BRANDS,
      name: "Brands",
      name_ar: "العلامات التجارية",
      order: 3,
      isVisible: true,
      config: {
        title: "All Brands",
        subtitle: "Explore cars from trusted global brands.",
        viewType: "cards",
      },
      config_ar: {
        title: "جميع العلامات التجارية",
        subtitle: "استكشف السيارات من العلامات التجارية العالمية الموثوقة.",
        viewType: "cards",
      },
    },
    {
      type: HomePageSectionType.CATEGORIES,
      name: "Car Categories",
      name_ar: "فئات السيارات",
      order: 4,
      isVisible: true,
      config: {
        title: "Browse by Category",
        subtitle: "Find your perfect car by category",
      },
      config_ar: {
        title: "تصفح حسب الفئة",
        subtitle: "ابحث عن سيارتك المثالية حسب الفئة",
      },
    },
    {
      type: HomePageSectionType.FAQ,
      name: "FAQ Section",
      name_ar: "قسم الأسئلة الشائعة",
      order: 5,
      isVisible: true,
      config: {
        title: "Frequently Asked Questions",
        subtitle: "Find quick solutions to common queries",
      },
      config_ar: {
        title: "الأسئلة الشائعة",
        subtitle: "ابحث عن حلول سريعة للاستفسارات الشائعة",
      },
    },
    {
      type: HomePageSectionType.TESTIMONIALS,
      name: "Testimonials",
      name_ar: "الشهادات",
      order: 6,
      isVisible: true,
      config: {
        title: "What Our Customers Say",
        subtitle: "Real feedback from our satisfied clients",
      },
      config_ar: {
        title: "ما يقوله عملاؤنا",
        subtitle: "ردود فعل حقيقية من عملائنا الراضين",
      },
    },
    {
      type: HomePageSectionType.BLOGS,
      name: "Blogs",
      name_ar: "المدونات",
      order: 7,
      isVisible: true,
      config: {
        title: "Recent Blogs",
        subtitle: "Latest blog posts from our blog",
      },
      config_ar: {
        title: "المدونات الأخيرة",
        subtitle: "آخر مقالات من مدونتنا",
      },
    },
  ];

  for (const section of defaultSections) {
    await prisma.homePageSection.upsert({
      where: { type: section.type },
      update: {
        order: section.order,
        isVisible: section.isVisible,
        config: section.config || undefined,
        name_ar: section.name_ar,
        config_ar: section.config_ar || undefined,
      },
      create: section,
    });
  }

  console.log("✅ Created default home page sections");
}

async function createContacts() {
  console.log("📄 Creating contacts...");
  await prisma.contact.upsert({
    where: { id: "contact-1" },
    update: {},
    create: {
      id: "contact-1",
      title: "Phone",
      value: "+971 123 4567",
      type: ContactType.PHONE,
      enabled: true,
    },
  });
  await prisma.contact.upsert({
    where: { id: "contact-2" },
    update: {},
    create: {
      id: "contact-2",
      title: "Email",
      value: "info@luxus.com",
      type: ContactType.EMAIL,
      enabled: true,
    },
  });
  console.log("✅ Created contacts");
}

async function createHomeHero() {
  console.log("📄 Creating home hero...");
  await prisma.homeHero.upsert({
    where: { id: "home-hero-1" },
    update: {},
    create: {
      id: "home-hero-1",
      tagline: "Luxury Experience",
      tagline_ar: "تجربة فاخرة",
      heading: "Rent Your Dream Car Today",
      heading_ar: "استأجر سيارة أحلامك اليوم",
      description: "Fast, easy, and premium car rental services in Dubai.",
      description_ar: "خدمات تأجير السيارات المتميزة والسهلة والسريعة في دبي.",
      imageUrl: "/hero-car.jpg",
    },
  });
  console.log("✅ Created home hero");
}

async function createMetadata() {
  console.log("📄 Creating metadata...");
  await prisma.metadata.createMany({
    data: [
      {
        page: "home",
        title: process.env.NEXT_PUBLIC_SITE_NAME + " | Premium Service in Dubai",
        description: "Rent luxury cars in Dubai with " + process.env.NEXT_PUBLIC_SITE_NAME + ". Premium fleet, easy booking, Best prices.",
        keywords: "luxury car rental, dubai cars, rent lamborghini, rent ferrari",
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Created metadata");
}

async function main() {
  console.log("🌱 Starting database seed...");

  // Create Super Admin
  const superAdminPassword = await hashPassword("admin123");
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@luxus.com" },
    update: {},
    create: {
      email: "admin@luxus.com",
      passwordHash: superAdminPassword,
      firstName: "Super",
      lastName: "Admin",
      role: UserRole.SUPER_ADMIN,
      isEmailVerified: true,
      isActive: true,
      adminProfile: {
        create: {
          employeeId: "ADMIN001",
          department: "Management",
        },
      },
    },
  });
  console.log("✅ Created super admin:", superAdmin.email);

  // await createBrands(prisma)
  // await createCategories(prisma)
  // await createCars(prisma)
  await createBrands(prisma);
  await createCategories(prisma);
  await createCars(prisma);
  await createDefaultHomeSections()
  await createContacts()
  await createHomeHero()
  await createMetadata()
  console.log("Super Admin: admin@luxus.com / admin123");
  console.log("Admin: manager@luxus.com / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
