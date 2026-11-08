"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  X,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

/**
 * Halaman /manage — Manajemen Tamu.
 *
 * Menampilkan semua RSVP yang masuk, dengan kemampuan:
 *  - Tambah tamu secara manual
 *  - Edit data tamu
 *  - Hapus tamu
 *  - Lihat statistik ringkas
 */

type Attendance = "hadir" | "tidak" | "ragu";

type RsvpEntry = {
  id: string;
  name: string;
  attendance: Attendance;
  guests: number;
  message: string | null;
  createdAt: string;
};

const ATTENDANCE_META: Record<Attendance, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  hadir: { label: "Hadir", color: "text-emerald-400", icon: CheckCircle2 },
  tidak: { label: "Tidak Hadir", color: "text-rose-400", icon: XCircle },
  ragu: { label: "Ragu-ragu", color: "text-amber-400", icon: HelpCircle },
};

const EMPTY_FORM = {
  name: "",
  attendance: "" as Attendance | "",
  guests: 1,
  message: "",
};

export default function ManagePage() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<RsvpEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rsvp", { cache: "no-store" });
      const data = await res.json();
      if (data.ok && Array.isArray(data.data)) {
        setEntries(data.data);
      }
    } catch {
      toast({ title: "Gagal memuat", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  // --- Statistik ---
  const stats = {
    total: entries.length,
    hadir: entries.filter((e) => e.attendance === "hadir").length,
    tidak: entries.filter((e) => e.attendance === "tidak").length,
    ragu: entries.filter((e) => e.attendance === "ragu").length,
    guests: entries
      .filter((e) => e.attendance === "hadir")
      .reduce((s, e) => s + e.guests, 0),
  };

  // --- Form handlers ---
  function openAdd() {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(entry: RsvpEntry) {
    setForm({
      name: entry.name,
      attendance: entry.attendance,
      guests: entry.guests,
      message: entry.message || "",
    });
    setEditingId(entry.id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: "Nama wajib diisi", variant: "destructive" });
      return;
    }
    if (!form.attendance) {
      toast({ title: "Pilih kehadiran", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const url = editingId ? `/api/rsvp/${editingId}` : "/api/rsvp";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          attendance: form.attendance,
          guests: form.guests,
          message: form.message.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Gagal");
      toast({
        title: editingId ? "Tamu diperbarui" : "Tamu ditambahkan",
      });
      closeForm();
      load();
    } catch (err) {
      toast({
        title: "Gagal menyimpan",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus tamu "${name}"?`)) return;
    try {
      const res = await fetch(`/api/rsvp/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Gagal");
      toast({ title: "Tamu dihapus" });
      load();
    } catch {
      toast({ title: "Gagal menghapus", variant: "destructive" });
    }
  }

  return (
    <main className="min-h-dvh bg-[#0A183F] text-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium tracking-[0.32em] uppercase text-white/70">
              Admin
            </p>
            <h1 className="font-script text-4xl text-white sm:text-5xl">
              Manajemen Tamu
            </h1>
            <p className="mt-1 text-xs font-light text-white/60">
              Dani &amp; Rika Wedding
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={load}
              variant="outline"
              size="icon"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              aria-label="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              onClick={openAdd}
              className="bg-[#2B51B0] text-white hover:bg-[#1E3B8C]"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Tambah
            </Button>
          </div>
        </header>

        {/* Statistik */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={Users} label="Total RSVP" value={stats.total} />
          <StatCard icon={CheckCircle2} label="Hadir" value={stats.hadir} color="text-emerald-400" />
          <StatCard icon={XCircle} label="Tidak Hadir" value={stats.tidak} color="text-rose-400" />
          <StatCard icon={Users} label="Jumlah Tamu" value={stats.guests} color="text-sky-400" />
        </div>

        {/* Daftar tamu */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-white/60" />
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center">
            <Users className="mx-auto h-10 w-10 text-white/30" />
            <p className="mt-3 text-sm text-white/60">
              Belum ada tamu. Klik &ldquo;Tambah&rdquo; untuk menambahkan.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map((entry) => {
              const meta = ATTENDANCE_META[entry.attendance];
              const Icon = meta.icon;
              return (
                <article
                  key={entry.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-script text-2xl text-white">
                          {entry.name}
                        </h3>
                        <span className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide ${meta.color}`}>
                          <Icon className="h-3 w-3" />
                          {meta.label}
                        </span>
                      </div>
                      {entry.message ? (
                        <p className="mt-1.5 text-xs font-light leading-relaxed text-white/70">
                          {entry.message}
                        </p>
                      ) : null}
                      <div className="mt-2 flex items-center gap-3 text-[10px] text-white/50">
                        <span>
                          {new Date(entry.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {entry.attendance === "hadir" ? (
                          <span>{entry.guests} tamu</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        onClick={() => openEdit(entry)}
                        aria-label={`Edit ${entry.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id, entry.name)}
                        aria-label={`Hapus ${entry.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 transition-colors hover:bg-rose-500/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal form tambah/edit */}
      {showForm ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={closeForm}
        >
          <div
            className="w-full max-w-md rounded-t-2xl border border-white/15 bg-[#132B66] p-5 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-script text-2xl text-white">
                {editingId ? "Edit Tamu" : "Tambah Tamu"}
              </h2>
              <button
                onClick={closeForm}
                aria-label="Tutup"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  Nama
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nama tamu"
                  maxLength={80}
                  className="border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-white/30"
                />
              </div>

              {/* Kehadiran */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  Kehadiran
                </Label>
                <RadioGroup
                  value={form.attendance}
                  onValueChange={(v) => setForm({ ...form, attendance: v as Attendance })}
                  className="grid grid-cols-1 gap-2"
                >
                  {(["hadir", "tidak", "ragu"] as Attendance[]).map((a) => (
                    <label
                      key={a}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white transition-colors hover:border-white/30 has-[:checked]:border-[#2B51B0] has-[:checked]:bg-white/10"
                    >
                      <RadioGroupItem value={a} className="border-white/40 text-[#2B51B0]" />
                      {ATTENDANCE_META[a].label}
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* Jumlah tamu */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  Jumlah Tamu
                </Label>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, guests: Math.max(1, form.guests - 1) })}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    &minus;
                  </button>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={form.guests}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (Number.isFinite(n))
                        setForm({ ...form, guests: Math.min(10, Math.max(1, Math.round(n))) });
                    }}
                    className="w-16 text-center border-white/20 bg-white/5 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, guests: Math.min(10, form.guests + 1) })}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Pesan */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  Ucapan / Catatan
                </Label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="(opsional)"
                  rows={2}
                  maxLength={1000}
                  className="resize-none border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-white/30"
                />
              </div>

              {/* Tombol */}
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  onClick={closeForm}
                  variant="outline"
                  className="flex-1 border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#2B51B0] text-white hover:bg-[#1E3B8C]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : editingId ? (
                    "Simpan"
                  ) : (
                    "Tambah"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}

/** Kartu statistik kecil */
function StatCard({
  icon: Icon,
  label,
  value,
  color = "text-white",
}: {
  icon: typeof Users;
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
      <Icon className={`h-4 w-4 ${color}`} />
      <p className="mt-1.5 text-2xl font-bold text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-white/50">{label}</p>
    </div>
  );
}
