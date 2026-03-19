// "use client"
// import { CarBrand } from '@prisma/client'
// import { CarFrontIcon } from 'lucide-react'
// // import { Mazde } from '../../public/icons/icon'
// import Link from 'next/link'
// import { use } from 'react'

// export default function BrandPills({ brands: brandsPromise }: { brands: Promise<CarBrand[]> }) {
//     const brands = use(brandsPromise);

//     console.log('brands', brands);

//     const getBrandLogo = (brand: CarBrand) => {
//         if (brand.logoUrl) {
//             return (
//                 <img
//                     src={brand.logoUrl}
//                     alt={brand.name}
//                     className="h-5  w-auto object-contain rounded-sm"
//                 />
//             );
//         }

//         return <CarFrontIcon />
//     };

//     return (
//         <div className="flex flex-wrap gap-3 mt-6 justify-center">
//             {brands.map((brand) => (
//                 <Link
//                     href={`/cars?brandId=${brand.id}`}
//                     key={brand.id}
//                     className="flex items-center gap-2 px-5 py-2.5 bg-background border border-border rounded-full text-sm text-foreground hover:border-primary transition-colors font-medium"
//                 >
//                     <span className="text-muted-foreground">
//                         {getBrandLogo(brand)}
//                     </span>
//                     {brand.name}
//                 </Link>
//             ))}
//         </div>
//     )
// }
// "use client"

// import { CarBrand } from '@prisma/client'
// import { CarFrontIcon, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
// import Link from 'next/link'
// import { use, useEffect, useRef, useState } from 'react'

// export default function BrandPills({ brands: brandsPromise }: { brands: Promise<CarBrand[]> }) {
//     const brands = use(brandsPromise);
//     const scrollContainerRef = useRef<HTMLDivElement>(null);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isAutoPlaying, setIsAutoPlaying] = useState(true);
//     const autoPlayRef = useRef<NodeJS.Timeout>();

//     // Calculate visible items based on container width
//     const itemsPerView = 6; // Adjust based on your design

//     const getBrandLogo = (brand: CarBrand) => {
//         if (brand.logoUrl) {
//             return (
//                 <img
//                     src={brand.logoUrl}
//                     alt={brand.name}
//                     className="h-5 w-auto object-contain rounded-sm"
//                 />
//             );
//         }
//         return <CarFrontIcon size={16} />
//     };

//     const scrollToIndex = (index: number) => {
//         if (scrollContainerRef.current) {
//             const container = scrollContainerRef.current;
//             const itemWidth = container.scrollWidth / brands.length;
//             container.scrollTo({
//                 left: itemWidth * index,
//                 behavior: 'smooth'
//             });
//             setCurrentIndex(index);
//         }
//     };

//     const scroll = (direction: 'left' | 'right') => {
//         if (scrollContainerRef.current) {
//             const container = scrollContainerRef.current;
//             const scrollAmount = container.clientWidth * 0.8;
//             container.scrollBy({
//                 left: direction === 'left' ? -scrollAmount : scrollAmount,
//                 behavior: 'smooth'
//             });

//             // Update index based on scroll position
//             setTimeout(() => {
//                 if (scrollContainerRef.current) {
//                     const scrollPos = scrollContainerRef.current.scrollLeft;
//                     const itemWidth = scrollContainerRef.current.scrollWidth / brands.length;
//                     const newIndex = Math.round(scrollPos / itemWidth);
//                     setCurrentIndex(Math.min(Math.max(newIndex, 0), brands.length - 1));
//                 }
//             }, 300);
//         }
//     };

//     const toggleAutoPlay = () => {
//         setIsAutoPlaying(!isAutoPlaying);
//     };

//     // Auto-play functionality
//     useEffect(() => {
//         if (isAutoPlaying && brands.length > itemsPerView) {
//             autoPlayRef.current = setInterval(() => {
//                 const nextIndex = (currentIndex + 1) % Math.ceil(brands.length / itemsPerView);
//                 scrollToIndex(nextIndex * itemsPerView);
//             }, 3000);
//         }

//         return () => {
//             if (autoPlayRef.current) {
//                 clearInterval(autoPlayRef.current);
//             }
//         };
//     }, [isAutoPlaying, currentIndex, brands.length]);

//     const handleScroll = () => {
//         if (scrollContainerRef.current) {
//             const scrollPos = scrollContainerRef.current.scrollLeft;
//             const itemWidth = scrollContainerRef.current.scrollWidth / brands.length;
//             const newIndex = Math.round(scrollPos / itemWidth);
//             setCurrentIndex(newIndex);
//         }
//     };

//     return (
//         <div className="relative px-10">
//             {/* Controls */}
//             <div className="flex items-center justify-between mb-4">
//                 {/* <h3 className="text-lg font-semibold">Popular Brands</h3> */}

//                 {/* <div className="flex items-center gap-2">
//                     <button
//                         onClick={toggleAutoPlay}
//                         className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                         aria-label={isAutoPlaying ? "Pause auto-slide" : "Play auto-slide"}
//                     >
//                         {isAutoPlaying ? <Pause size={18} /> : <Play size={18} />}
//                     </button>

//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={() => scroll('left')}
//                             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                             aria-label="Previous"
//                         >
//                             <ChevronLeft size={20} />
//                         </button>

//                         <button
//                             onClick={() => scroll('right')}
//                             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                             aria-label="Next"
//                         >
//                             <ChevronRight size={20} />
//                         </button>
//                     </div>
//                 </div> */}
//             </div>

//             {/* Brands Carousel */}
//             <div
//                 ref={scrollContainerRef}
//                 onScroll={handleScroll}
//                 className="flex gap-3 overflow-x-auto scrollbar-hide pb-6"
//                 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//             >
//                 <style jsx>{`
//                     .scrollbar-hide::-webkit-scrollbar {
//                         display: none;
//                     }
//                     @keyframes fadeIn {
//                         from { opacity: 0.5; transform: translateY(5px); }
//                         to { opacity: 1; transform: translateY(0); }
//                     }
//                 `}</style>

//                 {brands.map((brand, index) => (
//                     <Link
//                         href={`/cars?brandId=${brand.id}`}
//                         key={brand.id}
//                         className="flex-shrink-0 flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm text-foreground hover:border-primary hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-medium whitespace-nowrap group"
//                         style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s both` }}
//                     >
//                         <span className="text-muted-foreground group-hover:text-primary transition-colors">
//                             {getBrandLogo(brand)}
//                         </span>
//                         <span className="font-semibold">{brand.name}</span>
//                         <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
//                             {Math.floor(Math.random() * 50) + 1}
//                         </span>
//                     </Link>
//                 ))}
//             </div>

//             {/* Dots Indicator */}
//             {brands.length > itemsPerView && (
//                 <div className="flex justify-center gap-2 mt-4">
//                     {Array.from({ length: Math.ceil(brands.length / itemsPerView) }).map((_, index) => (
//                         <button
//                             key={index}
//                             onClick={() => scrollToIndex(index * itemsPerView)}
//                             className={`w-2 h-2 rounded-full transition-all ${
//                                 Math.floor(currentIndex / itemsPerView) === index
//                                     ? 'w-6 bg-primary'
//                                     : 'bg-gray-300 dark:bg-gray-700'
//                             }`}
//                             aria-label={`Go to slide ${index + 1}`}
//                         />
//                     ))}
//                 </div>
//             )}
//         </div>
//     )
// }

// "use client"

// import { CarBrand } from '@prisma/client'
// import { CarFrontIcon, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
// import Link from 'next/link'
// import { use, useEffect, useRef, useState } from 'react'

// export default function BrandPills({ brands: brandsPromise }: { brands: Promise<CarBrand[]> }) {
//     const brands = use(brandsPromise);
//     const scrollContainerRef = useRef<HTMLDivElement>(null);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isAutoPlaying, setIsAutoPlaying] = useState(true);
//     const autoPlayRef = useRef<NodeJS.Timeout>();

//     // Calculate visible items based on container width
//     const itemsPerView = 6; // Adjust based on your design

//     const getBrandLogo = (brand: CarBrand) => {
//         if (brand.logoUrl) {
//             return (
//                 <img
//                     src={brand.logoUrl}
//                     alt={brand.name}
//                     className="h-5 w-auto object-contain rounded-sm"
//                 />
//             );
//         }
//         return <CarFrontIcon size={16} />
//     };

//     const scrollToIndex = (index: number) => {
//         if (scrollContainerRef.current) {
//             const container = scrollContainerRef.current;
//             const itemWidth = container.scrollWidth / brands.length;
//             container.scrollTo({
//                 left: itemWidth * index,
//                 behavior: 'smooth'
//             });
//             setCurrentIndex(index);
//         }
//     };

//     const scroll = (direction: 'left' | 'right') => {
//         if (scrollContainerRef.current) {
//             const container = scrollContainerRef.current;
//             const scrollAmount = container.clientWidth * 0.8;
//             container.scrollBy({
//                 left: direction === 'left' ? -scrollAmount : scrollAmount,
//                 behavior: 'smooth'
//             });

//             // Update index based on scroll position
//             setTimeout(() => {
//                 if (scrollContainerRef.current) {
//                     const scrollPos = scrollContainerRef.current.scrollLeft;
//                     const itemWidth = scrollContainerRef.current.scrollWidth / brands.length;
//                     const newIndex = Math.round(scrollPos / itemWidth);
//                     setCurrentIndex(Math.min(Math.max(newIndex, 0), brands.length - 1));
//                 }
//             }, 300);
//         }
//     };

//     const toggleAutoPlay = () => {
//         setIsAutoPlaying(!isAutoPlaying);
//     };

//     // Auto-play functionality
//     useEffect(() => {
//         if (isAutoPlaying && brands.length > itemsPerView) {
//             autoPlayRef.current = setInterval(() => {
//                 const nextIndex = (currentIndex + 1) % Math.ceil(brands.length / itemsPerView);
//                 scrollToIndex(nextIndex * itemsPerView);
//             }, 3000);
//         }

//         return () => {
//             if (autoPlayRef.current) {
//                 clearInterval(autoPlayRef.current);
//             }
//         };
//     }, [isAutoPlaying, currentIndex, brands.length]);

//     const handleScroll = () => {
//         if (scrollContainerRef.current) {
//             const scrollPos = scrollContainerRef.current.scrollLeft;
//             const itemWidth = scrollContainerRef.current.scrollWidth / brands.length;
//             const newIndex = Math.round(scrollPos / itemWidth);
//             setCurrentIndex(newIndex);
//         }
//     };

//     return (
//         <div className="relative px-4 sm:px-6 md:px-10">
//             {/* Controls - You can uncomment if needed */}
//             {/* <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold">Popular Brands</h3>

//                 <div className="flex items-center gap-2">
//                     <button
//                         onClick={toggleAutoPlay}
//                         className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                         aria-label={isAutoPlaying ? "Pause auto-slide" : "Play auto-slide"}
//                     >
//                         {isAutoPlaying ? <Pause size={18} /> : <Play size={18} />}
//                     </button>

//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={() => scroll('left')}
//                             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                             aria-label="Previous"
//                         >
//                             <ChevronLeft size={20} />
//                         </button>

//                         <button
//                             onClick={() => scroll('right')}
//                             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                             aria-label="Next"
//                         >
//                             <ChevronRight size={20} />
//                         </button>
//                     </div>
//                 </div>
//             </div> */}

//             {/* Brands Carousel */}
//             <div
//                 ref={scrollContainerRef}
//                 onScroll={handleScroll}
//                 className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-6"
//                 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//             >
//                 <style jsx>{`
//                     .scrollbar-hide::-webkit-scrollbar {
//                         display: none;
//                     }
//                     @keyframes fadeIn {
//                         from { opacity: 0.5; transform: translateY(5px); }
//                         to { opacity: 1; transform: translateY(0); }
//                     }
//                 `}</style>

//                 {brands.map((brand, index) => (
//                     <Link
//                         href={`/cars?brandId=${brand.id}`}
//                         key={brand.id}
//                         className="flex-shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-foreground hover:border-primary hover:shadow-md sm:hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-medium whitespace-nowrap group min-w-[140px] sm:min-w-[160px] md:min-w-auto"
//                         style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s both` }}
//                     >
//                         <span className="text-muted-foreground group-hover:text-primary transition-colors">
//                             {getBrandLogo(brand)}
//                         </span>
//                         <span className="font-semibold truncate">{brand.name}</span>
//                         <span className="hidden xs:inline text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
//                             {Math.floor(Math.random() * 50) + 1}
//                         </span>
//                     </Link>
//                 ))}
//             </div>

//             {/* Dots Indicator */}
//             {brands.length > itemsPerView && (
//                 <div className="flex justify-center gap-2 mt-4">
//                     {Array.from({ length: Math.ceil(brands.length / itemsPerView) }).map((_, index) => (
//                         <button
//                             key={index}
//                             onClick={() => scrollToIndex(index * itemsPerView)}
//                             className={`w-2 h-2 rounded-full transition-all ${
//                                 Math.floor(currentIndex / itemsPerView) === index
//                                     ? 'w-4 sm:w-6 bg-primary'
//                                     : 'bg-gray-300 dark:bg-gray-700'
//                             }`}
//                             aria-label={`Go to slide ${index + 1}`}
//                         />
//                     ))}
//                 </div>
//             )}
//         </div>
//     )
// }

// "use client"

// import { CarBrand } from '@prisma/client'
// import { CarFrontIcon, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
// import Link from 'next/link'
// import { use, useEffect, useRef, useState } from 'react'

// export default function BrandPills({ brands: brandsPromise }: { brands: Promise<CarBrand[]> }) {
//     const brands = use(brandsPromise);
//     const scrollContainerRef = useRef<HTMLDivElement>(null);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isAutoPlaying, setIsAutoPlaying] = useState(true);
//     const autoPlayRef = useRef<NodeJS.Timeout>();

//     // Show 3 items per view to get more dots
//     const itemsPerView = 3; // Changed from 6 to 3

//     const getBrandLogo = (brand: CarBrand) => {
//         if (brand.logoUrl) {
//             return (
//                 <img
//                     src={brand.logoUrl}
//                     alt={brand.name}
//                     className="h-5 w-auto object-contain rounded-sm"
//                 />
//             );
//         }
//         return <CarFrontIcon size={16} />
//     };

//     const scrollToIndex = (index: number) => {
//         if (scrollContainerRef.current) {
//             const container = scrollContainerRef.current;
//             const itemWidth = container.scrollWidth / brands.length;
//             const targetScroll = itemWidth * index;

//             container.scrollTo({
//                 left: targetScroll,
//                 behavior: 'smooth'
//             });
//             setCurrentIndex(index);
//         }
//     };

//     const scrollToSlide = (slideIndex: number) => {
//         const targetIndex = slideIndex * itemsPerView;
//         scrollToIndex(targetIndex);
//     };

//     const scroll = (direction: 'left' | 'right') => {
//         if (scrollContainerRef.current) {
//             const container = scrollContainerRef.current;
//             const scrollAmount = container.clientWidth * 0.8;
//             container.scrollBy({
//                 left: direction === 'left' ? -scrollAmount : scrollAmount,
//                 behavior: 'smooth'
//             });

//             // Update index based on scroll position
//             setTimeout(() => {
//                 if (scrollContainerRef.current) {
//                     const scrollPos = scrollContainerRef.current.scrollLeft;
//                     const itemWidth = scrollContainerRef.current.scrollWidth / brands.length;
//                     const newIndex = Math.round(scrollPos / itemWidth);
//                     setCurrentIndex(Math.min(Math.max(newIndex, 0), brands.length - 1));
//                 }
//             }, 300);
//         }
//     };

//     const toggleAutoPlay = () => {
//         setIsAutoPlaying(!isAutoPlaying);
//     };

//     // Auto-play functionality
//     useEffect(() => {
//         if (isAutoPlaying && brands.length > itemsPerView) {
//             autoPlayRef.current = setInterval(() => {
//                 const totalSlides = Math.ceil(brands.length / itemsPerView);
//                 const currentSlide = Math.floor(currentIndex / itemsPerView);
//                 const nextSlide = (currentSlide + 1) % totalSlides;
//                 scrollToSlide(nextSlide);
//             }, 3000);
//         }

//         return () => {
//             if (autoPlayRef.current) {
//                 clearInterval(autoPlayRef.current);
//             }
//         };
//     }, [isAutoPlaying, currentIndex, brands.length]);

//     const handleScroll = () => {
//         if (scrollContainerRef.current) {
//             const scrollPos = scrollContainerRef.current.scrollLeft;
//             const itemWidth = scrollContainerRef.current.scrollWidth / brands.length;
//             const newIndex = Math.round(scrollPos / itemWidth);
//             setCurrentIndex(newIndex);
//         }
//     };

//     // Calculate total number of slides
//     const totalSlides = Math.ceil(brands.length / itemsPerView);

//     return (
//         <div className="relative px-4 sm:px-6 md:px-10">
//             {/* Controls - You can uncomment if needed */}
//             {/* <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold">Popular Brands</h3>

//                 <div className="flex items-center gap-2">
//                     <button
//                         onClick={toggleAutoPlay}
//                         className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                         aria-label={isAutoPlaying ? "Pause auto-slide" : "Play auto-slide"}
//                     >
//                         {isAutoPlaying ? <Pause size={18} /> : <Play size={18} />}
//                     </button>

//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={() => scroll('left')}
//                             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                             aria-label="Previous"
//                         >
//                             <ChevronLeft size={20} />
//                         </button>

//                         <button
//                             onClick={() => scroll('right')}
//                             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                             aria-label="Next"
//                         >
//                             <ChevronRight size={20} />
//                         </button>
//                     </div>
//                 </div>
//             </div> */}

//             {/* Brands Carousel */}
//             <div
//                 ref={scrollContainerRef}
//                 onScroll={handleScroll}
//                 className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-6"
//                 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//             >
//                 <style jsx>{`
//                     .scrollbar-hide::-webkit-scrollbar {
//                         display: none;
//                     }
//                     @keyframes fadeIn {
//                         from { opacity: 0.5; transform: translateY(5px); }
//                         to { opacity: 1; transform: translateY(0); }
//                     }
//                 `}</style>

//                 {brands.map((brand, index) => (
//                     <Link
//                         href={`/cars?brandId=${brand.id}`}
//                         key={brand.id}
//                         className="flex-shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-foreground hover:border-primary hover:shadow-md sm:hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-medium whitespace-nowrap group min-w-[calc(33.333%-0.5rem)] sm:min-w-[calc(33.333%-0.75rem)]"
//                         style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s both` }}
//                     >
//                         <span className="text-muted-foreground group-hover:text-primary transition-colors">
//                             {getBrandLogo(brand)}
//                         </span>
//                         <span className="font-semibold truncate">{brand.name}</span>
//                         <span className="hidden xs:inline text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
//                             {Math.floor(Math.random() * 50) + 1}
//                         </span>
//                     </Link>
//                 ))}
//             </div>

//             {/* Dots Indicator - Will show more dots now */}
//             {brands.length > itemsPerView && (
//                 <div className="flex justify-center gap-2 mt-4">
//                     {Array.from({ length: totalSlides }).map((_, index) => (
//                         <button
//                             key={index}
//                             onClick={() => scrollToSlide(index)}
//                             className={`w-2 h-2 rounded-full transition-all ${
//                                 Math.floor(currentIndex / itemsPerView) === index
//                                     ? 'w-4 sm:w-6 bg-primary'
//                                     : 'bg-gray-300 dark:bg-gray-700'
//                             }`}
//                             aria-label={`Go to slide ${index + 1}`}
//                         />
//                     ))}
//                 </div>
//             )}
//         </div>
//     )
// }

// "use client"

// import { CarBrand } from '@prisma/client'
// import { CarFrontIcon, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
// import Link from 'next/link'
// import { use, useEffect, useRef, useState } from 'react'

// export default function BrandPills({ brands: brandsPromise }: { brands: Promise<CarBrand[]> }) {
//     const brands = use(brandsPromise);
//     const scrollContainerRef = useRef<HTMLDivElement>(null);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isAutoPlaying, setIsAutoPlaying] = useState(true);
//     const autoPlayRef = useRef<NodeJS.Timeout>();
//     const [itemsPerView, setItemsPerView] = useState(6); // Start with desktop value

//     // Responsive items per view
//     useEffect(() => {
//         const updateItemsPerView = () => {
//             if (window.innerWidth < 640) { // Mobile
//                 setItemsPerView(4); // Show 2 items on mobile
//             } else if (window.innerWidth < 768) { // Tablet
//                 setItemsPerView(4); // Show 4 items on tablet
//             } else { // Desktop
//                 setItemsPerView(6); // Show 6 items on desktop
//             }
//         };

//         updateItemsPerView();
//         window.addEventListener('resize', updateItemsPerView);
//         return () => window.removeEventListener('resize', updateItemsPerView);
//     }, []);

//     const getBrandLogo = (brand: CarBrand) => {
//         if (brand.logoUrl) {
//             return (
//                 <img
//                     src={brand.logoUrl}
//                     alt={brand.name}
//                     className="h-5 w-auto object-contain rounded-sm"
//                 />
//             );
//         }
//         return <CarFrontIcon size={16} />
//     };

//     const scrollToIndex = (index: number) => {
//         if (scrollContainerRef.current) {
//             const container = scrollContainerRef.current;
//             const itemWidth = container.scrollWidth / brands.length;
//             const targetScroll = itemWidth * index;

//             container.scrollTo({
//                 left: targetScroll,
//                 behavior: 'smooth'
//             });
//             setCurrentIndex(index);
//         }
//     };

//     const scrollToSlide = (slideIndex: number) => {
//         const targetIndex = slideIndex * itemsPerView;
//         scrollToIndex(targetIndex);
//     };

//     const scroll = (direction: 'left' | 'right') => {
//         if (scrollContainerRef.current) {
//             const container = scrollContainerRef.current;
//             const scrollAmount = container.clientWidth * 0.8;
//             container.scrollBy({
//                 left: direction === 'left' ? -scrollAmount : scrollAmount,
//                 behavior: 'smooth'
//             });

//             // Update index based on scroll position
//             setTimeout(() => {
//                 if (scrollContainerRef.current) {
//                     const scrollPos = scrollContainerRef.current.scrollLeft;
//                     const itemWidth = scrollContainerRef.current.scrollWidth / brands.length;
//                     const newIndex = Math.round(scrollPos / itemWidth);
//                     setCurrentIndex(Math.min(Math.max(newIndex, 0), brands.length - 1));
//                 }
//             }, 300);
//         }
//     };

//     const toggleAutoPlay = () => {
//         setIsAutoPlaying(!isAutoPlaying);
//     };

//     // Auto-play functionality
//     useEffect(() => {
//         if (isAutoPlaying && brands.length > itemsPerView) {
//             autoPlayRef.current = setInterval(() => {
//                 const totalSlides = Math.ceil(brands.length / itemsPerView);
//                 const currentSlide = Math.floor(currentIndex / itemsPerView);
//                 const nextSlide = (currentSlide + 1) % totalSlides;
//                 scrollToSlide(nextSlide);
//             }, 3000);
//         }

//         return () => {
//             if (autoPlayRef.current) {
//                 clearInterval(autoPlayRef.current);
//             }
//         };
//     }, [isAutoPlaying, currentIndex, brands.length, itemsPerView]);

//     const handleScroll = () => {
//         if (scrollContainerRef.current) {
//             const scrollPos = scrollContainerRef.current.scrollLeft;
//             const itemWidth = scrollContainerRef.current.scrollWidth / brands.length;
//             const newIndex = Math.round(scrollPos / itemWidth);
//             setCurrentIndex(newIndex);
//         }
//     };

//     // Calculate total number of slides
//     const totalSlides = Math.ceil(brands.length / itemsPerView);

//     return (
//         <div className="relative px-4 sm:px-6 md:px-10">


//             {/* Brands Carousel */}
//             <div
//                 ref={scrollContainerRef}
//                 onScroll={handleScroll}
//                 className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-6"
//                 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//             >
//                 <style jsx>{`
//                     .scrollbar-hide::-webkit-scrollbar {
//                         display: none;
//                     }
//                     @keyframes fadeIn {
//                         from { opacity: 0.5; transform: translateY(5px); }
//                         to { opacity: 1; transform: translateY(0); }
//                     }
//                 `}</style>

//                 {brands.map((brand, index) => (
//                     <Link
//                         href={`/cars?brandId=${brand.id}`}
//                         key={brand.id}
//                         className="flex-shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-foreground hover:border-primary hover:shadow-md sm:hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-medium whitespace-nowrap group"
//                         style={{ 
//                             animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
//                             // Responsive width based on itemsPerView
//                             minWidth: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 0.5}rem)`
//                         }}
//                     >
//                         <span className="text-muted-foreground group-hover:text-primary transition-colors">
//                             {getBrandLogo(brand)}
//                         </span>
//                         <span className="font-semibold truncate">{brand.name}</span>
//                         <span className="hidden xs:inline text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
//                             {Math.floor(Math.random() * 50) + 1}
//                         </span>
//                     </Link>
//                 ))}
//             </div>

//             {/* Dots Indicator - Will show more dots on mobile */}
//             {brands.length > itemsPerView && (
//                 <div className="flex justify-center gap-2 mt-4">
//                     {Array.from({ length: totalSlides }).map((_, index) => (
//                         <button
//                             key={index}
//                             onClick={() => scrollToSlide(index)}
//                             className={`w-2 h-2 rounded-full transition-all ${
//                                 Math.floor(currentIndex / itemsPerView) === index
//                                     ? 'w-4 sm:w-6 bg-primary'
//                                     : 'bg-gray-300 dark:bg-gray-700'
//                             }`}
//                             aria-label={`Go to slide ${index + 1}`}
//                         />
//                     ))}
//                 </div>
//             )}
//         </div>
//     )

"use client"

import { CarBrand } from '@prisma/client'
import { CarFrontIcon, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { use, useEffect, useRef, useState } from 'react'

export default function BrandPills({ brands: brandsPromise }: { brands: Promise<CarBrand[]> }) {
    const brands = use(brandsPromise);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const autoPlayRef = useRef<NodeJS.Timeout>();
    const [itemsPerView, setItemsPerView] = useState(6);

    // Responsive items per view
    useEffect(() => {
        const updateItemsPerView = () => {
            if (window.innerWidth < 640) { // Mobile
                setItemsPerView(3); // Show 3 items on mobile
            } else if (window.innerWidth < 768) { // Tablet
                setItemsPerView(4); // Show 4 items on tablet
            } else { // Desktop
                setItemsPerView(6); // Show 6 items on desktop
            }
        };

        updateItemsPerView();
        window.addEventListener('resize', updateItemsPerView);
        return () => window.removeEventListener('resize', updateItemsPerView);
    }, []);

    const getBrandLogo = (brand: CarBrand) => {
        if (brand.logoUrl) {
            return (
                <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="h-5 w-auto object-contain rounded-sm"
                />
            );
        }
        return <CarFrontIcon size={16} />
    };

    const scrollToIndex = (index: number) => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const itemWidth = container.scrollWidth / (brands.length || 1);
            const targetScroll = itemWidth * index;

            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
            setCurrentIndex(index);
        }
    };

    const scrollToSlide = (slideIndex: number) => {
        const targetIndex = slideIndex * itemsPerView;
        scrollToIndex(targetIndex);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });

            // Update index based on scroll position - using a longer timeout to ensure scroll finished
            setTimeout(() => {
                if (scrollContainerRef.current) {
                    const scrollPos = scrollContainerRef.current.scrollLeft;
                    const itemWidth = scrollContainerRef.current.scrollWidth / (brands.length || 1);
                    const newIndex = Math.round(scrollPos / itemWidth);
                    setCurrentIndex(Math.min(Math.max(newIndex, 0), brands.length - 1));
                }
            }, 500);
        }
    };

    const toggleAutoPlay = () => {
        setIsAutoPlaying(!isAutoPlaying);
    };

    // Auto-play functionality
    useEffect(() => {
        if (isAutoPlaying && brands.length > itemsPerView) {
            autoPlayRef.current = setInterval(() => {
                const totalSlidesCount = Math.ceil(brands.length / itemsPerView);
                const currentSlide = Math.floor(currentIndex / itemsPerView);
                const nextSlide = (currentSlide + 1) % totalSlidesCount;
                scrollToSlide(nextSlide);
            }, 4000); // 4 seconds for better reading
        }

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [isAutoPlaying, currentIndex, brands.length, itemsPerView]);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const scrollPos = scrollContainerRef.current.scrollLeft;
            const itemWidth = scrollContainerRef.current.scrollWidth / (brands.length || 1);
            const newIndex = Math.round(scrollPos / itemWidth);
            // Only update if index actually changed to avoid excessive re-renders
            if (newIndex !== currentIndex) {
                setCurrentIndex(newIndex);
            }
        }
    };

    // Calculate total number of slides
    const totalSlides = Math.ceil(brands.length / itemsPerView);

    return (
        <div className="relative px-2 sm:px-6 md:px-10">
            {/* Brands Carousel */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 sm:pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <style jsx>{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0.5; transform: translateY(5px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>

                {brands.map((brand, index) => (
                    <Link
                        href={{ pathname: "/brands/[slug]", params: { slug: brand.slug } }}
                        key={brand.id}
                        className="flex-shrink-0 flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-foreground hover:border-primary hover:shadow-md transition-all duration-300 font-medium whitespace-nowrap group min-w-[120px] sm:min-w-[150px]"
                        style={{ 
                            animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
                            // Responsive width based on itemsPerView
                            minWidth: `calc((100% - ${(itemsPerView - 1) * 0.5}rem) / ${itemsPerView})`
                        }}
                    >
                        <span className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0">
                            {getBrandLogo(brand)}
                        </span>
                        <span className="font-semibold truncate">{brand.name}</span>
                        <span className="hidden xs:inline text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                            {Math.floor(Math.random() * 50) + 1}
                        </span>
                    </Link>
                ))}
            </div>

            {/* Dots Indicator */}
            {brands.length > itemsPerView && (
                <div className="flex justify-center gap-1.5 mt-2">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToSlide(index)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                                Math.floor(currentIndex / itemsPerView) === index
                                    ? 'w-4 bg-primary'
                                    : 'bg-gray-300 dark:bg-gray-700'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}