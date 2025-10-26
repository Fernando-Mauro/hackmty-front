import { useEffect, useState } from "react";
import Cardsection from "./cardsection";
import Card from "./card";
import CardSkeleton from "./card-skeleton";

export default function PromotionsFromPlace({
    placeId
}: {
    placeId: number;
}) {

    const [promotions, setPromotions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getDiscountsByPlace/${placeId}`);
                
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                // Validar que data sea un array, si no, usar array vacío
                if (Array.isArray(data)) {
                    setPromotions(data);
                } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
                    // Si la respuesta está envuelta en un objeto con propiedad 'data'
                    setPromotions(data.data);
                } else {
                    setPromotions([]);
                }
                
                console.log("Promotions data:", data);
            } catch (error) {
                console.error("Error fetching promotions:", error);
                setError(error instanceof Error ? error.message : "Error al cargar promociones");
                setPromotions([]); // Asegurar que promotions sea array vacío en caso de error
            } finally {
                setLoading(false);
            }
        }

        if (placeId) {
            fetchPromotions();
        } else {
            setLoading(false);
            setPromotions([]);
        }

    }, [placeId]);

    return (
        <div>
            <Cardsection name="Promociones">
                {loading ? (
                    // Skeleton loading state
                    Array.from({ length: 4 }).map((_, idx) => <CardSkeleton key={`skeleton-${idx}`} />)
                ) : error ? (
                    // Error state
                    <div className="col-span-full text-center py-8">
                        <p className="text-red-500 text-sm">{error}</p>
                        <p className="text-gray-400 text-xs mt-2">Intenta recargar la página</p>
                    </div>
                ) : promotions.length === 0 ? (
                    // Empty state
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-500 text-sm">No hay promociones disponibles</p>
                        <p className="text-gray-400 text-xs mt-2">¡Sé el primero en publicar una!</p>
                    </div>
                ) : (
                    // Success state with data
                    promotions.map((promotion: any) => (
                        <Card 
                            key={promotion.id ?? promotion.title ?? Math.random()} 
                            name={promotion.title ?? "Sin título"} 
                            image={promotion.image_url ?? ""} 
                            votes={promotion.votes ?? 0} 
                        />
                    ))
                )}
            </Cardsection>
        </div>
    );
}
