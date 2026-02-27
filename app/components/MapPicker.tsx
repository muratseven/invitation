// app/components/MapPicker.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import L, {
  Map as LeafletMap,
  Marker as LeafletMarker,
  LeafletMouseEvent,
} from "leaflet";

type Props = {
  mapLat: number | null | undefined;
  mapLng: number | null | undefined;
  onChange: (lat: number, lng: number) => void;
};

type SearchResult = {
  display_name: string;
  lat: string;
  lon: string;
};

export function MapPicker({ mapLat, mapLng, onChange }: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>("Konum seçilmedi");

  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Leaflet default icon fix (Next.js / bundler ortamı için)
  useEffect(() => {
    // @ts-ignore
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  // Haritayı ilk kez oluştur
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialLat = mapLat ?? 41.0082; // İstanbul
    const initialLng = mapLng ?? 28.9784;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap katkıda bulunanlar",
    }).addTo(map);

    // Mevcut konum varsa marker koy
    if (mapLat != null && mapLng != null) {
      const marker = L.marker([mapLat, mapLng]).addTo(map);
      markerRef.current = marker;
      setSelectedLabel("Konum seçildi");
    }

    // Haritaya tıklanınca marker güncelle
    map.on("click", (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }

      setSelectedLabel("Konum seçildi");
      onChange(lat, lng);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dışarıdan gelen mapLat/mapLng değişirse haritayı güncelle
  useEffect(() => {
    if (!mapRef.current || mapLat == null || mapLng == null) return;

    const map = mapRef.current;

    map.setView([mapLat, mapLng], map.getZoom());

    if (markerRef.current) {
      markerRef.current.setLatLng([mapLat, mapLng]);
    } else {
      markerRef.current = L.marker([mapLat, mapLng]).addTo(map);
    }

    setSelectedLabel("Konum seçildi");
  }, [mapLat, mapLng]);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      // Nominatim / OSM araması – Türkiye odaklı “viewbox” ile biraz sınırlandırabiliriz
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("q", q);
      url.searchParams.set("format", "json");
      url.searchParams.set("addressdetails", "0");
      url.searchParams.set("limit", "5");
      // İstersen Türkiye'ye yakın alanla sınırla (optional)
      // url.searchParams.set("countrycodes", "tr");

      const res = await fetch(url.toString(), {
        headers: {
          "Accept-Language": "tr",
        },
      });

      if (!res.ok) {
        throw new Error("Arama isteği başarısız");
      }

      const data = (await res.json()) as SearchResult[];

      setResults(data);
      if (data.length === 0) {
        setSearchError("Eşleşen mekan bulunamadı.");
      }
    } catch (e) {
      console.error("Map search error", e);
      setSearchError("Mekan ararken bir hata oluştu.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    const lat = Number(result.lat);
    const lng = Number(result.lon);
    if (!mapRef.current || Number.isNaN(lat) || Number.isNaN(lng)) return;

    const map = mapRef.current;
    map.setView([lat, lng], 16);

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(map);
    }

    setSelectedLabel(result.display_name);
    onChange(lat, lng);
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
        Haritanın üzerinde dokunup tıklayarak veya aşağıdaki arama alanından
        mekanın adını yazarak yer seçebilirsiniz. İğnenin konumu davetiyedeki
        haritada ve davetlilerin linklerinde kullanılacak.
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
          onClick={handleSearch}
          disabled={isSearching}
          className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-900 text-white text-[0.7rem] font-medium disabled:opacity-60 disabled:cursor-wait"
        >
          {isSearching ? "Aranıyor…" : "Ara"}
        </button>
      </div>

      {/* Arama sonuçları */}
      {results.length > 0 && (
        <div className="mb-2 rounded-2xl border border-slate-200 bg-white shadow-sm max-h-40 overflow-y-auto">
          {results.map((item) => (
            <button
              key={`${item.lat}-${item.lon}-${item.display_name}`}
              type="button"
              onClick={() => handleSelectResult(item)}
              className="w-full text-left px-3 py-2 text-[0.7rem] hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
            >
              {item.display_name}
            </button>
          ))}
        </div>
      )}
      {searchError && (
        <p className="mb-2 text-[0.7rem] text-red-500">{searchError}</p>
      )}

      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
        <div ref={mapContainerRef} className="w-full" style={{ height: 220 }} />
        <div className="px-3 py-2 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white text-[0.6rem]">
              ⓘ
            </span>
            <span className="text-[0.7rem] text-slate-600">
              {selectedLabel}
            </span>
          </div>
          {mapLat != null && mapLng != null && (
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 text-[0.65rem] text-slate-500">
              Haritadan seçildi
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
