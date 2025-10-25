// Next.js MapLibre page backed by Amazon Location Service
"use client"

import { useEffect, useState } from "react"
import Map, { NavigationControl, Marker } from "react-map-gl/maplibre"
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
    const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);

    // NUEVO: Pedir la ubicación cuando el componente cargue
    useEffect(() => {
        // Comprobar si el navegador soporta geolocalización
        if (navigator.geolocation) {

            // Pedir la ubicación. Esto mostrará el popup de "Permitir ubicación"
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Éxito: El usuario aceptó
                    const { latitude, longitude } = position.coords;

                    // 1. Guardamos la ubicación para el Marker
                    setUserLocation({ latitude, longitude });

                    // 2. (Opcional) Centramos el mapa en el usuario
                    setInitialViewState(prev => ({
                        ...prev,
                        latitude: latitude,
                        longitude: longitude,
                        zoom: 16, // Hacemos un zoom más cercano
                    }));
                },
                (error) => {
                    // Error: El usuario bloqueó el permiso o hubo un fallo
                    console.error("Error al obtener la ubicación:", error.message);
                }
            );
        } else {
            console.log("Geolocalización no soportada por este navegador.");
        }
    }, []);

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
                {/* <NavigationControl position="top-left" /> */}
                {userLocation && (
                    <Marker
                        longitude={userLocation.longitude}
                        latitude={userLocation.latitude}
                        anchor="bottom" // Para que la punta del pin esté en las coordenadas
                    >
                        {/* Puedes poner un icono de FontAwesome, una imagen, o un simple emoji */}
                        <div style={{ fontSize: '2.5rem', color: '#0070f3' }}>
                            📍
                        </div>
                    </Marker>
                )}
            </Map>
        </div>
    )
}