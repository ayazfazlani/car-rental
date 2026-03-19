import ManageHomeHero from '@/components/admin/ManageHomeHero';
import { getHomeHero } from '@/lib/homeHero';

export default async function AdminHomeHeroPage() {
    const homeHero = getHomeHero();

    return (
        <ManageHomeHero homeHero={homeHero} />
    );
}
