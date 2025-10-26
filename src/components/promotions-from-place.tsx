import { useEffect, useState } from "react";
import Cardsection from "./cardsection";
import Card from "./card";
import CardSkeleton from "./card-skeleton";

export default function PromotionsFromPlace({
    placeId
}: {
    placeId: number;
}) {

    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getDiscountsByPlace/${placeId}`);
                const data = await response.json();
                setPromotions(data);
                console.log("Promotions data:", data);
            } catch (error) {
                console.error("Error fetching promotions:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPromotions();

    }, [placeId]);

    return (
        <div>
            <Cardsection name="Promociones">
                {loading ? (
                    Array.from({ length: 4 }).map((_, idx) => <CardSkeleton key={`skeleton-${idx}`} />)
                ) : promotions.map((promotion: any) => (
                    <Card key={promotion.id ?? promotion.title} name={promotion.title} image={promotion.image_url} votes={promotion.votes} />
                ))}
            </Cardsection>
        </div>
    );
}
