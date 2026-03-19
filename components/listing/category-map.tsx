import { getCarsByCategory } from "@/lib/data/cars-by-category";
import { CarCategoriesSection } from "./cars-categories-section";
import { getActiveContacts } from "@/lib/data/contact";


export async function CarCategoriesMap() {
    const carsByCategory = await getCarsByCategory({ showOnHome: true, deletedAt: null }, 12)
    const contacts = await getActiveContacts();

    return (
        <>
            {carsByCategory.map((category) => (<CarCategoriesSection
                key={category.id}
                id={category.id}
                slug={category.slug}
                title={category.name}
                subtitle={category.description || ""}
                cars={category.cars}
                contacts={contacts}
            />))}
        </>
    );
}
