'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  Search24Regular,
  Location24Filled,
  Navigation24Filled,
  Dismiss24Filled,
  Checkmark24Filled,
  Pin24Filled,
} from '@fluentui/react-icons';
import 'leaflet/dist/leaflet.css';

interface GeofenceMapPickerProps {
  latitude: number | null;
  longitude: number | null;
  radiusMeters: number;
  onChange: (lat: number, lng: number) => void;
  salonAddress?: string | null;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export function GeofenceMapPicker({
  latitude,
  longitude,
  radiusMeters,
  onChange,
  salonAddress,
}: GeofenceMapPickerProps) {
  const { t } = useTranslation();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  // Address search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [locatingCurrent, setLocatingCurrent] = useState(false);

  // Default coordinates (Miami / Coral Gables luxury beauty corridor if null, or passed lat/lng)
  const defaultLat = latitude ?? 25.7617;
  const defaultLng = longitude ?? -80.1918;

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = await import('leaflet');

      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const initialLat = latitude ?? defaultLat;
      const initialLng = longitude ?? defaultLng;
      const initialZoom = latitude && longitude ? 16 : 14;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: initialZoom,
        zoomControl: true,
      });

      // Clean OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Custom Electric Blue AirBook Salon Pin
      const customPinIcon = L.divIcon({
        className: 'airbook-geofence-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <div style="background-color: #2BB5FF; color: white; padding: 7px; border-radius: 9999px; box-shadow: 0 10px 20px -3px rgba(43, 181, 255, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.2); border: 2px solid #FFFFFF; display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
              </svg>
            </div>
            <div style="width: 2px; height: 6px; background-color: #2BB5FF;"></div>
            <div style="width: 10px; height: 4px; background-color: rgba(0,0,0,0.25); border-radius: 9999px;"></div>
          </div>
        `,
        iconSize: [36, 46],
        iconAnchor: [18, 46],
      });

      // Draggable Marker
      const marker = L.marker([initialLat, initialLng], {
        icon: customPinIcon,
        draggable: true,
      }).addTo(map);

      // Visual Geofence Circle
      const circle = L.circle([initialLat, initialLng], {
        radius: radiusMeters,
        color: '#2BB5FF',
        weight: 2,
        opacity: 0.85,
        fillColor: '#2BB5FF',
        fillOpacity: 0.16,
      }).addTo(map);

      // Handle marker drag
      marker.on('dragend', (e: any) => {
        const position = e.target.getLatLng();
        const newLat = Number(position.lat.toFixed(6));
        const newLng = Number(position.lng.toFixed(6));
        circle.setLatLng([newLat, newLng]);
        onChange(newLat, newLng);
      });

      // Handle map click
      map.on('click', (e: any) => {
        const newLat = Number(e.latlng.lat.toFixed(6));
        const newLng = Number(e.latlng.lng.toFixed(6));
        marker.setLatLng([newLat, newLng]);
        circle.setLatLng([newLat, newLng]);
        onChange(newLat, newLng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      circleRef.current = circle;
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker and circle when external coordinates or radius change
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current || !circleRef.current) return;

    if (latitude !== null && longitude !== null) {
      markerRef.current.setLatLng([latitude, longitude]);
      circleRef.current.setLatLng([latitude, longitude]);
      circleRef.current.setRadius(radiusMeters);
    }
  }, [latitude, longitude, radiusMeters]);

  // Handle address search via OpenStreetMap Nominatim
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery.trim()
        )}&limit=5`,
        {
          headers: {
            'Accept-Language': 'en,es,de,fr',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setShowDropdown(true);
      }
    } catch {
      // Fallback silently
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    const newLat = Number(parseFloat(result.lat).toFixed(6));
    const newLng = Number(parseFloat(result.lon).toFixed(6));

    onChange(newLat, newLng);
    setShowDropdown(false);
    setSearchQuery(result.display_name.split(',')[0]);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([newLat, newLng], 17, {
        duration: 1.2,
      });
      if (markerRef.current) markerRef.current.setLatLng([newLat, newLng]);
      if (circleRef.current) circleRef.current.setLatLng([newLat, newLng]);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) return;

    setLocatingCurrent(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentLat = Number(pos.coords.latitude.toFixed(6));
        const currentLng = Number(pos.coords.longitude.toFixed(6));

        onChange(currentLat, currentLng);
        setLocatingCurrent(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([currentLat, currentLng], 17, {
            duration: 1.2,
          });
          if (markerRef.current) markerRef.current.setLatLng([currentLat, currentLng]);
          if (circleRef.current) circleRef.current.setLatLng([currentLat, currentLng]);
        }
      },
      () => {
        setLocatingCurrent(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      {/* Search Bar & Location Controls */}
      <div className="relative">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
              <Search24Regular className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder={t('geofenceMapSearchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
              className="w-full h-10 pl-9 pr-9 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] placeholder-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-2 focus:ring-[#1A8EFF]/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowDropdown(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
                aria-label={t('clearSearch')}
              >
                <Dismiss24Filled className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="btn-secondary h-10 px-4 rounded-2xl text-xs font-bold disabled:opacity-50"
            >
              {isSearching ? (
                <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <Search24Regular className="w-4 h-4" />
              )}
              <span>{t('search')}</span>
            </button>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={locatingCurrent}
              title={t('geofenceUseCurrentLocation')}
              className="btn-secondary h-10 px-3 rounded-2xl text-xs font-bold disabled:opacity-50 flex items-center gap-1.5"
            >
              {locatingCurrent ? (
                <span className="animate-spin w-4 h-4 border-2 border-[#2BB5FF] border-t-transparent rounded-full" />
              ) : (
                <Navigation24Filled className="w-4 h-4 text-[#2BB5FF]" />
              )}
              <span className="hidden sm:inline">{t('geofenceMyGps')}</span>
            </button>
          </div>
        </form>

        {/* Search Results Autocomplete Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 sm:right-auto sm:w-[420px] mt-1.5 z-[100] rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xl overflow-hidden divide-y divide-[var(--border-subtle)]">
            {searchResults.map((result) => (
              <button
                key={result.place_id}
                type="button"
                onClick={() => handleSelectResult(result)}
                className="w-full px-3.5 py-2.5 text-left text-xs hover:bg-[var(--bg-secondary)] flex items-start gap-2.5 transition-colors"
              >
                <Location24Filled className="w-4 h-4 text-[#2BB5FF] flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2 text-[var(--text-primary)] font-medium">
                  {result.display_name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Leaflet Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-xs">
        <div ref={mapContainerRef} className="w-full h-72 sm:h-80 md:h-96 z-0" />

        {/* Overlay Instructions Badge */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-[400] px-3.5 py-2 rounded-xl bg-[var(--bg-primary)]/90 backdrop-blur-md border border-[var(--border-subtle)] shadow-md text-[11px] text-[var(--text-secondary)] flex items-center gap-2">
          <Pin24Filled className="w-4 h-4 text-[#2BB5FF] flex-shrink-0" />
          <span>{t('geofenceMapDragInstruction')}</span>
        </div>
      </div>
    </div>
  );
}
