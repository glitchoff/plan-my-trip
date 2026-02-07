"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

// Helper component to update map view
function MapUpdater({ source, destination }) {
    const map = useMap();

    useEffect(() => {
        if (source && destination) {
            const bounds = [
                [source.lat, source.lon],
                [destination.lat, destination.lon],
            ];
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (source) {
            map.flyTo([source.lat, source.lon], 13);
        } else if (destination) {
            map.flyTo([destination.lat, destination.lon], 13);
        }
    }, [source, destination, map]);

    return null;
}

export default function RouteMap({ source, destination }) {
    // Default center (e.g., center of US or World) if no points selected
    const defaultCenter = [20, 0];
    const defaultZoom = 2;

    const markers = [];
    if (source) markers.push({ position: [source.lat, source.lon], text: "From: " + source.name });
    if (destination) markers.push({ position: [destination.lat, destination.lon], text: "To: " + destination.name });

    const path = (source && destination) ? [
        [source.lat, source.lon],
        [destination.lat, destination.lon]
    ] : null;

    return (
        <div className="h-64 w-full rounded-xl overflow-hidden shadow-lg border border-base-200 mt-4 relative z-0">
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {markers.map((marker, idx) => (
                    <Marker key={idx} position={marker.position}>
                        <Popup>{marker.text}</Popup>
                    </Marker>
                ))}

                {path && <Polyline positions={path} color="blue" />}

                <MapUpdater source={source} destination={destination} />
            </MapContainer>
        </div>
    );
}
