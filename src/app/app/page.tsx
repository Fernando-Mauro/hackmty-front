// Next.js MapLibre page backed by Amazon Location Service
"use client"

import { useState } from "react";
import MapComponent from "@/components/map-component";
import MapOverlay from "@/components/map-overlay";

export default function AppPage() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div>
            <MapOverlay searchQuery={searchQuery} onSearchQueryChange={setSearchQuery}>
                <MapComponent searchQuery={searchQuery}/>
            </MapOverlay>
        </div>
    )
}