// app/components/MapPicker.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  mapLat: number | null | undefined;
  mapLng: number | null | undefined;
  onChange: (lat: number, lng: number) => void;
  onAddressChange?: (label: string) => void;
};

type SearchResult = {
  name: string;
  formatted_address: string;
  lat: number;
  lng: number;
};

export function MapPicker({
  mapLat,
  mapLng,
  onChange,
  onAddressChange,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any | null>(null);
  const markerRef = useRef<any | null>(null);
  const geocoderRef = useRef<any | null>(null);

  const [selectedLabel, setSelectedLabel] = useState<string>("Konum seçilmedi");

  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Google Maps script yükleyici
  useEffect(() => {
    if (typeof window === "undefined") return;

    const w = window as any;

    // Zaten yüklenmişse
    if (w.google && w.google.maps) {
      setIsMapReady(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-google-maps="true"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => setIsMapReady(true));
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDvaqX68_7IB96qD8T7SKJnTPhLYHgenm0&language=tr&libraries=places";

    script.async = true;
    script.defer = true;
    script.setAttribute("data-google-maps", "true");
    script.onload = () => setIsMapReady(true);
    script.onerror = () => {
      console.error("Google Maps script yüklenemedi");
      setSearchError("Harita servisi yüklenemedi.");
    };
    document.head.appendChild(script);
  }, []);

  // Haritayı ilk kez oluştur
  useEffect(() => {
    if (!isMapReady) return;
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;
    if (typeof window === "undefined") return;

    const w = window as any;
    if (!w.google || !w.google.maps) return;

    const g = w.google;

    const initialLat = mapLat ?? 41.0082; // İstanbul
    const initialLng = mapLng ?? 28.9784;

    const center = new g.maps.LatLng(initialLat, initialLng);

    const map = new g.maps.Map(mapContainerRef.current, {
      center,
      zoom: 18,
      clickableIcons: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });

    let marker: any | null = null;

    if (mapLat != null && mapLng != null) {
      marker = new g.maps.Marker({
        position: new g.maps.LatLng(mapLat, mapLng),
        map,
      });
    }

    const geocoder = new g.maps.Geocoder();
    geocoderRef.current = geocoder;
    markerRef.current = marker;
    mapRef.current = map;

    // Haritaya tıklayınca konum seç
    map.addListener("click", (e: any) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      if (markerRef.current) {
        markerRef.current.setPosition(e.latLng);
      } else {
        markerRef.current = new g.maps.Marker({
          position: e.latLng,
          map,
        });
      }

      onChange(lat, lng);

      geocoder.geocode(
        { location: e.latLng },
        (geocodeResults: any, status: string) => {
          if (status === "OK" && geocodeResults && geocodeResults[0]) {
            const addr = geocodeResults[0].formatted_address as string;
            setSelectedLabel(addr);
            onAddressChange?.(addr);
          } else {
            console.warn("Geocode başarısız:", status);
            const fallback = "Adres bulunamadı";
            setSelectedLabel(fallback);
            onAddressChange?.(fallback);
          }
        }
      );
    });

    return () => {
      mapRef.current = null;
      markerRef.current = null;
      geocoderRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapReady]);

  // mapLat/mapLng dışarıdan değişirse haritayı güncelle
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapLat == null || mapLng == null) return;
    if (typeof window === "undefined") return;

    const w = window as any;
    if (!w.google || !w.google.maps) return;
    const g = w.google;

    const map = mapRef.current;
    const pos = new g.maps.LatLng(mapLat, mapLng);
    map.setCenter(pos);

    if (markerRef.current) {
      markerRef.current.setPosition(pos);
    } else {
      markerRef.current = new g.maps.Marker({
        position: pos,
        map,
      });
    }
  }, [mapLat, mapLng]);

  // Google Places arama
  const handleSearch = async (qParam?: string) => {
    const q = (qParam ?? query).trim();
    if (!q) {
      setResults([]);
      setSearchError(null);
      return;
    }

    if (!isMapReady) {
      setSearchError(
        "Harita yükleniyor, lütfen bir saniye sonra tekrar deneyin."
      );
      return;
    }

    if (!mapRef.current || typeof window === "undefined") {
      setSearchError("Harita hazır değil.");
      return;
    }

    const w = window as any;
    if (!w.google || !w.google.maps || !w.google.maps.places) {
      setSearchError("Harita arama servisi hazır değil.");
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const g = w.google;
      const service = new g.maps.places.PlacesService(mapRef.current);

      const request = {
        query: q,
        location: new g.maps.LatLng(39.9208, 32.8541), // Ankara civarı
        radius: 50000,
      };

      service.textSearch(
        request,
        (placeResults: any[] | null, status: string) => {
          if (
            status !== g.maps.places.PlacesServiceStatus.OK ||
            !placeResults ||
            placeResults.length === 0
          ) {
            console.warn("Places search status:", status, placeResults);
            setResults([]);
            setSearchError("Eşleşen mekan bulunamadı.");
            setIsSearching(false);
            return;
          }

          const mapped: SearchResult[] = placeResults.map((p) => ({
            name: p.name as string,
            formatted_address: (p.formatted_address || "") as string,
            lat: p.geometry?.location?.lat(),
            lng: p.geometry?.location?.lng(),
          }));

          setResults(mapped);
          setIsSearching(false);
        }
      );
    } catch (e) {
      console.error("Google Places search error", e);
      setSearchError("Mekan ararken bir hata oluştu.");
      setResults([]);
      setIsSearching(false);
    }
  };

  // Yazarken 400ms debounce ile ara
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setSearchError(null);
      return;
    }

    const id = setTimeout(() => {
      handleSearch(q);
    }, 400);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSelectResult = (result: SearchResult) => {
    if (!mapRef.current || Number.isNaN(result.lat) || Number.isNaN(result.lng))
      return;
    if (typeof window === "undefined") return;

    const w = window as any;
    if (!w.google || !w.google.maps) return;
    const g = w.google;

    const map = mapRef.current;
    const pos = new g.maps.LatLng(result.lat, result.lng);

    map.setCenter(pos);
    map.setZoom(16);

    if (markerRef.current) {
      markerRef.current.setPosition(pos);
    } else {
      markerRef.current = new g.maps.Marker({
        position: pos,
        map,
      });
    }

    const label = `${result.name} – ${result.formatted_address}`;
    setSelectedLabel(label);
    onChange(result.lat, result.lng);
    onAddressChange?.(label);

    setResults([]);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="mb-3 text-xs">
      <label className="block mb-1 text-xs font-medium text-slate-700">
        Haritada Konum Seç
      </label>
      <p className="text-[0.7rem] text-slate-500 mb-2">
        Arama bölümünden <b>mekan</b> veya <b>konum</b> arayabilirsiniz.
        Seçtiğiniz yer, davetiyenizdeki haritaya ve yukarıdaki adres alanına otomatik
        olarak eklenecektir.
      </p>

      {/* Arama alanı */}
      <div className="mb-2 flex gap-1.5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Örn: Vedat Dalokay Nikah Salonu"
          className="flex-1 px-2.5 py-1.5 rounded-full border border-slate-200 bg-white text-[0.75rem] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
        />
        <button
          type="button"
          onClick={() => handleSearch()}
          disabled={isSearching}
          className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-900 text-white text-[0.7rem] font-medium disabled:opacity-60 disabled:cursor-wait"
        >
          {isSearching ? "Aranıyor…" : "Ara"}
        </button>
      </div>

      {/* Arama sonuçları */}
      {results.length > 0 && (
        <div className="mb-2 rounded-2xl border border-slate-200 bg-white shadow-sm max-h-40 overflow-y-auto">
          {results.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectResult(item)}
              className="w-full text-left px-3 py-2 text-[0.7rem] hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
            >
              <div className="font-medium text-slate-800">{item.name}</div>
              <div className="text-slate-500 text-[0.65rem]">
                {item.formatted_address}
              </div>
            </button>
          ))}
        </div>
      )}

      {searchError && (
        <p className="mb-2 text-[0.7rem] text-red-500">{searchError}</p>
      )}

      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
        <div
          ref={mapContainerRef}
          className="w-full"
          style={{ height: 220, opacity: isMapReady ? 1 : 0.4 }}
        />
        <div
          className={
            "px-3 py-2 flex items-center justify-between " +
            (mapLat != null && mapLng != null
              ? "bg-emerald-50 border-t border-emerald-100"
              : "bg-white")
          }
        >
          <div className="flex items-center gap-2">
            <span
              className={
                "inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.6rem] " +
                (mapLat != null && mapLng != null
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-900 text-white")
              }
            >
              {mapLat != null && mapLng != null ? "✓" : "ⓘ"}
            </span>
            <span className="text-[0.7rem] text-slate-700">
              {selectedLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
