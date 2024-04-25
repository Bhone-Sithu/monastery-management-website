import fetchBuildings from './fetchBuildings.mjs';



export default async function generateStaticParams() {
    // Fetch building IDs from your data source
    const buildingIds = await fetchBuildings();
    return buildingIds.map((building) => ({ params: { buildingId: building.id.toString() } }));
}