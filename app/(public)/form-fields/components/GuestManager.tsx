"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

const API_BASE =
  process.env.NEXT_PUBLIC_API ?? "http://localhost:8888/backend/api";

interface Guest {
  id: number;
  guest_name: string;
  guest_slug: string;
  invite_token: string;
  link: string;
}

export interface GuestManagerProps {
  token: string;
  maxGuests: number;
  eventSlug: string;
  onPreview: () => void;
}

// ── Portal dropdown (overflow-hidden'dan kaçmak için) ────────────────────────
function DropdownPortal({
  anchorRef,
  onClose,
  children,
}: {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [pos, setPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right });

    const handler = (e: MouseEvent) => {
      if (anchorRef.current && anchorRef.current.contains(e.target as Node)) return;
      onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [anchorRef, onClose]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 9999 }}
      className="w-52 rounded-2xl border border-slate-100 bg-white py-1.5 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/5"
    >
      {children}
    </div>,
    document.body
  );
}

// ── Row action menu ──────────────────────────────────────────────────────────
function ActionMenu({
  guest,
  onDelete,
  deleting,
}: {
  guest: Guest;
  onDelete: (id: number) => void;
  deleting: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(guest.link);
      setCopied(true);
      setTimeout(() => { setCopied(false); setOpen(false); }, 1500);
    } catch { /* ignore */ }
  }, [guest.link]);

  const handleWhatsApp = useCallback(() => {
    const text = encodeURIComponent(
      `Merhaba ${guest.guest_name}! Sizi düğünümüze davet etmek istiyoruz 🎉\n${guest.link}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
    setOpen(false);
  }, [guest]);

  const handleDelete = useCallback(() => {
    setOpen(false);
    onDelete(guest.id);
  }, [guest.id, onDelete]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        disabled={deleting}
        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-40"
        aria-label="İşlemler"
      >
        {deleting ? (
          <span className="inline-block h-3 w-3 rounded-full border-2 border-slate-300 border-t-rose-500 animate-spin" />
        ) : (
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
            <circle cx="8" cy="2.5" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="8" cy="13.5" r="1.5" />
          </svg>
        )}
      </button>

      {open && (
        <DropdownPortal anchorRef={btnRef} onClose={() => setOpen(false)}>
          {/* Kopyala */}
          <button
            onClick={handleCopy}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 text-slate-500 text-sm">
              {copied ? "✓" : "⧉"}
            </span>
            <span>{copied ? "Kopyalandı!" : "Linki kopyala"}</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 text-sm font-bold">
              W
            </span>
            <span>WhatsApp ile paylaş</span>
          </button>

          <div className="my-1 mx-2 border-t border-slate-100" />

          {/* Sil */}
          <button
            onClick={handleDelete}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-50 text-rose-500 text-sm">
              ✕
            </span>
            <span>Davetliyi sil</span>
          </button>
        </DropdownPortal>
      )}
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function GuestManager({ token, maxGuests, eventSlug, onPreview }: GuestManagerProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const loadGuests = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/list_guests.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) setGuests(data.guests ?? []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { loadGuests(); }, [loadGuests]);

  const handleAdd = useCallback(async () => {
    const name = input.trim();
    if (!name) return;
    setAdding(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/add_guest.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, guest_name: name }),
      });
      const data = await res.json();
      if (data.success) {
        setGuests((prev) => [...prev, {
          id: data.guestId,
          guest_name: data.guestName,
          guest_slug: data.slug,
          invite_token: "",
          link: data.link,
        }]);
        setInput("");
      } else {
        setError(data.error ?? "Davetli eklenemedi.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setAdding(false);
    }
  }, [token, input]);

  const handleDelete = useCallback(async (guestId: number) => {
    setDeletingId(guestId);
    try {
      const res = await fetch(`${API_BASE}/delete_guest.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, guest_id: guestId }),
      });
      const data = await res.json();
      if (data.success) setGuests((prev) => prev.filter((g) => g.id !== guestId));
    } catch { /* ignore */ }
    finally { setDeletingId(null); }
  }, [token]);

  const handleCopyAll = useCallback(async () => {
    const text = guests.map((g) => `${g.guest_name}: ${g.link}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2000);
    } catch { /* ignore */ }
  }, [guests]);

  const usedGuests = guests.length;
  const remaining = maxGuests - usedGuests;
  const pct = maxGuests > 0 ? Math.round((usedGuests / maxGuests) * 100) : 0;

  return (
    <div className="space-y-4">

      {/* Başlık + kapasite */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Davetliler</h3>
          <p className="text-xs text-slate-400 mt-0.5">Her davetli için kişisel link oluşturulur</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${pct > 90 ? "bg-rose-400" : "bg-emerald-400"}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 tabular-nums">
            <span className="font-semibold text-slate-800">{usedGuests}</span>/{maxGuests}
          </span>
        </div>
      </div>

      {/* Önizle */}
      <button
        onClick={onPreview}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-500 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Davetiyeyi önizle ↗
      </button>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Davetli adı veya aile adı…"
          disabled={adding || remaining <= 0}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 disabled:opacity-50 transition"
        />
        <button
          onClick={handleAdd}
          disabled={adding || !input.trim() || remaining <= 0}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-40 hover:shadow-md transition-all"
        >
          {adding ? (
            <span className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          ) : (
            <><span className="text-base leading-none">+</span> Ekle</>
          )}
        </button>
      </div>

      {error && (
        <p className="rounded-xl bg-rose-50 border border-rose-100 px-3.5 py-2 text-xs text-rose-600">{error}</p>
      )}

      {remaining <= 0 && (
        <p className="rounded-xl bg-amber-50 border border-amber-100 px-3.5 py-2 text-xs text-amber-700">
          Limit doldu ({maxGuests}/{maxGuests}). Daha fazlası için paketi yükseltin.
        </p>
      )}

      {/* Liste */}
      <div className="rounded-xl border border-slate-100">
        {loading ? (
          <div className="py-10 flex flex-col items-center gap-2 text-slate-400">
            <span className="inline-block h-5 w-5 rounded-full border-2 border-slate-200 border-t-violet-500 animate-spin" />
            <span className="text-xs">Yükleniyor…</span>
          </div>
        ) : guests.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-2xl mb-2">👥</p>
            <p className="text-sm font-medium text-slate-500">Henüz davetli yok</p>
            <p className="text-xs text-slate-400 mt-1">Yukarıdan isim girerek başlayın</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {guests.map((guest) => (
              <div
                key={guest.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/60 transition-colors"
              >
                <span className="flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-pink-400 text-white text-xs font-semibold">
                  {guest.guest_name.charAt(0).toUpperCase()}
                </span>
                <span className="flex-1 text-sm font-medium text-slate-800 truncate">{guest.guest_name}</span>
                <ActionMenu
                  guest={guest}
                  onDelete={handleDelete}
                  deleting={deletingId === guest.id}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tüm linkleri kopyala — sadece 2+ davetlide görünür */}
      {guests.length > 1 && (
        <button
          onClick={handleCopyAll}
          className="w-full rounded-xl border border-slate-200 py-2 text-xs font-medium transition-colors hover:bg-slate-50 hover:text-slate-700"
        >
          {allCopied
            ? "✓ Tüm linkler kopyalandı!"
            : `Tüm davetli linklerini kopyala (${guests.length} kişi)`}
        </button>
      )}
    </div>
  );
}
