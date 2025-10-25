// Next.js MapLibre page backed by Amazon Location Service
"use client"

import MapComponent from "@/components/map-component";
import MapOverlay from "@/components/map-overlay";

export default function AppPage() {
    return (
        <div>
            <MapOverlay>
                <MapComponent/>
            </MapOverlay>
        </div>
    )
}