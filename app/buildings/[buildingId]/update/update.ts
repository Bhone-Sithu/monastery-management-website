import fetchBuildings from "@/app/lib/fetchBuildings.mjs";

export async  function generateStaticParams() {
    // Fetch building IDs from your data source
    const buildingIds = await fetchBuildings();
    // @ts-ignore
    return buildingIds.map((building) => ({ params: { buildingId: building.id.toString() } }));
}