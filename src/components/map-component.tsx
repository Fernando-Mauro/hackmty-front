// Next.js MapLibre page backed by Amazon Location Service
"use client"

// --- IMPORTS DE AMBOS ARCHIVOS ---
import { useEffect, useState, useRef } from "react" // <--- Added useRef
import Map, { NavigationControl, Marker } from "react-map-gl/maplibre"
import maplibreGl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { motion, AnimatePresence } from "framer-motion" // <--- Added from MapOverlay
import { X, MapPin, Star } from "lucide-react" // <--- Added from MapOverlay
import { Button } from "@/components/ui/button" // <--- Added from MapOverlay
import Image from "next/image" // <--- Added to show details
import PromotionsFromPlace from "./promotions-from-place"


// Coordenadas de ejemplo
const EXAMPLE_LONGITUDE = -100.2906
const EXAMPLE_LATITUDE = 25.6514
const MAP_REGION = process.env.NEXT_PUBLIC_AWS_REGION
const MAP_NAME = process.env.NEXT_PUBLIC_MAP_NAME
const API_KEY = process.env.NEXT_PUBLIC_MAP_API_KEY

// ... (El código de 'if (typeof window !== "undefined")' se queda igual) ...
if (typeof window !== "undefined") {
    if (!MAP_REGION || !MAP_NAME || !API_KEY) {
        console.warn(
            "Amazon Location: faltan variables NEXT_PUBLIC_AWS_REGION, NEXT_PUBLIC_MAP_NAME o NEXT_PUBLIC_MAP_API_KEY"
        )
    }
}

// ... (La función 'transformRequest' se queda igual) ...
const transformRequest = (url: string, resourceType?: string) => {
    let newUrl = url
    if (resourceType === "Style" && !/^https?:\/\//.test(url)) {
        newUrl = `https://maps.geo.${MAP_REGION}.amazonaws.com/maps/v0/maps/${MAP_NAME}/style-descriptor`
    }
    if (newUrl.includes("amazonaws.com")) {
        if (!/[?&]key=/.test(newUrl)) {
            const sep = newUrl.includes("?") ? "&" : "?"
            newUrl = `${newUrl}${sep}key=${API_KEY}`
        }
        return { url: newUrl }
    }
    return { url }
}

interface Place {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    // Add optional fields that your API might return
    description?: string;
    image_url?: string;
    rating?: number | string;
    address?: string;
}

export default function MapComponent() {
    // --- Estados del Mapa (Archivo 1) ---
    const [places, setPlaces] = useState<Place[]>([]);
    const [loadingPlaces, setLoadingPlaces] = useState(true);
    const [initialViewState, setInitialViewState] = useState({
        longitude: EXAMPLE_LONGITUDE,
        latitude: EXAMPLE_LATITUDE,
        zoom: 15,
    })
    const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [loadingLocation, setLoadingLocation] = useState(true);

    // --- BottomSheet states (copied from File 2) ---
    const [showPlaceSheet, setShowPlaceSheet] = useState(false)
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null) // <-- NEW!
    const [sheetHeight, setSheetHeight] = useState(50) // percentage
    const [isDragging, setIsDragging] = useState(false)
    const dragStartY = useRef(0)
    const dragStartHeight = useRef(0)
    const [isExpanded, setIsExpanded] = useState(false);

    // --- useEffect para Cargar Lugares (con manejo de errores) ---
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                setLoadingPlaces(true);
                const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getPlaces`);
                if (!data.ok) {
                    throw new Error(`Error al cargar lugares: ${data.status}`);
                }
                const placesData = await data.json();
                setPlaces(placesData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingPlaces(false);
            }
        };
        fetchPlaces();
    }, []);

    // --- useEffect for User Location (no changes) ---
    useEffect(() => {
        setLoadingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                    setInitialViewState(prev => ({
                        ...prev,
                        latitude: latitude,
                        longitude: longitude,
                        zoom: 16,
                    }));
                    setLoadingLocation(false);
                },
                (error) => {
                    console.error("Error getting location:", error.message);
                    setLoadingLocation(false);
                }
            );
        } else {
            console.log("Geolocalización no soportada por este navegador.");
            setLoadingLocation(false);
        }
    }, []);

    // --- Handlers de DRAG (copiados de Archivo 2) ---
    const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
        setIsDragging(true)
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
        dragStartY.current = clientY
        dragStartHeight.current = sheetHeight
    }

    const handleDragMove = (e: TouchEvent | MouseEvent) => {
        if (!isDragging) return
        e.preventDefault();
        const clientY = "touches" in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY
        const deltaY = dragStartY.current - clientY
        const windowHeight = window.innerHeight
        const deltaPercent = (deltaY / windowHeight) * 100
        const newHeight = Math.min(Math.max(dragStartHeight.current + deltaPercent, 20), 100)
        setSheetHeight(newHeight)
    }

    const handleDragEnd = () => {
        setIsDragging(false)
        if (sheetHeight < 35) {
            setShowPlaceSheet(false)
            setSheetHeight(50)
            setIsExpanded(false)
        } else if (sheetHeight < 65) {
            setSheetHeight(50)
            setIsExpanded(false)
        } else {
            setSheetHeight(100)
            setIsExpanded(true)
        }
    }

    // --- useEffect de DRAG (copiado de Archivo 2) ---
    useEffect(() => {
        if (isDragging) {
            const handleMove = (e: TouchEvent | MouseEvent) => handleDragMove(e)
            const handleEnd = () => handleDragEnd()

            window.addEventListener("touchmove", handleMove, { passive: false })
            window.addEventListener("mousemove", handleMove)
            window.addEventListener("touchend", handleEnd)
            window.addEventListener("mouseup", handleEnd)

            return () => {
                window.removeEventListener("touchmove", handleMove)
                window.removeEventListener("mousemove", handleMove)
                window.removeEventListener("touchend", handleEnd)
                window.removeEventListener("mouseup", handleEnd)
            }
        }
    }, [isDragging, sheetHeight])

    // --- Function to CLOSE the Sheet (copied from File 2) ---
    const closeSheet = () => {
        setShowPlaceSheet(false)
        setSheetHeight(50)
        setIsExpanded(false)
        // Optional: deselect place after closing
        // setTimeout(() => setSelectedPlace(null), 300); 
    }

    return (
        //  👇 IMPORTANT! Added 'position: relative' and 'overflow: hidden'
        <div style={{ height: "100vh", width: "100%", position: "relative", overflow: "hidden" }}>
            {/* Loading overlay while getting places or location */}
            {(loadingPlaces || loadingLocation) && (
                <div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                        <div
                            className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"
                            style={{ color: "var(--brand-blue)" }}
                            role="status"
                        >
                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                Loading...
                            </span>
                        </div>
                        <p className="mt-4 text-gray-700">Loading map…</p>
                    </div>
                </div>
            )}
            <Map
                {...initialViewState}
                mapLib={maplibreGl}
                transformRequest={transformRequest}
                mapStyle={`https://maps.geo.${MAP_REGION}.amazonaws.com/maps/v0/maps/${MAP_NAME}/style-descriptor?key=${API_KEY}`}
                onMove={(evt: any) => setInitialViewState(evt.viewState)}
                style={{ width: "100%", height: "100%" }}
            >
                {/* --- User Marker (no changes) --- */}
                {userLocation && (
                    <Marker
                        longitude={userLocation.longitude}
                        latitude={userLocation.latitude}
                        anchor="center"
                    >
                        <div className="user-marker-container">
                            <div className="user-marker-pulse"></div>
                            <div className="user-marker-dot"></div>
                        </div>
                    </Marker>
                )}

                {/* --- Marcadores de Lugares (onClick MODIFICADO) --- */}
                {places.map((place) => (
                    <Marker
                        key={place.id}
                        longitude={place.longitude}
                        latitude={place.latitude}
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            setSelectedPlace(place);
                            setShowPlaceSheet(true);
                            setSheetHeight(50);
                        }}
                    >
                        {/* Contenedor del marcador con etiqueta */}
                        <div className="flex flex-col items-center -translate-y-2">
                            <span className="z-10 mb-10 max-w-[160px] truncate px-2 py-0.5 rounded bg-white text-xs font-medium shadow ring-1 ring-black/5">
                                {place.name}
                            </span>
                            <div className="marker-pin">
                                <div className="marker-pulse"></div>
                            </div>
                        </div>
                    </Marker>
                ))}
            </Map>

            {/* --- BOTTOM SHEET (copied from File 2 and MODIFIED) --- */}
            <AnimatePresence>
                {showPlaceSheet && selectedPlace && ( // <-- Updated condition
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 z-30 bg-black/30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={closeSheet}
                        />

                        {/* Panel deslizable */}
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 z-40"
                            style={{
                                height: `${sheetHeight}%`,
                                touchAction: "none",
                            }}
                            initial={{ y: "100%" }}
                            animate={{ y: "0%" }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 20, stiffness: 150 }}
                        >
                            <div className={isExpanded ? "h-full w-full px-0" : "mx-auto h-full max-w-2xl px-4"}>
                                <div className="flex h-full flex-col rounded-t-3xl bg-white shadow-2xl">
                                    {/* Drag Handle */}
                                    <div
                                        className="flex cursor-grab items-center justify-center py-4 active:cursor-grabbing"
                                        onTouchStart={handleDragStart}
                                        onMouseDown={handleDragStart}
                                    >
                                        <div className="h-1.5 w-12 rounded-full bg-gray-300 transition-colors hover:bg-gray-400" />
                                    </div>

                                    {/* Contenido del Panel (MODIFICADO) */}
                                    <div className="flex-1 w-full overflow-y-auto px-6 pb-6">
                                        <div className="mb-4 flex w-full">
                                            <h2 className="text-xl font-bold text-center w-full" style={{ color: "var(--brand-blue)" }}>
                                                {selectedPlace.name}
                                            </h2>
                                        </div>
                                        <button
                                            onClick={closeSheet}
                                            className="rounded-full p-2 transition-all hover:bg-gray-100 active:scale-95 absolute top-7 right-7"
                                        >
                                            <X className="h-6 w-6 text-gray-500" />
                                        </button>

                                        {/* container for rating, and address */}
                                        <div className="mb-4 flex w-full items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Star className="h-5 w-5 text-yellow-500" />
                                                <span className="text-gray-700">{selectedPlace.rating || "No rating available"}</span>
                                            </div>
                                            <span className="text-gray-500">{selectedPlace.address || "No address available"}</span>
                                        </div>
                                        {/* Aquí muestras los detalles del lugar */}
                                        <div className="space-y-4">
                                            {selectedPlace.image_url && (
                                                <div className="relative w-full h-48 rounded-xl overflow-hidden">
                                                    <img
                                                        src={selectedPlace.image_url}
                                                        alt={selectedPlace.name}
                                                        style={{ objectFit: 'cover' }}
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                            )}
                                            {/* Puedes añadir más detalles aquí */}
                                            <Button
                                                className={`w-full ${isExpanded ? 'hidden': ''}`}
                                                style={{ backgroundColor: "var(--brand-blue)", color: "white" }}
                                                onClick={() => {
                                                    setSheetHeight(100)
                                                    setIsExpanded(true)
                                                }}
                                            >
                                                View promotions
                                            </Button>

                                            {
                                                isExpanded  && (
                                                    <PromotionsFromPlace placeId={selectedPlace.id} />
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}