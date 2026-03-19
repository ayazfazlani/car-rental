"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Loader2, X, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAdminTranslation } from "@/lib/admin-translations";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api";
import { Car, CarBrand, CarCategory } from "@prisma/client";
import { TCreateCar, createCarSchema } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import { cn, parseFloatFromString, getImageUrl } from "@/lib/utils";
import CarImagesComponent from "./car-image";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "../ui/textarea";

const initalValues: TCreateCar = {
    brandId: "",
    categoryId: "",
    name: "",
    model: "",
    year: new Date().getFullYear(),
    transmission: "AUTOMATIC",
    fuelType: "PETROL",
    seats: 4,
    engineSize: "",
    horsepower: undefined,
    topSpeed: undefined,
    acceleration: undefined,
    hasChauffeur: false,
    hasSelfDrive: true,
    hasGPS: true,
    hasBluetooth: true,
    hasSunroof: false,
    hasLeatherSeats: true,
    hasBackupCamera: true,
    baseDailyPrice: 0,
    baseWeeklyPrice: undefined,
    baseMonthlyPrice: undefined,
    chauffeurDailyPrice: undefined,
    description: "",
    highlights: [""],
    color: "",
    licensePlate: "",
    vin: "",
    affordable: false,
    recommended: false,
    carFeatures: [{ title: "", tags: [""] }],
    carFaqs: [{ question: "", answer: "" }],
    requirments: [""],
    oneDayRental: false,
    insurance: false,
    doors: 4,
    bags: 2,
    mileageLimit: 250,
    additionalMileage: 10,
    rentalTerms: [],
}

type ManageCarComponentProps = {
    id?: undefined,
    car?: undefined
} | {
    id: string,
    car: TCreateCar
}

export default function ManageCarComponent({ car, id }: ManageCarComponentProps) {
    const router = useRouter();
    const { t } = useAdminTranslation();

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const { data: brands, error: brandsError } = useQuery({
        queryKey: ['brands'],
        queryFn: () => API.queryGet<CarBrand[]>({ url: '/api/admin/brands', auth: true }),
    })
    const { data: categories, error: categoriesError } = useQuery({
        queryKey: ['categories'],
        queryFn: () => API.queryGet<CarCategory[]>({ url: '/api/admin/categories', auth: true })
    })

    const { mutate, status } = useMutation({
        mutationFn: (data: TCreateCar) => id ?
            API.queryPut<Car>({
                url: `/api/admin/cars/${id}`,
                payload: data,
                auth: true
            }) :
            API.queryPost<Car>({
                url: '/api/admin/cars',
                payload: data,
                auth: true
            }),
        onSuccess: (car) => {
            if (selectedFiles.length > 0 && !id) {
                const imageFormData = new FormData();
                selectedFiles.forEach((file) => {
                    imageFormData.append("images", file);
                });
                imageFormData.append("isPrimary", "true");
                upload({ id: car.id, form: imageFormData })
            } else {
                router.replace("/admin/cars")
            }
        },
        onError: (error) => {
            toast.error(error.message)
            console.error("Error creating car:", error)
        }
    })

    const { mutate: upload } = useMutation({
        mutationFn: (data: { id: string, form: FormData }) => API.queryPost({
            url: `/api/admin/cars/${data.id}/images`,
            payload: data.form,
            auth: true,
            isMultipart: true,
        }),
        onSuccess: () => {
            router.replace("/admin/cars")
        },
        onError: (error) => {
            toast.error(error.message)
            console.error("Error creating car:", error)
        }
    })

    const loading = status === "pending"

    const form = useForm({
        defaultValues: car ? car : initalValues,
        resolver: zodResolver(createCarSchema)
    })

    const submit = (data: TCreateCar) => {
        mutate(data)
    }

    const addHighlight = () => {
        const highlights = form.getValues("highlights") || []
        form.setValue("highlights", [...highlights, ""])
    }

    const removeHighlight = (index: number) => {
        const highlights = form.getValues("highlights") || []
        form.setValue("highlights", highlights.filter((_, i) => i !== index))
    }

    const addFaq = () => {
        const faqs = form.getValues("carFaqs") || []
        form.setValue("carFaqs", [...faqs, { question: "", answer: "" }])
    }

    const removeFaq = (index: number) => {
        const faqs = form.getValues("carFaqs") || []
        form.setValue("carFaqs", faqs.filter((_, i) => i !== index))
    }

    const addRequirement = () => {
        const requirments = form.getValues("requirments") || []
        form.setValue("requirments", [...requirments, ""])
    }

    const removeRequirement = (index: number) => {
        const requirments = form.getValues("requirments") || []
        form.setValue("requirments", requirments.filter((_, i) => i !== index))
    }

    const addFeature = () => {
        const carFeatures = form.getValues("carFeatures") || []
        form.setValue("carFeatures", [...carFeatures, { title: "", tags: [""] }])
    }

    const removeFeature = (index: number) => {
        const carFeatures = form.getValues("carFeatures") || []
        form.setValue("carFeatures", carFeatures.filter((_, i) => i !== index))
    }

    const addTag = (index: number) => {
        const tags = form.getValues(`carFeatures.${index}.tags`) || []
        form.setValue(`carFeatures.${index}.tags`, [...tags, ""])
    }

    const removeTag = (index: number, tagIndex: number) => {
        const tags = form.getValues(`carFeatures.${index}.tags`) || []
        form.setValue(`carFeatures.${index}.tags`, tags.filter((_, i) => i !== tagIndex))
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const newFiles = [...selectedFiles, ...files];
            setSelectedFiles(newFiles);

            // Create previews using Promise.all
            const previewPromises = files.map((file) => {
                return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(previewPromises).then((previews) => {
                setImagePreviews((prev) => [...prev, ...previews]);
            });
        }
    };

    const removeImage = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    if (brandsError || categoriesError) {
        const error = brandsError || categoriesError
        // @ts-expect-error cause not in type
        if (error?.cause?.logout) {
            router.push("/admin/login")
            return <></>
        }
        return <div>
            <p>Error fetching data</p>
            <p>{error?.message}</p>
        </div>
    }

    return (
        <div>
            <Button variant="outline" size="sm" asChild>
                <Link href="/admin/cars">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t("admin.backToCars")}
                </Link>
            </Button>
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 my-6">
                    <div>
                        <h1 className="text-3xl font-bold">{t(id ? "admin.editCar" : "admin.addNewCar")}</h1>
                        <p className="text-muted-foreground">{t(id ? "admin.editCarDetails" : "admin.fillCarDetails")}</p>
                    </div>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("admin.basicInformation")}</CardTitle>
                                <CardDescription>{t("admin.essentialDetails")}</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="brandId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("admin.brandRequired")}</FormLabel>
                                            <FormControl>
                                                <Select {...field} onValueChange={(v) => field.onChange(v)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t("admin.selectBrand")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {(brands || [])?.map((brand) => (
                                                                <SelectItem key={brand.id} value={brand.id}>
                                                                    {brand.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("admin.categoryRequired")}</FormLabel>
                                            <FormControl>
                                                <Select {...field} onValueChange={(v) => field.onChange(v)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t("admin.selectCategory")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {(categories || [])?.map((category) => (
                                                                <SelectItem key={category.id} value={category.id}>
                                                                    {category.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("admin.carName")}</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="e.g., Mercedes-Benz S-Class" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="model"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("admin.model")}</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="e.g., S500" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="year"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("admin.year")}</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" onChange={(e) => field.onChange(parseFloatFromString(e.target.value || ""))} min="1900" max={new Date().getFullYear() + 1} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="color"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("admin.color")}</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="e.g., Black, White" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Seo Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Seo</CardTitle>
                                <CardDescription>Seo Metadata</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="seo_title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title (optional)</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="e.g., Rent Mercedes-Benz S-Class - Luxury Car Rental" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="seo_description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (optional)</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="e.g., Rent Mercedes-Benz S-Class ...." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="seo_keywords"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Keywords (optional)</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="e.g., Mercedes, Benz, S-Class, Luxury, Car, Rental" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Specifications */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("admin.specifications")}</CardTitle>
                                <CardDescription>{t("admin.technicalDetails")}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="transmission"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("admin.transmissionRequired")}</FormLabel>
                                                <FormControl>
                                                    <Select {...field} onValueChange={(v) => field.onChange(v)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t("admin.selectTransmission")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectItem value="AUTOMATIC">{t("admin.automatic")}</SelectItem>
                                                                <SelectItem value="MANUAL">{t("admin.manual")}</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="fuelType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("admin.fuelTypeRequired")}</FormLabel>
                                                <FormControl>
                                                    <Select {...field} onValueChange={(v) => field.onChange(v)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t("admin.selectFuelType")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectItem value="PETROL">{t("admin.petrol")}</SelectItem>
                                                                <SelectItem value="DIESEL">{t("admin.diesel")}</SelectItem>
                                                                <SelectItem value="HYBRID">{t("admin.hybrid")}</SelectItem>
                                                                <SelectItem value="ELECTRIC">{t("admin.electric")}</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="seats"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("admin.seatsRequired")}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" onChange={(e) => field.onChange(parseFloatFromString(e.target.value || ""))} min="1" max="20" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="doors"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("admin.doors")}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" onChange={(e) => field.onChange(parseFloatFromString(e.target.value || ""))} min="1" max="6" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="bags"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("admin.bags")}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" onChange={(e) => field.onChange(parseFloatFromString(e.target.value || ""))} min="1" max="6" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="engineSize"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("admin.engineSize")}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="e.g., 3.0L V6" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="horsepower"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("admin.horsepower")}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="e.g., 450" type="number" onChange={(e) => field.onChange(parseFloatFromString(e.target.value || ""))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="topSpeed"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("admin.topSpeed")}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="e.g., 250" type="number" onChange={(e) => field.onChange(parseFloatFromString(e.target.value || ""))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="acceleration"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("admin.acceleration")}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" onChange={(e) => field.onChange(parseFloatFromString(e.target.value || ""))} placeholder="e.g., 4.5" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="mileageLimit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("admin.mileageLimit")}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" onChange={(e) => field.onChange(parseFloatFromString(e.target.value || ""))} placeholder="e.g., 250" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="additionalMileage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("admin.additionalMileage")}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" onChange={(e) => field.onChange(parseFloatFromString(e.target.value || ""))} placeholder="e.g., 10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label>{t("admin.features")}</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="hasSelfDrive"
                                            render={({ field }) => (
                                                <FormItem className="flex gap-2 items-center space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value || false}
                                                            onCheckedChange={(e) => field.onChange(typeof e === "string" ? false : e)}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>{t("admin.selfDrive")}</FormLabel>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="hasChauffeur"
                                            render={({ field }) => (
                                                <FormItem className="flex gap-2 items-center space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value || false}
                                                            onCheckedChange={(e) => field.onChange(typeof e === "string" ? false : e)}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>{t("admin.chauffeurAvailable")}</FormLabel>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="hasGPS"
                                            render={({ field }) => (
                                                <FormItem className="flex gap-2 items-center space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value || false}
                                                            onCheckedChange={(e) => field.onChange(typeof e === "string" ? false : e)}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>{t("admin.gpsNavigation")}</FormLabel>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="hasBluetooth"
                                            render={({ field }) => (
                                                <FormItem className="flex gap-2 items-center space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value || false}
                                                            onCheckedChange={(e) => field.onChange(typeof e === "string" ? false : e)}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>{t("admin.bluetooth")}</FormLabel>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="hasSunroof"
                                            render={({ field }) => (
                                                <FormItem className="flex gap-2 items-center space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value || false}
                                                            onCheckedChange={(e) => field.onChange(typeof e === "string" ? false : e)}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>{t("admin.sunroof")}</FormLabel>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="hasLeatherSeats"
                                            render={({ field }) => (
                                                <FormItem className="flex gap-2 items-center space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value || false}
                                                            onCheckedChange={(e) => field.onChange(typeof e === "string" ? false : e)}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>{t("admin.leatherSeats")}</FormLabel>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="hasBackupCamera"
                                            render={({ field }) => (
                                                <FormItem className="flex gap-2 items-center space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value || false}
                                                            onCheckedChange={(e) => field.onChange(typeof e === "string" ? false : e)}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>{t("admin.backupCamera")}</FormLabel>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="affordable"
                                            render={({ field }) => (
                                                <FormItem className="flex gap-2 items-center space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value || false}
                                                            onCheckedChange={(e) => field.onChange(typeof e === "string" ? false : e)}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>{t("admin.affordable")}</FormLabel>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="recommended"
                                            render={({ field }) => (
                                                <FormItem className="flex gap-2 items-center space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value || false}
                                                            onCheckedChange={(e) => field.onChange(typeof e === "string" ? false : e)}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>{t("admin.recommended")}</FormLabel>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="oneDayRental"
                                            render={({ field }) => (
                                                <FormItem className="flex gap-2 items-center space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value || false}
                                                            onCheckedChange={(e) => field.onChange(typeof e === "string" ? false : e)}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>{t("admin.oneDayRental")}</FormLabel>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="insurance"
                                            render={({ field }) => (
                                                <FormItem className="flex gap-2 items-center space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value || false}
                                                            onCheckedChange={(e) => field.onChange(typeof e === "string" ? false : e)}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>{t("admin.insurance")}</FormLabel>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pricing */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("admin.pricing")}</CardTitle>
                                <CardDescription>{t("admin.setRentalPrices")}</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="baseDailyPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("admin.dailyPrice")}</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" onChange={(e) => field.onChange(parseFloatFromString(e.target.value || ""))} step="0.01" placeholder="e.g., 1200" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="baseWeeklyPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("admin.weeklyPrice")}</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" onChange={(e) => field.onChange(parseFloatFromString(e.target.value || ""))} step="0.01" placeholder="e.g., 8000" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="baseMonthlyPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("admin.monthlyPrice")}</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" onChange={(e) => field.onChange(parseFloatFromString(e.target.value || ""))} step="0.01" placeholder="e.g., 25000" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="chauffeurDailyPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("admin.chauffeurDailyPrice")}</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" onChange={(e) => field.onChange(parseFloatFromString(e.target.value || ""))} step="0.01" placeholder="e.g., 1500" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Images */}
                        {id ? (<CarImagesComponent carId={id} />) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t("admin.carImages")}</CardTitle>
                                    <CardDescription>{t("admin.uploadCarImages")}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="car-images">{t("admin.selectImages")}</Label>
                                        <Input
                                            id="car-images"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileSelect}
                                            className="cursor-pointer"
                                        />
                                        <div className="mt-2 text-sm text-muted-foreground space-y-1">
                                            <p>
                                                • <strong>{t("admin.recommendedRatio")}:</strong> 4:3
                                            </p>
                                            <p>
                                                • <strong>{t("admin.recommendedSize")}:</strong> 1200 × 900 px
                                            </p>
                                            <p>
                                                • <strong>{t("admin.minimumSize")}:</strong> 800 × 600 px
                                            </p>
                                            <p>
                                                • <strong>{t("admin.formats")}:</strong> JPG, WebP, PNG
                                            </p>
                                            <p className="text-xs">
                                                {t("admin.imageNote")}
                                            </p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {t("admin.multipleImagesInfo")}
                                        </p>
                                    </div>
                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative group">
                                                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-input">
                                                        <Image
                                                            src={getImageUrl(preview)}
                                                            alt={`Preview ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => removeImage(index)}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                    {index === 0 && (
                                                        <Badge className="absolute top-2 left-2 bg-primary">
                                                            {t("admin.primary")}
                                                        </Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Rental Terms */}
                        <Card>
                            <CardHeader >
                                <div className="flex justify-between">
                                    <CardTitle>{t("admin.rentalTerms") || "Rental Terms"}</CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex items-center gap-2"
                                        onClick={() => {
                                            const terms = form.getValues("rentalTerms") || []
                                            form.setValue("rentalTerms", [...terms, { title: "", title_ar: "", description: "", description_ar: "" }])
                                        }}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        {t("admin.addRentalTerm")}
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {form.watch("rentalTerms")?.map((term, index) => (
                                        <div key={index} className="border rounded-lg p-3 space-y-2">
                                            <CardTitle className="flex items-center gap-2 justify-between">
                                                <span>{t("admin.rentalTerm") + " " + (index + 1)}</span>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        const terms = form.getValues("rentalTerms") || []
                                                        form.setValue("rentalTerms", terms.filter((_, i) => i !== index))
                                                    }}
                                                    className="text-xs"
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    {t("admin.removeRentalTerm")}
                                                </Button>
                                            </CardTitle>
                                            <div className="block md:flex gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`rentalTerms.${index}.title`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormLabel>{t("admin.titleInEnglish")}</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="e.g., Mileage Policy"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`rentalTerms.${index}.title_ar`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormLabel>{t("admin.titleInArabic")}</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="e.g., Mileage Policy"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name={`rentalTerms.${index}.description`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("admin.descriptionInEnglish")}</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                {...field}
                                                                value={field?.value || ""}
                                                                placeholder="Detailed explanation for the tooltip"
                                                                className="text-sm"
                                                                rows={2}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`rentalTerms.${index}.description_ar`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("admin.descriptionInArabic")}</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                {...field}
                                                                value={field?.value || ""}
                                                                placeholder="Detailed explanation for the tooltip"
                                                                className="text-sm"
                                                                rows={2}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("admin.additionalInformation")}</CardTitle>
                                <CardDescription>
                                    {t("admin.descriptionHighlights")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("admin.description")}</FormLabel>
                                            <FormControl>
                                                <textarea
                                                    {...field}
                                                    rows={4}
                                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    placeholder="Describe the car..."
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-between">
                                    <Label className="text-xl">{t("admin.requirments")}</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex items-center gap-2"
                                        onClick={addRequirement}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        {t("admin.requirment")}
                                    </Button>
                                </div>
                                {form.watch("requirments")?.map((highlight, index) => (
                                    <FormField
                                        key={index}
                                        control={form.control}
                                        name={`requirments.${index}`}
                                        render={({ field }) => (
                                            <FormItem className="flex gap-2 items-end">
                                                <div className="flex-1">
                                                    <FormLabel>{t("admin.requirment")}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Enter requirment"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => removeRequirement(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                                <div className="flex justify-between">
                                    <Label className="text-xl">{t("admin.highlights")}</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex items-center gap-2"
                                        onClick={addHighlight}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        {t("admin.highlight")}
                                    </Button>
                                </div>
                                {form.watch("highlights")?.map((highlight, index) => (
                                    <FormField
                                        key={index}
                                        control={form.control}
                                        name={`highlights.${index}`}
                                        render={({ field }) => (
                                            <FormItem className="flex gap-2 items-end">
                                                <div className="flex-1">
                                                    <FormLabel>{t("admin.highlight")}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="e.g., Premium leather seats"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => removeHighlight(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
                                    <FormField
                                        control={form.control}
                                        name="licensePlate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("admin.licensePlate")}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="e.g., ABC-1234" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="vin"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("admin.vin")}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder={t("admin.vehicleIdentificationNumber")} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between">
                                    <div>
                                        <CardTitle>{t("admin.features")}</CardTitle>
                                        <CardDescription>
                                            {t("admin.descriptionFeatures")}
                                        </CardDescription>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex items-center gap-2"
                                        onClick={addFeature}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        {t("admin.feature")}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {form.watch("carFeatures")?.map((feature, index) => (
                                    <div className={cn("space-y-2 bg-secondary rounded-2xl p-4", index !== 0 && "pt-4 border-t border-border")} key={index}>
                                        <CardTitle className="flex items-center gap-2 justify-between">
                                            <span>{t("admin.feature") + " " + (index + 1)}</span>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeFeature(index)}
                                                className="text-xs"
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                {t("admin.removeFeature")}
                                            </Button>
                                        </CardTitle>
                                        <FormField
                                            key={index}
                                            control={form.control}
                                            name={`carFeatures.${index}.title`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("admin.title")}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Enter title"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex justify-between">
                                            <Label className="text-xl">{t("admin.tags")}</Label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex items-center gap-2"
                                                onClick={() => addTag(index)}
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                {t("admin.tag")}
                                            </Button>
                                        </div>
                                        {form.watch(`carFeatures.${index}.tags`)?.map((tag, i) => (
                                            <FormField
                                                key={i}
                                                control={form.control}
                                                name={`carFeatures.${index}.tags.${i}`}
                                                render={({ field }) => (
                                                    <FormItem className="flex gap-2 items-end">
                                                        <div className="flex-1">
                                                            <FormLabel>{t("admin.tag")}</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="Enter tag"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeTag(index, i)}
                                                            className="text-xs"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* FAQs */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between">
                                    <div>
                                        <CardTitle>{t("admin.faqs")}</CardTitle>
                                        <CardDescription>{t("admin.setFAQs")}</CardDescription>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex items-center gap-2"
                                        onClick={addFaq}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        {t("admin.faqTitle")}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {form.watch("carFaqs")?.map((faq, index) => (
                                    <div className={cn("space-y-2 bg-secondary rounded-2xl p-4", index !== 0 && "pt-4 border-t border-border")} key={index}>
                                        <FormField
                                            key={index}
                                            control={form.control}
                                            name={`carFaqs.${index}.question`}
                                            render={({ field }) => (
                                                <FormItem className="flex gap-2 items-end">
                                                    <div className="flex-1">
                                                        <FormLabel>{t("admin.faqTitle")} {index + 1}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Enter FAQ"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeFaq(index)}
                                                        className="text-xs"
                                                    >
                                                        <X className="h-4 w-4 mr-2" />
                                                        {t("admin.removeFaq")}
                                                    </Button>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`carFaqs.${index}.answer`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("admin.answer")}</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            className="bg-background"
                                                            placeholder="Enter answer"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" asChild>
                                <Link href="/admin/cars">{t("admin.cancel")}</Link>
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        {t("admin.creating")}
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        {id ? t("admin.editCar") : t("admin.createCar")}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div >
    );
}
