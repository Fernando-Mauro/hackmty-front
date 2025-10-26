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

    // Estados separados para promociones
    const [loadingPromotions, setLoadingPromotions] = useState(true);
    const [errorPromotions, setErrorPromotions] = useState<string | null>(null);

    // Estados separados para productos
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

                // Validar que data sea un array, si no, usar array vacío
                if (Array.isArray(data)) {
                    setProducts(data);
                } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
                    // Si la respuesta está envuelta en un objeto con propiedad 'data'
                    setProducts(data.data);
                } else {
                    setProducts([]);
                }

                console.log("Products data:", data);
            } catch (error) {
                console.error("Error fetching products:", error);
                setErrorProducts(error instanceof Error ? error.message : "Error al cargar productos");
                setProducts([]); // Asegurar que products sea array vacío en caso de error
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
                setErrorPromotions(error instanceof Error ? error.message : "Error al cargar promociones");
                setPromotions([]); // Asegurar que promotions sea array vacío en caso de error
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
        <div>
            <Cardsection name="Promociones">
                {loadingPromotions ? (
                    // Skeleton loading state
                    Array.from({ length: 4 }).map((_, idx) => <CardSkeleton key={`skeleton-${idx}`} />)
                ) : errorPromotions ? (
                    // Error state
                    <div className="col-span-full text-center py-8">
                        <p className="text-red-500 text-sm">{errorPromotions}</p>
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

            <Cardsection name="Products">
                {loadingProducts ? (
                    // Skeleton loading state
                    Array.from({ length: 4 }).map((_, idx) => <CardSkeleton key={`skeleton-product-${idx}`} />)
                ) : errorProducts ? (
                    // Error state
                    products.length === 0 ? (
                        <div className="col-span-full text-center py-8">
                            <p className="text-red-500 text-sm">{errorProducts}</p>
                            <p className="text-gray-400 text-xs mt-2">Intenta recargar la página</p>
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
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-500 text-sm">No hay productos disponibles</p>
                        <p className="text-gray-400 text-xs mt-2">¡Sé el primero en agregar uno!</p>
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
