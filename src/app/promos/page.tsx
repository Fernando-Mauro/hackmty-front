"use client"
import Card from "@/components/card";
import CardSection from "@/components/cardsection";
import { useEffect, useState } from "react";

export default function Promos() {

    const [featured, setFeatured] = useState<any[]>([]);
    const [top, setTop] = useState<any[]>([]);

    useEffect(() => {
        // fetch data
        const fetchFeatured = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getDiscountsNow`);
                const data = await response.json();
                setFeatured(data);
                console.log("Featured data:", data);
            } catch (error) {
                console.error("Error fetching featured places:", error);
            }
        }

        fetchFeatured();
    }, []);

     useEffect(() => {
        // fetch data
        const fetchTop = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getTopDiscounts`);
                const data = await response.json();
                setTop(data);
                console.log("Top data:", data);
            } catch (error) {
                console.error("Error fetching featured places:", error);
            }
        }

        fetchTop();
    }, []);

    

    return (
        <div className="h-screen overflow-y-auto pb-20">
            <div className="px-4 sm:px-6 md:px-8 py-5">

                {/* Promo categories */}
                <div className="flex gap-2 sm:gap-3 mb-4 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <button className="text-sm sm:text-base flex-shrink-0 bg-[#013e5b] hover:bg-[#025a7f] text-white border-none px-3 sm:px-4 py-2 rounded-full cursor-pointer transition-colors">
                        Sushi
                    </button>
                    <button className="text-sm sm:text-base flex-shrink-0 bg-[#013e5b] hover:bg-[#025a7f] text-white border-none px-3 sm:px-4 py-2 rounded-full cursor-pointer transition-colors">
                        Chicken
                    </button>
                    <button className="text-sm sm:text-base flex-shrink-0 bg-[#013e5b] hover:bg-[#025a7f] text-white border-none px-3 sm:px-4 py-2 rounded-full cursor-pointer transition-colors">
                        Desserts
                    </button>
                    <button className="text-sm sm:text-base flex-shrink-0 bg-[#013e5b] hover:bg-[#025a7f] text-white border-none px-3 sm:px-4 py-2 rounded-full cursor-pointer transition-colors">
                        Coffee
                    </button>
                    <button className="text-sm sm:text-base flex-shrink-0 bg-[#013e5b] hover:bg-[#025a7f] text-white border-none px-3 sm:px-4 py-2 rounded-full cursor-pointer transition-colors">
                        Paninis
                    </button>
                    <button className="text-sm sm:text-base flex-shrink-0 bg-[#013e5b] hover:bg-[#025a7f] text-white border-none px-3 sm:px-4 py-2 rounded-full cursor-pointer transition-colors">
                        Healthy
                    </button>
                    <button className="text-sm sm:text-base flex-shrink-0 bg-[#013e5b] hover:bg-[#025a7f] text-white border-none px-3 sm:px-4 py-2 rounded-full cursor-pointer transition-colors">
                        Pasta
                    </button>
                </div>

                {/* Today  (now) */}
                {
                    featured.length > 0 && (
                        <CardSection name={"Today"}>
                            {featured.map((r, index) => (
                                <Card name={r.place_name} image={r.image_url} votes={r.votes} key={index} />
                            ))}
                        </CardSection>
                    )
                }

                {
                    top.length > 0 && (
                        <CardSection name={"Top Promotions"}>
                            {top.map((r, index) => (
                                <Card name={r.place_name} image={r.image_url} votes={r.votes} key={index} />
                            ))}
                        </CardSection>
                    )
                }
                {/* Healthy */}
                {/* <CardSection name={"Healthy"}>
                    {healthy.map((r, index) => (
                        <Card name={r.name} image={r.image} votes={r.votes} key={index} />
                    ))}
                </CardSection> */}

                {/* Pizza */}
                {/* <CardSection name={"Pizza"}>
                    {pizza.map((r, index) => (
                        <Card name={r.name} image={r.image} votes={r.votes} key={index} />
                    ))}
                </CardSection> */}
            </div>
        </div>
    );
}