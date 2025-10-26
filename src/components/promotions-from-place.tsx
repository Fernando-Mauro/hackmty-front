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
    const [products, setProducts] = useState<any[]>([]);

    // Separate states for promotions
    const [loadingPromotions, setLoadingPromotions] = useState(true);
    const [errorPromotions, setErrorPromotions] = useState<string | null>(null);

    // Separate states for products
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [errorProducts, setErrorProducts] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoadingProducts(true);
                setErrorProducts(null);

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getPlacesProductsByPlace/${placeId}`);

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                // Validate that data is an array, if not, use empty array
                if (Array.isArray(data)) {
                    setProducts(data);
                } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
                    // If response is wrapped in an object with 'data' property
                    setProducts(data.data);
                } else {
                    setProducts([]);
                }

                console.log("Products data:", data);
            } catch (error) {
                console.error("Error fetching products:", error);
                setErrorProducts(error instanceof Error ? error.message : "Error loading products");
                setProducts([]); // Ensure products is empty array in case of error
            } finally {
                setLoadingProducts(false);
            }
        }

        if (placeId) {
            fetchProducts();
        } else {
            setLoadingProducts(false);
            setProducts([]);
        }

    }, [placeId]);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                setLoadingPromotions(true);
                setErrorPromotions(null);
                
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getDiscountsByPlace/${placeId}`);
                
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                // Validate that data is an array, if not, use empty array
                if (Array.isArray(data)) {
                    setPromotions(data);
                } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
                    // If response is wrapped in an object with 'data' property
                    setPromotions(data.data);
                } else {
                    setPromotions([]);
                }
                
                console.log("Promotions data:", data);
            } catch (error) {
                console.error("Error fetching promotions:", error);
                setErrorPromotions(error instanceof Error ? error.message : "Error loading promotions");
                setPromotions([]); // Ensure promotions is empty array in case of error
            } finally {
                setLoadingPromotions(false);
            }
        }

        if (placeId) {
            fetchPromotions();
        } else {
            setLoadingPromotions(false);
            setPromotions([]);
        }

    }, [placeId]);

    return (
        <div className="h-full overflow-y-auto pb-6 px-2 sm:px-4">
            <Cardsection name="Promotions">
                {loadingPromotions ? (
                    // Skeleton loading state
                    Array.from({ length: 4 }).map((_, idx) => <CardSkeleton key={`skeleton-${idx}`} />)
                ) : errorPromotions ? (
                    // Error state
                    <div className="col-span-full text-center py-6 sm:py-8 px-4">
                        <p className="text-red-500 text-sm sm:text-base">{errorPromotions}</p>
                        <p className="text-gray-400 text-xs sm:text-sm mt-2">Try reloading the page</p>
                    </div>
                ) : promotions.length === 0 ? (
                    // Empty state
                    <div className="col-span-full text-center py-6 sm:py-8 px-4">
                        <p className="text-gray-500 text-sm sm:text-base">No promotions available</p>
                        <p className="text-gray-400 text-xs sm:text-sm mt-2">Be the first to post one!</p>
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

            <Cardsection name="Products">
                {loadingProducts ? (
                    // Skeleton loading state
                    Array.from({ length: 4 }).map((_, idx) => <CardSkeleton key={`skeleton-product-${idx}`} />)
                ) : errorProducts ? (
                    // Error state
                    products.length === 0 ? (
                        <div className="col-span-full text-center py-6 sm:py-8 px-4">
                            <p className="text-red-500 text-sm sm:text-base">{errorProducts}</p>
                            <p className="text-gray-400 text-xs sm:text-sm mt-2">Try reloading the page</p>
                        </div>
                    ) : (
                        products.map((product: any) => (
                            <Card 


                                key={product.id ?? product.name ?? Math.random()}
                                name={product.name ?? "Sin nombre"}
                                image={product.image_url ?? ""}
                                votes={product.votes ?? 0}
                            />
                        ))
                    )
                ) : products.length === 0 ? (
                    // Empty state
                    <div className="col-span-full text-center py-6 sm:py-8 px-4">
                        <p className="text-gray-500 text-sm sm:text-base">No products available</p>
                        <p className="text-gray-400 text-xs sm:text-sm mt-2">Be the first to add one!</p>
                    </div>
                ) : (
                    // Success state with data
                    products.map((product: any) => (
                        <Card 
                            key={product.id ?? product.product_name ?? Math.random()} 
                            name={product.product_name ?? "Sin nombre"} 
                            image={product.image_url ?? ""} 
                            votes={product.votes ?? 0} 
                        />
                    ))
                )}
            </Cardsection>  
        </div>
    );
}
