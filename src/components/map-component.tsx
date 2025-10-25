// Next.js MapLibre page backed by Amazon Location Service
"use client"

import { useState } from "react"
import Map, { NavigationControl } from "react-map-gl/maplibre"
import maplibreGl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

// Coordenadas de ejemplo (como en el snippet HTML): Vancouver
const EXAMPLE_LONGITUDE = -100.2906
const EXAMPLE_LATITUDE = 25.6514
const MAP_REGION = process.env.NEXT_PUBLIC_AWS_REGION
const MAP_NAME = process.env.NEXT_PUBLIC_MAP_NAME
const API_KEY = process.env.NEXT_PUBLIC_MAP_API_KEY

// Pequeña ayuda en runtime para detectar configuración faltante durante el dev
if (typeof window !== "undefined") {
    if (!MAP_REGION || !MAP_NAME || !API_KEY) {
        // eslint-disable-next-line no-console
        console.warn(
            "Amazon Location: faltan variables NEXT_PUBLIC_AWS_REGION, NEXT_PUBLIC_MAP_NAME o NEXT_PUBLIC_MAP_API_KEY"
        )
    }
}

/**
 * Esta función intercepta cada petición que hace el mapa (para tiles, estilos, etc.)
 * y le añade tu API Key como un parámetro en la URL.
 */
const transformRequest = (url: string, resourceType?: string) => {
    let newUrl = url
    if (resourceType === "Style" && !/^https?:\/\//.test(url)) {
        newUrl = `https://maps.geo.${MAP_REGION}.amazonaws.com/maps/v0/maps/${MAP_NAME}/style-descriptor`
    }

    if (newUrl.includes("amazonaws.com")) {
        // Evita duplicar el parámetro key
        if (!/[?&]key=/.test(newUrl)) {
            const sep = newUrl.includes("?") ? "&" : "?"
            newUrl = `${newUrl}${sep}key=${API_KEY}`
        }
        return { url: newUrl }
    }

    // No modificar otras URLs
    return { url }
}

export default function MapComponent() {

    const [initialViewState, setInitialViewState] = useState({
        longitude: EXAMPLE_LONGITUDE,
        latitude: EXAMPLE_LATITUDE,
        zoom: 15,
    })

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <Map
                {...initialViewState}
                mapLib={maplibreGl}
                transformRequest={transformRequest} 
                mapStyle={`https://maps.geo.${MAP_REGION}.amazonaws.com/maps/v0/maps/${MAP_NAME}/style-descriptor?key=${API_KEY}`}
                onMove={(evt: any) => setInitialViewState(evt.viewState)}
                style={{ width: "100%", height: "100%" }}
            >
                <NavigationControl position="top-left" />
            </Map>
        </div>
    )
}