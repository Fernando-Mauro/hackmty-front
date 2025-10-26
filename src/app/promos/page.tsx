import Card from "@/components/card";
import CardSection from "@/components/cardsection";
import { useEffect, useState } from "react";


const healthy = [
    { name: "RESTAURANT 1", image: "https://static.wixstatic.com/media/d606f3_d6a45b4946284a25b980248196956726~mv2.png/v1/fill/w_280,h_281,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/HN%20pick.png", votes: 22 },
    { name: "RESTAURANT 2", image: "https://static.wixstatic.com/media/d606f3_d6a45b4946284a25b980248196956726~mv2.png/v1/fill/w_280,h_281,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/HN%20pick.png", votes: 22 },
    { name: "RESTAURANT 3", image: "https://static.wixstatic.com/media/d606f3_d6a45b4946284a25b980248196956726~mv2.png/v1/fill/w_280,h_281,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/HN%20pick.png", votes: 22 },
    { name: "RESTAURANT 4", image: "https://static.wixstatic.com/media/d606f3_d6a45b4946284a25b980248196956726~mv2.png/v1/fill/w_280,h_281,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/HN%20pick.png", votes: 22 },
];

const pizza = [
    { name: "RESTAURANT 1", image: "https://static.promodescuentos.com/threads/raw/7B9Q5/873520_1/re/1024x1024/qt/60/873520_1.jpg", votes: 22 },
    { name: "RESTAURANT 2", image: "https://static.promodescuentos.com/threads/raw/7B9Q5/873520_1/re/1024x1024/qt/60/873520_1.jpg", votes: 22 },
    { name: "RESTAURANT 3", image: "https://static.promodescuentos.com/threads/raw/7B9Q5/873520_1/re/1024x1024/qt/60/873520_1.jpg", votes: 22 },
    { name: "RESTAURANT 4", image: "https://static.promodescuentos.com/threads/raw/7B9Q5/873520_1/re/1024x1024/qt/60/873520_1.jpg", votes: 22 },
];

export default function Promos() {

    const [featured, setFeatured] = useState<any[]>([]);

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

                {/* Healthy */}
                <CardSection name={"Healthy"}>
                    {healthy.map((r, index) => (
                        <Card name={r.name} image={r.image} votes={r.votes} key={index} />
                    ))}
                </CardSection>

                {/* Pizza */}
                <CardSection name={"Pizza"}>
                    {pizza.map((r, index) => (
                        <Card name={r.name} image={r.image} votes={r.votes} key={index} />
                    ))}
                </CardSection>
            </div>
        </div>
    );
}