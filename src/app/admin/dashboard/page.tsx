"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import {
  Calendar,
  Building,
  DollarSign,
  Settings as SettingsIcon,
  PlusCircle,
  Users,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

interface AdminBooking {
  bookingId: string;
  createdAt: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  guests?: string;
  rooms?: Array<{ roomId: string; guests: number }>;
  arrivalTime?: string;
  roomId?: string;
  total: number;
  specialRequest?: string;
  status?: string;
  paymentStatus?: "Pending" | "Paid" | "Failed" | "Refunded" | string;
  paymentMethod?: string;
  payuTxnId?: string;
  payuMihpayid?: string;
  source?: "online" | "offline";
  whatsappOptIn?: boolean;
  notes?: string;
}

interface AdminRoom {
  id: string;
  name: string;
  category: string;
  description: string;
  amenities: string[];
  size?: string;
  capacity: string;
  price: string;
  inventory?: number;
  imageUrl?: string;
  imageKey?: string;
  imageAlt?: string;
  gallery?: string[];
}

interface OccupyingBooking {
  bookingId: string;
  guestName: string;
  guestPhone?: string;
  source: "online" | "offline";
  checkIn: string;
  checkOut: string;
  deluxeRooms: number;
  premiumRooms: number;
  total: number;
  notes?: string;
}

interface OccupancyDay {
  date: string;
  dayOfWeek: string;
  deluxe: {
    total: number;
    occupied: number;
    available: number;
    isFull: boolean;
  };
  premium: {
    total: number;
    occupied: number;
    available: number;
    isFull: boolean;
  };
  overall?: {
    total: number;
    occupied: number;
    available: number;
    isFull: boolean;
  };
  total?: {
    capacity?: number;
    occupied?: number;
    available?: number;
    isFull?: boolean;
  };
  bookings: OccupyingBooking[];
}

function getOverallStats(day: OccupancyDay | null | undefined) {
  if (!day) return { occupied: 0, total: 19, available: 19, isFull: false };
  const deluxeOcc = day.deluxe?.occupied ?? 0;
  const premiumOcc = day.premium?.occupied ?? 0;
  const occupied = day.overall?.occupied ?? day.total?.occupied ?? deluxeOcc + premiumOcc;
  const total = day.overall?.total ?? day.total?.capacity ?? 19;
  const available = day.overall?.available ?? day.total?.available ?? Math.max(0, total - occupied);
  const isFull = day.overall?.isFull ?? occupied >= total;
  return { occupied, total, available, isFull };
}

interface OccupancyData {
  summary: {
    grandTotalRooms?: number;
    deluxeTotal?: number;
    premiumTotal?: number;
    grandTotal?: number;
    startDate?: string;
    days?: number;
  };
  timeline: OccupancyDay[];
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"bookings" | "occupancy" | "rooms" | "settings">(
    "bookings",
  );
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Bookings state
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingFilterSource, setBookingFilterSource] = useState<"all" | "online" | "offline">(
    "all",
  );

  // Rooms state
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState<string | null>(null);

  // Room editing state
  const [editingRoom, setEditingRoom] = useState<AdminRoom | null>(null);
  const [roomPrice, setRoomPrice] = useState("");
  const [roomInventory, setRoomInventory] = useState(14);
  const [updateRoomError, setUpdateRoomError] = useState<string | null>(null);
  const [updateRoomSuccess, setUpdateRoomSuccess] = useState<string | null>(null);

  // Settings state
  const [isCouponLive, setIsCouponLive] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [marqueeText, setMarqueeText] = useState("");
  const [settingsStatus, setSettingsStatus] = useState("");

  // Occupancy state
  const [occupancyData, setOccupancyData] = useState<OccupancyData | null>(null);
  const [occupancyLoading, setOccupancyLoading] = useState(false);
  const [occupancyError, setOccupancyError] = useState<string | null>(null);
  const [occupancyStartDate, setOccupancyStartDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [occupancyDays, setOccupancyDays] = useState(30);
  const [selectedDayDetails, setSelectedDayDetails] = useState<OccupancyDay | null>(null);

  // Offline Booking Modal state
  const [offlineModalOpen, setOfflineModalOpen] = useState(false);
  const [offlineGuestName, setOfflineGuestName] = useState("");
  const [offlineGuestPhone, setOfflineGuestPhone] = useState("");
  const [offlineGuestEmail, setOfflineGuestEmail] = useState("");
  const [offlineRoomId, setOfflineRoomId] = useState("lotus-sanctuary");
  const [offlineRoomCount, setOfflineRoomCount] = useState(1);
  const [offlineGuestsPerRoom, setOfflineGuestsPerRoom] = useState(2);
  const [offlineCheckIn, setOfflineCheckIn] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [offlineCheckOut, setOfflineCheckOut] = useState(() => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    return tmrw.toISOString().split("T")[0];
  });
  const [offlineTotal, setOfflineTotal] = useState("");
  const [offlineNotes, setOfflineNotes] = useState("");
  const [offlineSubmitting, setOfflineSubmitting] = useState(false);
  const [offlineError, setOfflineError] = useState<string | null>(null);
  const [offlineSuccess, setOfflineSuccess] = useState<string | null>(null);

  // Gallery viewing modal
  const [activeGalleryRoom, setActiveGalleryRoom] = useState<AdminRoom | null>(null);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);

  // Check auth
  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) {
      router.push("/admin/login");
    } else {
      setToken(storedToken);
      setLoading(false);
    }
  }, [router]);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    if (!token) return;
    setBookingsLoading(true);
    setBookingsError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load bookings");
      setBookings(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error fetching bookings";
      setBookingsError(msg);
    } finally {
      setBookingsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && activeTab === "bookings") {
      fetchBookings();
    }
  }, [token, activeTab, fetchBookings]);

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
    if (!token) return;
    setRoomsLoading(true);
    setRoomsError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load rooms");
      setRooms(data);
      if (data.length > 0 && !editingRoom) {
        startEditRoom(data[0]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error fetching rooms";
      setRoomsError(msg);
    } finally {
      setRoomsLoading(false);
    }
  }, [token, editingRoom]);

  useEffect(() => {
    if (token && (activeTab === "rooms" || activeTab === "occupancy")) {
      fetchRooms();
    }
  }, [token, activeTab, fetchRooms]);

  // Fetch occupancy
  const fetchOccupancy = useCallback(
    async (startDate = occupancyStartDate, days = occupancyDays) => {
      if (!token) return;
      setOccupancyLoading(true);
      setOccupancyError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/occupancy?startDate=${startDate}&days=${days}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load occupancy timeline");
        setOccupancyData(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error fetching occupancy";
        setOccupancyError(msg);
      } finally {
        setOccupancyLoading(false);
      }
    },
    [token, occupancyStartDate, occupancyDays],
  );

  useEffect(() => {
    if (token && activeTab === "occupancy") {
      fetchOccupancy(occupancyStartDate, occupancyDays);
    }
  }, [token, activeTab, occupancyStartDate, occupancyDays, fetchOccupancy]);

  // Fetch settings
  useEffect(() => {
    if (activeTab === "settings" && token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setIsCouponLive(data.isCouponLive || false);
          setCouponCode(data.couponCode || "");
          setDiscountPercentage(data.discountPercentage || 0);
          setMarqueeText(data.marqueeText || "");
        })
        .catch(() => setSettingsStatus("Failed to load settings."));
    }
  }, [activeTab, token]);

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSettingsStatus("Saving...");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isCouponLive, couponCode, discountPercentage, marqueeText }),
      });
      if (res.ok) setSettingsStatus("Settings saved successfully!");
      else setSettingsStatus("Failed to save settings.");
    } catch {
      setSettingsStatus("Error saving settings.");
    }
    setTimeout(() => setSettingsStatus(""), 3500);
  }

  function handleLogout() {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  }

  // Cancel booking
  async function handleCancelBooking(bookingId: string) {
    if (!confirm(`Are you sure you want to cancel booking ${bookingId}?`)) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/bookings/${bookingId}/cancel`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel booking");

      setBookings((prev) =>
        prev.map((b) => (b.bookingId === bookingId ? { ...b, status: "Cancelled" } : b)),
      );
      if (activeTab === "occupancy") fetchOccupancy();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel booking";
      alert(msg);
    }
  }

  // Start editing a room's price/inventory
  function startEditRoom(room: AdminRoom) {
    setEditingRoom(room);
    setRoomPrice(room.price.replace(/[^0-9]/g, "") || "1500");
    setRoomInventory(
      room.inventory !== undefined
        ? room.inventory
        : room.id === "lotus-sanctuary" || room.category === "Deluxe"
          ? 14
          : 5,
    );
    setUpdateRoomError(null);
    setUpdateRoomSuccess(null);
  }

  // Handle Update Room Rate
  async function handleUpdateRoomPrice(e: React.FormEvent) {
    e.preventDefault();
    if (!editingRoom) return;

    setUpdateRoomError(null);
    setUpdateRoomSuccess(null);

    const numericPrice = parseInt(roomPrice.replace(/[^0-9]/g, ""), 10);
    if (!numericPrice || isNaN(numericPrice) || numericPrice <= 0) {
      setUpdateRoomError("Please enter a valid positive room price per night.");
      return;
    }

    try {
      const formattedPrice = `₹${numericPrice.toLocaleString("en-IN")}`;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/rooms/${editingRoom.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editingRoom.name,
            category: editingRoom.category,
            price: formattedPrice,
            inventory: Number(roomInventory) || 14,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update room price");

      setUpdateRoomSuccess(`Price updated to ${formattedPrice} / night successfully!`);
      setRooms((prev) => prev.map((r) => (r.id === editingRoom.id ? data.room : r)));
      setEditingRoom(data.room);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update room price.";
      setUpdateRoomError(msg);
    }
  }

  // Execute delete room
  async function executeDeleteRoom(roomId: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/rooms/${roomId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete room");

      setRooms((prev) => prev.filter((r) => r.id !== roomId));
      if (editingRoom?.id === roomId) setEditingRoom(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete room.");
    }
  }

  // Quick price adjustment helper
  function adjustPriceBy(delta: number) {
    const cur = parseInt(roomPrice.replace(/[^0-9]/g, ""), 10) || 1500;
    const next = Math.max(500, cur + delta);
    setRoomPrice(String(next));
  }

  // Calculate default estimated total for offline booking
  useEffect(() => {
    const selectedRoom = rooms.find((r) => r.id === offlineRoomId);
    if (!selectedRoom || !offlineCheckIn || !offlineCheckOut) return;

    const ci = new Date(offlineCheckIn).getTime();
    const co = new Date(offlineCheckOut).getTime();
    const nights = Math.max(1, Math.round((co - ci) / 86400000));
    const base = parseInt(selectedRoom.price.replace(/[^0-9]/g, ""), 10) || 1500;
    const total = base * offlineRoomCount * nights;
    setOfflineTotal(String(total));
  }, [offlineRoomId, offlineRoomCount, offlineCheckIn, offlineCheckOut, rooms]);

  // Handle Offline Booking Submission
  async function handleCreateOfflineBooking(e: React.FormEvent) {
    e.preventDefault();
    if (
      !offlineGuestName.trim() ||
      !offlineGuestPhone.trim() ||
      !offlineCheckIn ||
      !offlineCheckOut
    ) {
      setOfflineError("Please fill in Guest Name, Phone Number, Check-In, and Check-Out dates.");
      return;
    }

    setOfflineSubmitting(true);
    setOfflineError(null);
    setOfflineSuccess(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/bookings/offline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          guestName: offlineGuestName.trim(),
          guestPhone: offlineGuestPhone.trim(),
          guestEmail: offlineGuestEmail.trim(),
          roomId: offlineRoomId,
          roomCount: Number(offlineRoomCount) || 1,
          guestsPerRoom: Number(offlineGuestsPerRoom) || 2,
          checkIn: offlineCheckIn,
          checkOut: offlineCheckOut,
          total: offlineTotal ? Number(offlineTotal) : undefined,
          notes: offlineNotes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create offline booking");
      }

      setOfflineSuccess(
        `Offline Booking created successfully! Confirmation ID: ${data.booking?.bookingId}`,
      );

      // Refresh data
      fetchBookings();
      fetchOccupancy();

      setTimeout(() => {
        setOfflineModalOpen(false);
        setOfflineSuccess(null);
        setOfflineGuestName("");
        setOfflineGuestPhone("");
        setOfflineGuestEmail("");
        setOfflineNotes("");
      }, 1600);
    } catch (err: unknown) {
      setOfflineError(err instanceof Error ? err.message : "Failed to create offline booking.");
    } finally {
      setOfflineSubmitting(false);
    }
  }

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilterSource !== "all") {
      const bSource = b.source || "online";
      if (bSource !== bookingFilterSource) return false;
    }
    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase();
      const matchId = b.bookingId.toLowerCase().includes(q);
      const matchName = b.guestName.toLowerCase().includes(q);
      const matchPhone = b.guestPhone?.toLowerCase().includes(q);
      const matchEmail = b.guestEmail?.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone && !matchEmail) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brown text-ivory">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gold border-r-2 mx-auto mb-4" />
          <span className="eyebrow text-gold text-xs tracking-widest">LOADING SESSION...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-ivory text-brown flex flex-col font-sans">
      {/* Admin Header */}
      <header className="bg-brown text-ivory py-4 px-5 sm:px-8 lg:px-16 flex items-center justify-between border-b border-gold/15 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-6">
          <BrandLogo tone="ivory" size="sm" showTagline={false} />
          <div className="h-6 w-px bg-gold/30 hidden sm:block" />
          <span className="eyebrow text-gold text-[10px] tracking-widest hidden sm:block">
            ADMINISTRATOR PORTAL
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setOfflineModalOpen(true)}
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-brown font-semibold eyebrow text-[10px] px-3.5 py-2 transition-all shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />+ ADD OFFLINE BOOKING
          </button>
          <button
            onClick={handleLogout}
            className="eyebrow border border-gold/40 text-gold px-3.5 py-2 hover:bg-gold hover:text-brown transition-colors text-[10px]"
          >
            LOG OUT
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-brown/8 px-5 sm:px-8 lg:px-16 py-3 flex gap-4 sm:gap-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`eyebrow text-[11px] pb-2 transition-all inline-flex items-center gap-2 shrink-0 ${
            activeTab === "bookings"
              ? "text-gold border-b-2 border-gold font-semibold"
              : "text-brown/50 hover:text-brown"
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          Bookings Management
          <span className="ml-1 bg-brown/8 text-brown/70 text-[9px] px-2 py-0.5 rounded-full font-mono font-normal">
            {bookings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("occupancy")}
          className={`eyebrow text-[11px] pb-2 transition-all inline-flex items-center gap-2 shrink-0 ${
            activeTab === "occupancy"
              ? "text-gold border-b-2 border-gold font-semibold"
              : "text-brown/50 hover:text-brown"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Occupancy &amp; Calendar (19 Rooms)
        </button>

        <button
          onClick={() => setActiveTab("rooms")}
          className={`eyebrow text-[11px] pb-2 transition-all inline-flex items-center gap-2 shrink-0 ${
            activeTab === "rooms"
              ? "text-gold border-b-2 border-gold font-semibold"
              : "text-brown/50 hover:text-brown"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          Room Rates &amp; Demand Pricing
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`eyebrow text-[11px] pb-2 transition-all inline-flex items-center gap-2 shrink-0 ${
            activeTab === "settings"
              ? "text-gold border-b-2 border-gold font-semibold"
              : "text-brown/50 hover:text-brown"
          }`}
        >
          <SettingsIcon className="w-3.5 h-3.5" />
          Site Settings &amp; Offers
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-5 sm:px-8 lg:px-16 py-8 max-w-7xl w-full mx-auto">
        {/* ── TAB 1: BOOKINGS MANAGEMENT ── */}
        {activeTab === "bookings" && (
          <section className="animate-fade-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-brown/10 pb-4">
              <div>
                <span className="eyebrow text-gold text-[10px]">ALL RESERVATIONS</span>
                <h2 className="font-display text-3xl mt-0.5">Bookings Received</h2>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search by guest, ID, phone..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="border border-brown/15 px-3 py-1.5 text-xs bg-white text-brown focus:border-gold outline-none rounded-none w-full sm:w-60"
                />

                <select
                  value={bookingFilterSource}
                  onChange={(e) =>
                    setBookingFilterSource(e.target.value as "all" | "online" | "offline")
                  }
                  className="border border-brown/15 px-3 py-1.5 text-xs bg-white text-brown focus:border-gold outline-none"
                >
                  <option value="all">All Sources</option>
                  <option value="online">🌐 Online Direct</option>
                  <option value="offline">🏢 Offline / Walk-in</option>
                </select>

                <button
                  onClick={() => fetchBookings()}
                  className="p-1.5 border border-brown/15 hover:bg-brown/5 text-brown/60 transition-colors"
                  title="Refresh bookings"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {bookingsError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 mb-6 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bookingsError}</span>
              </div>
            )}

            {bookingsLoading ? (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gold border-r-2 mx-auto mb-4" />
                <span className="eyebrow text-gold text-xs">FETCHING RESERVATIONS...</span>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white border border-brown/10 p-12 text-center text-taupe text-sm">
                No bookings match your current filter.
              </div>
            ) : (
              <div className="bg-white border border-brown/10 overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-brown/5 border-b border-brown/10 eyebrow text-[9px] text-brown/60">
                      <th className="p-4">BOOKING ID &amp; SOURCE</th>
                      <th className="p-4">GUEST CONTACT</th>
                      <th className="p-4">STAY DATES</th>
                      <th className="p-4">ROOMS &amp; TOTAL</th>
                      <th className="p-4">STATUS &amp; PAYMENT</th>
                      <th className="p-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brown/8 text-brown/80">
                    {filteredBookings.map((b) => {
                      const isOffline = b.source === "offline";
                      const cleanPhone = b.guestPhone ? b.guestPhone.replace(/\D/g, "") : "";
                      const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

                      return (
                        <tr key={b.bookingId} className="hover:bg-brown/[0.015] transition-colors">
                          <td className="p-4 align-top">
                            <span className="font-display font-semibold text-gold tracking-widest text-[14px] block">
                              {b.bookingId}
                            </span>
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`eyebrow text-[9px] px-2 py-0.5 inline-block font-semibold ${
                                  isOffline
                                    ? "bg-purple-100 text-purple-900 border border-purple-300"
                                    : "bg-blue-100 text-blue-900 border border-blue-300"
                                }`}
                              >
                                {isOffline ? "🏢 Offline / Walk-in" : "🌐 Online Direct"}
                              </span>
                              <span className="text-[10px] text-taupe">
                                {new Date(b.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            {b.notes && (
                              <div className="mt-2 text-xs bg-amber-50 border border-amber-200 text-amber-900 p-1.5 max-w-xs">
                                <span className="font-semibold block text-[10px] uppercase text-amber-700">
                                  Notes:
                                </span>
                                {b.notes}
                              </div>
                            )}
                          </td>

                          <td className="p-4 align-top space-y-1">
                            <div className="font-semibold text-brown">{b.guestName}</div>
                            {b.guestPhone ? (
                              <div className="flex items-center gap-2 text-xs text-taupe">
                                <Phone className="w-3 h-3 text-gold shrink-0" />
                                <span>{b.guestPhone}</span>
                                <a
                                  href={`https://wa.me/${waPhone}?text=${encodeURIComponent(
                                    `Hello ${b.guestName}, this is Hotel Lotus Divine regarding your reservation ${b.bookingId}.`,
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:text-emerald-700 text-[10px] font-semibold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200"
                                  title="Chat with guest on WhatsApp"
                                >
                                  💬 WhatsApp
                                </a>
                              </div>
                            ) : null}
                            {b.guestEmail ? (
                              <div className="flex items-center gap-2 text-xs text-taupe">
                                <Mail className="w-3 h-3 text-gold shrink-0" />
                                <span>{b.guestEmail}</span>
                              </div>
                            ) : null}
                          </td>

                          <td className="p-4 align-top space-y-1">
                            <div className="font-medium text-brown">
                              {new Date(b.checkIn + "T00:00:00").toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}{" "}
                              →{" "}
                              {new Date(b.checkOut + "T00:00:00").toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                            <div className="text-xs text-taupe">
                              Duration:{" "}
                              {Math.max(
                                1,
                                Math.round(
                                  (new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) /
                                    86400000,
                                ),
                              )}{" "}
                              night(s)
                            </div>
                            {b.arrivalTime && (
                              <div className="text-[11px] text-gold font-medium">
                                Expected Arrival: {b.arrivalTime}
                              </div>
                            )}
                          </td>

                          <td className="p-4 align-top space-y-1">
                            <div className="font-medium text-brown">
                              {b.rooms && b.rooms.length > 0
                                ? `${b.rooms.length} room${b.rooms.length > 1 ? "s" : ""} (${b.rooms
                                    .map((r) =>
                                      r.roomId === "lotus-sanctuary" ? "Deluxe" : "Premium",
                                    )
                                    .join(", ")})`
                                : b.roomId || "1 Room"}
                            </div>
                            <div className="font-display font-semibold text-brown text-sm">
                              ₹{b.total.toLocaleString("en-IN")}
                            </div>
                            {b.specialRequest && (
                              <div className="text-xs italic text-taupe max-w-xs border-l-2 border-gold/30 pl-2 mt-1">
                                "{b.specialRequest}"
                              </div>
                            )}
                          </td>

                          <td className="p-4 align-top">
                            <div className="flex flex-col gap-1.5 items-start">
                              <span
                                className={`eyebrow text-[9px] px-2.5 py-1 inline-block font-semibold ${
                                  b.status === "Cancelled" || b.status === "Failed"
                                    ? "bg-red-500/10 text-red-600 border border-red-500/20"
                                    : b.status === "Pending"
                                      ? "bg-amber-500/10 text-amber-700 border border-amber-500/20"
                                      : "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                                }`}
                              >
                                {b.status || "Confirmed"}
                              </span>

                              <span
                                className={`eyebrow text-[9px] px-2 py-0.5 inline-flex items-center gap-1 font-medium ${
                                  b.paymentStatus === "Paid"
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : b.paymentStatus === "Failed"
                                      ? "bg-red-100 text-red-800 border border-red-300"
                                      : "bg-amber-100 text-amber-800 border border-amber-300"
                                }`}
                              >
                                {b.paymentStatus === "Paid"
                                  ? isOffline
                                    ? "✓ Paid (Desk)"
                                    : "✓ Paid (PayU)"
                                  : b.paymentStatus === "Failed"
                                    ? "✕ Payment Failed"
                                    : "⏳ PayU Pending"}
                              </span>

                              {b.payuTxnId && (
                                <span
                                  className="text-[10px] text-taupe font-mono break-all max-w-[150px]"
                                  title={`PayU Txn ID: ${b.payuTxnId}`}
                                >
                                  Txn: {b.payuTxnId}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-4 align-top text-right">
                            {b.status !== "Cancelled" && (
                              <button
                                onClick={() => handleCancelBooking(b.bookingId)}
                                className="eyebrow text-[9px] text-red-500 border border-red-500/30 px-3 py-1.5 hover:bg-red-500 hover:text-white transition-colors"
                              >
                                CANCEL
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── TAB 2: OCCUPANCY & CALENDAR ── */}
        {activeTab === "occupancy" && (
          <section className="animate-fade-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-brown/10 pb-4">
              <div>
                <span className="eyebrow text-gold text-[10px]">UNIFIED INVENTORY TRACKING</span>
                <h2 className="font-display text-3xl mt-0.5">Hotel Occupancy &amp; Timeline</h2>
                <p className="text-xs text-taupe mt-1">
                  Total Capacity: <strong>19 Rooms</strong> (14 Deluxe Rooms + 5 Premium Rooms).
                  Online + Offline bookings share the same inventory.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOfflineModalOpen(true)}
                  className="bg-gold hover:bg-gold/90 text-brown font-semibold eyebrow text-[10px] px-4 py-2 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />+ Book Offline Walk-in
                </button>
                <button
                  onClick={() => fetchOccupancy()}
                  className="p-2 border border-brown/20 hover:bg-brown/5 text-brown/70 transition-colors"
                  title="Refresh Timeline"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Stat Highlights */}
            {occupancyData && occupancyData.timeline.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {(() => {
                  const todayRow = occupancyData.timeline[0];
                  const todayStats = getOverallStats(todayRow);
                  return (
                    <>
                      <div className="bg-white border border-brown/10 p-4 shadow-sm">
                        <span className="eyebrow text-brown/40 text-[9px] block mb-1">
                          TOTAL CAPACITY
                        </span>
                        <div className="font-display text-2xl text-brown font-semibold">
                          {todayStats.total} Rooms
                        </div>
                        <span className="text-[11px] text-taupe mt-1 block">
                          14 Deluxe · 5 Premium
                        </span>
                      </div>

                      <div className="bg-white border border-brown/10 p-4 shadow-sm">
                        <span className="eyebrow text-brown/40 text-[9px] block mb-1">
                          TODAY'S OCCUPANCY
                        </span>
                        <div className="font-display text-2xl text-gold font-semibold">
                          {todayStats.occupied} / {todayStats.total}{" "}
                          <span className="text-sm font-sans font-normal text-taupe">
                            ({todayStats.available} Available)
                          </span>
                        </div>
                        <div className="w-full bg-brown/10 h-1.5 mt-2 overflow-hidden">
                          <div
                            className={`h-full ${todayStats.isFull ? "bg-red-500" : "bg-gold"}`}
                            style={{
                              width: `${Math.min(100, Math.round((todayStats.occupied / (todayStats.total || 19)) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="bg-white border border-brown/10 p-4 shadow-sm">
                        <span className="eyebrow text-brown/40 text-[9px] block mb-1">
                          TODAY DELUXE
                        </span>
                        <div className="font-display text-2xl text-brown font-semibold">
                          {todayRow?.deluxe?.occupied ?? 0} / {todayRow?.deluxe?.total ?? 14}
                        </div>
                        <span
                          className={`eyebrow text-[9px] px-2 py-0.5 inline-block mt-2 ${
                            todayRow?.deluxe?.isFull
                              ? "bg-red-100 text-red-700 font-bold"
                              : (todayRow?.deluxe?.available ?? 14) <= 3
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {todayRow?.deluxe?.isFull
                            ? "🔴 SOLD OUT"
                            : `${todayRow?.deluxe?.available ?? 14} Available`}
                        </span>
                      </div>

                      <div className="bg-white border border-brown/10 p-4 shadow-sm">
                        <span className="eyebrow text-brown/40 text-[9px] block mb-1">
                          TODAY PREMIUM
                        </span>
                        <div className="font-display text-2xl text-brown font-semibold">
                          {todayRow?.premium?.occupied ?? 0} / {todayRow?.premium?.total ?? 5}
                        </div>
                        <span
                          className={`eyebrow text-[9px] px-2 py-0.5 inline-block mt-2 ${
                            todayRow?.premium?.isFull
                              ? "bg-red-100 text-red-700 font-bold"
                              : (todayRow?.premium?.available ?? 5) <= 2
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {todayRow?.premium?.isFull
                            ? "🔴 SOLD OUT"
                            : `${todayRow?.premium?.available ?? 5} Available`}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Timeline Filter Controls */}
            <div className="bg-white border border-brown/10 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-brown/70 eyebrow">START DATE:</label>
                <input
                  type="date"
                  value={occupancyStartDate}
                  onChange={(e) => setOccupancyStartDate(e.target.value)}
                  className="border border-brown/15 px-3 py-1.5 text-xs bg-white text-brown focus:border-gold outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-taupe font-medium eyebrow">RANGE:</span>
                {[7, 14, 30].map((d) => (
                  <button
                    key={d}
                    onClick={() => setOccupancyDays(d)}
                    className={`eyebrow text-[10px] px-3 py-1 border transition-colors ${
                      occupancyDays === d
                        ? "bg-brown text-ivory border-brown font-semibold"
                        : "border-brown/15 text-brown/60 hover:border-gold"
                    }`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>
            </div>

            {occupancyError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 mb-6 text-xs">
                {occupancyError}
              </div>
            )}

            {occupancyLoading ? (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gold border-r-2 mx-auto mb-4" />
                <span className="eyebrow text-gold text-xs">CALCULATING OCCUPANCY MATRIX...</span>
              </div>
            ) : !occupancyData || occupancyData.timeline.length === 0 ? (
              <div className="bg-white border border-brown/10 p-12 text-center text-taupe text-sm">
                No occupancy data available.
              </div>
            ) : (
              <div className="bg-white border border-brown/10 overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-brown/5 border-b border-brown/10 eyebrow text-[9px] text-brown/60">
                      <th className="p-3.5">DATE &amp; DAY</th>
                      <th className="p-3.5">DELUXE (14 MAX)</th>
                      <th className="p-3.5">PREMIUM (5 MAX)</th>
                      <th className="p-3.5">TOTAL OCCUPIED</th>
                      <th className="p-3.5">ONLINE STATUS</th>
                      <th className="p-3.5 text-right">ACTIVE BOOKINGS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brown/8 text-brown/80">
                    {occupancyData.timeline.map((row) => {
                      const isToday = row.date === new Date().toISOString().split("T")[0];
                      const rowStats = getOverallStats(row);
                      const deluxeAvailable =
                        row.deluxe?.available ??
                        Math.max(0, (row.deluxe?.total ?? 14) - (row.deluxe?.occupied ?? 0));
                      const deluxeIsFull =
                        row.deluxe?.isFull ??
                        (row.deluxe?.occupied ?? 0) >= (row.deluxe?.total ?? 14);
                      const premiumAvailable =
                        row.premium?.available ??
                        Math.max(0, (row.premium?.total ?? 5) - (row.premium?.occupied ?? 0));
                      const premiumIsFull =
                        row.premium?.isFull ??
                        (row.premium?.occupied ?? 0) >= (row.premium?.total ?? 5);

                      return (
                        <tr
                          key={row.date}
                          className={`hover:bg-brown/[0.02] transition-colors ${
                            isToday ? "bg-amber-50/50 font-medium" : ""
                          }`}
                        >
                          <td className="p-3.5 align-middle">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold text-brown">
                                {row.date}
                              </span>
                              <span className="text-[10px] eyebrow text-taupe uppercase bg-brown/5 px-1.5 py-0.5">
                                {row.dayOfWeek}
                              </span>
                              {isToday && (
                                <span className="bg-gold text-brown text-[8px] font-bold px-1.5 py-0.5 uppercase">
                                  Today
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Deluxe column */}
                          <td className="p-3.5 align-middle">
                            <div className="flex items-center gap-2">
                              <span
                                className={`eyebrow text-[9px] px-2 py-0.5 font-semibold ${
                                  deluxeIsFull
                                    ? "bg-red-100 text-red-800 border border-red-300"
                                    : deluxeAvailable <= 3
                                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                                      : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                }`}
                              >
                                {deluxeIsFull
                                  ? `🔴 0 / ${row.deluxe?.total ?? 14} left`
                                  : `🟢 ${deluxeAvailable} left`}
                              </span>
                              <span className="text-[11px] text-taupe font-mono">
                                ({row.deluxe?.occupied ?? 0}/{row.deluxe?.total ?? 14})
                              </span>
                            </div>
                          </td>

                          {/* Premium column */}
                          <td className="p-3.5 align-middle">
                            <div className="flex items-center gap-2">
                              <span
                                className={`eyebrow text-[9px] px-2 py-0.5 font-semibold ${
                                  premiumIsFull
                                    ? "bg-red-100 text-red-800 border border-red-300"
                                    : premiumAvailable <= 2
                                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                                      : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                }`}
                              >
                                {premiumIsFull
                                  ? `🔴 0 / ${row.premium?.total ?? 5} left`
                                  : `🟢 ${premiumAvailable} left`}
                              </span>
                              <span className="text-[11px] text-taupe font-mono">
                                ({row.premium?.occupied ?? 0}/{row.premium?.total ?? 5})
                              </span>
                            </div>
                          </td>

                          {/* Total column */}
                          <td className="p-3.5 align-middle">
                            <div className="flex items-center gap-2 max-w-[140px]">
                              <span className="text-xs font-semibold text-brown font-mono">
                                {rowStats.occupied}/{rowStats.total}
                              </span>
                              <div className="flex-1 bg-brown/10 h-2 overflow-hidden">
                                <div
                                  className={`h-full ${rowStats.isFull ? "bg-red-600" : "bg-gold"}`}
                                  style={{
                                    width: `${Math.round((rowStats.occupied / (rowStats.total || 19)) * 100)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-3.5 align-middle">
                            {rowStats.isFull ? (
                              <span className="eyebrow text-[9px] text-red-700 bg-red-100 px-2 py-0.5 border border-red-300 font-bold">
                                🚫 ALL SOLD OUT
                              </span>
                            ) : deluxeIsFull ? (
                              <span className="eyebrow text-[9px] text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200">
                                Deluxe Full · Premium Available
                              </span>
                            ) : premiumIsFull ? (
                              <span className="eyebrow text-[9px] text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200">
                                Premium Full · Deluxe Available
                              </span>
                            ) : (
                              <span className="eyebrow text-[9px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                                Available for Online
                              </span>
                            )}
                          </td>

                          {/* Action */}
                          <td className="p-3.5 align-middle text-right">
                            {row.bookings.length > 0 ? (
                              <button
                                onClick={() => setSelectedDayDetails(row)}
                                className="eyebrow text-[9px] text-gold border border-gold/40 px-2.5 py-1 hover:bg-gold hover:text-brown transition-colors uppercase font-medium"
                              >
                                View ({row.bookings.length})
                              </button>
                            ) : (
                              <span className="text-[11px] text-taupe/40 italic">0 booked</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── TAB 3: ROOM RATES & DEMAND PRICING ── */}
        {activeTab === "rooms" && (
          <section className="animate-fade-up grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">
            {/* Left: Rooms list */}
            <div>
              <div className="mb-6 border-b border-brown/10 pb-4">
                <span className="eyebrow text-gold text-[10px]">ROOM INVENTORY &amp; RATES</span>
                <h2 className="font-display text-3xl mt-0.5">Current Room Catalog</h2>
                <p className="text-xs text-taupe mt-1">
                  Click <strong>Edit Rate</strong> to raise or lower the price based on demand
                  (festivals, weekends, high occupancy, etc.).
                </p>
              </div>

              {roomsError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 mb-6 text-xs">
                  {roomsError}
                </div>
              )}

              {roomsLoading ? (
                <div className="py-20 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gold border-r-2 mx-auto mb-4" />
                  <span className="eyebrow text-gold text-xs">LOADING ROOMS...</span>
                </div>
              ) : rooms.length === 0 ? (
                <div className="bg-white border border-brown/10 p-12 text-center text-taupe text-sm">
                  No rooms catalogued in database yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms.map((r) => {
                    const isSelected = editingRoom?.id === r.id;
                    const defaultCap =
                      r.id === "lotus-sanctuary" || r.category === "Deluxe" ? 14 : 5;
                    const inventoryCount = r.inventory !== undefined ? r.inventory : defaultCap;

                    return (
                      <div
                        key={r.id}
                        className={`bg-white border p-5 flex flex-col sm:flex-row gap-5 items-start transition-all ${
                          isSelected
                            ? "border-gold ring-1 ring-gold shadow-md"
                            : "border-brown/10 hover:border-brown/30"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between mb-1 gap-2">
                            <h3 className="font-display text-xl text-brown leading-tight truncate">
                              {r.name}
                            </h3>
                            <span className="font-display text-gold text-lg shrink-0 font-semibold">
                              {r.price}
                              <span className="text-xs text-taupe font-normal font-sans">
                                {" "}
                                / night
                              </span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <span className="eyebrow text-[9px] bg-brown/5 text-brown/70 px-2 py-0.5 rounded font-semibold">
                              {r.category}
                            </span>
                            <span className="eyebrow text-[9px] bg-gold/15 text-gold px-2 py-0.5 rounded font-semibold">
                              Capacity: {inventoryCount} Rooms
                            </span>
                          </div>

                          <p className="text-xs text-taupe leading-relaxed line-clamp-2">
                            {r.description}
                          </p>

                          <div className="flex justify-between items-center mt-4 pt-3 border-t border-brown/5">
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-taupe">
                              {r.size && <span>Size: {r.size}</span>}
                              {r.size && <span className="text-gold/40">·</span>}
                              <span>Guests: {r.capacity}</span>
                            </div>

                            <button
                              onClick={() => startEditRoom(r)}
                              className={`eyebrow text-[9px] px-3.5 py-1.5 uppercase font-semibold transition-colors ${
                                isSelected
                                  ? "bg-brown text-ivory"
                                  : "text-gold border border-gold/40 hover:bg-gold hover:text-brown"
                              }`}
                            >
                              {isSelected ? "Editing Rate ✓" : "Edit Rate"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Demand-Based Price Editor */}
            <div className="bg-white border border-brown/10 p-6 lg:p-7 sticky top-24 shadow-sm">
              <span className="eyebrow text-gold text-[10px] block mb-1">RATE CONTROLLER</span>
              <h3 className="font-display text-2xl mb-1">
                {editingRoom ? `Adjust Rate: ${editingRoom.name}` : "Select a Room to Edit"}
              </h3>
              <p className="text-xs text-taupe mb-6 leading-relaxed">
                Direct demand pricing: set the live nightly rate for this room type. All frontend
                displays and booking engines update instantly.
              </p>

              {updateRoomError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-3.5 mb-4 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{updateRoomError}</span>
                </div>
              )}

              {updateRoomSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-700 p-3.5 mb-4 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{updateRoomSuccess}</span>
                </div>
              )}

              {editingRoom ? (
                <form onSubmit={handleUpdateRoomPrice} className="space-y-5 text-xs">
                  <div>
                    <label className="eyebrow text-brown/60 text-[9px] block mb-1.5 font-semibold">
                      ROOM PRICE / NIGHT (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown/40 font-display text-base">
                        ₹
                      </span>
                      <input
                        type="number"
                        required
                        value={roomPrice}
                        onChange={(e) => setRoomPrice(e.target.value.replace(/\D/g, ""))}
                        placeholder="e.g. 1500"
                        className="w-full border border-brown/15 pl-8 pr-3 py-2.5 bg-white text-base font-semibold focus:border-gold outline-none rounded-none text-brown"
                      />
                    </div>
                  </div>

                  {/* Quick Demand Adjustments */}
                  <div>
                    <span className="eyebrow text-brown/50 text-[9px] block mb-2 font-medium">
                      QUICK DEMAND ADJUSTMENTS:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => adjustPriceBy(200)}
                        className="border border-brown/15 px-2.5 py-1.5 text-[11px] text-brown hover:bg-gold/10 hover:border-gold transition-colors text-center font-medium"
                      >
                        📈 +₹200 (Weekend)
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustPriceBy(500)}
                        className="border border-brown/15 px-2.5 py-1.5 text-[11px] text-brown hover:bg-gold/10 hover:border-gold transition-colors text-center font-medium"
                      >
                        🔥 +₹500 (Peak/Festival)
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustPriceBy(-200)}
                        className="border border-brown/15 px-2.5 py-1.5 text-[11px] text-brown hover:bg-gold/10 hover:border-gold transition-colors text-center font-medium"
                      >
                        📉 -₹200 (Low Demand)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setRoomPrice(editingRoom.category === "Deluxe" ? "1499" : "1999")
                        }
                        className="border border-brown/15 px-2.5 py-1.5 text-[11px] text-brown hover:bg-brown/5 transition-colors text-center font-medium"
                      >
                        ↺ Reset Base Rate
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="eyebrow text-brown/60 text-[9px] block mb-1.5 font-semibold">
                      PHYSICAL INVENTORY COUNT (ROOMS)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={roomInventory}
                      onChange={(e) => setRoomInventory(Number(e.target.value) || 1)}
                      className="w-full border border-brown/15 px-3 py-2 bg-white text-sm focus:border-gold outline-none rounded-none text-brown"
                    />
                    <span className="text-[10px] text-taupe mt-1 block">
                      Default: Deluxe is 14 rooms, Premium is 5 rooms.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brown hover:bg-gold hover:text-brown text-ivory eyebrow py-3.5 transition-colors text-[11px] font-semibold mt-4 shadow-sm"
                  >
                    Save Rate Changes
                  </button>
                </form>
              ) : (
                <div className="text-sm text-taupe py-6 text-center border border-dashed border-brown/15 p-6">
                  Select a room from the list on the left to adjust its pricing.
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── TAB 4: SITE SETTINGS & OFFERS ── */}
        {activeTab === "settings" && (
          <section className="animate-fade-up max-w-2xl bg-white border border-brown/10 p-6 sm:p-8 shadow-sm">
            <span className="eyebrow text-gold text-[10px] block mb-1">
              PROMOTIONS &amp; OFFERS
            </span>
            <h2 className="font-display text-3xl mb-6">Site Banner &amp; Coupons</h2>

            {settingsStatus && (
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-900 p-3.5 mb-6 text-xs font-semibold">
                {settingsStatus}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
              <label className="flex items-center gap-3 cursor-pointer p-4 bg-brown/[0.02] border border-brown/10">
                <input
                  type="checkbox"
                  checked={isCouponLive}
                  onChange={(e) => setIsCouponLive(e.target.checked)}
                  className="w-4 h-4 accent-gold shrink-0 cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-brown text-sm">Enable Discount Coupon</span>
                  <span className="text-taupe text-[11px]">
                    Allows guests to enter a promotional discount code at checkout
                  </span>
                </div>
              </label>

              {isCouponLive && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="eyebrow text-brown/60 text-[9px] block mb-1">
                      COUPON CODE
                    </label>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. LOTUS10"
                      className="w-full border border-brown/15 px-3 py-2 bg-white text-sm font-mono uppercase focus:border-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="eyebrow text-brown/60 text-[9px] block mb-1">
                      DISCOUNT PERCENTAGE (%)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={discountPercentage}
                      onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                      placeholder="e.g. 10"
                      className="w-full border border-brown/15 px-3 py-2 bg-white text-sm focus:border-gold outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="eyebrow text-brown/60 text-[9px] block mb-1">
                  MARQUEE ANNOUNCEMENT TEXT
                </label>
                <textarea
                  rows={3}
                  value={marqueeText}
                  onChange={(e) => setMarqueeText(e.target.value)}
                  placeholder="e.g. Special Offer: Book direct for complimentary breakfast & temple transfers!"
                  className="w-full border border-brown/15 p-3 bg-white text-sm focus:border-gold outline-none leading-relaxed"
                />
                <span className="text-[10px] text-taupe mt-1 block">
                  Displayed in the top scrolling announcement banner on the homepage.
                </span>
              </div>

              <button
                type="submit"
                className="bg-brown hover:bg-gold hover:text-brown text-ivory eyebrow px-8 py-3.5 transition-colors text-[11px] font-semibold"
              >
                Save Settings
              </button>
            </form>
          </section>
        )}
      </div>

      {/* ── MODAL: ADD OFFLINE / WALK-IN BOOKING ── */}
      {offlineModalOpen && (
        <div className="fixed inset-0 z-50 bg-brown/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-gold/40 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-fade-up my-8">
            <button
              onClick={() => {
                setOfflineModalOpen(false);
                setOfflineError(null);
                setOfflineSuccess(null);
              }}
              className="absolute top-4 right-4 text-brown/40 hover:text-brown p-1 text-xl leading-none"
            >
              &times;
            </button>

            <span className="eyebrow text-gold text-[10px] block mb-1">
              DIRECT DESK RESERVATION
            </span>
            <h3 className="font-display text-2xl text-brown mb-2">Book Offline / Walk-in Guest</h3>
            <p className="text-xs text-taupe mb-6 leading-relaxed">
              Deducts directly from hotel capacity (14 Deluxe, 5 Premium). Prevents overbooking
              across all online channels.
            </p>

            {offlineError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-3.5 mb-4 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{offlineError}</span>
              </div>
            )}

            {offlineSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-700 p-3.5 mb-4 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{offlineSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateOfflineBooking} className="space-y-4 text-xs">
              <div>
                <label className="eyebrow text-brown/60 text-[9px] block mb-1">
                  GUEST FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={offlineGuestName}
                  onChange={(e) => setOfflineGuestName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full border border-brown/15 px-3 py-2 bg-white text-sm focus:border-gold outline-none text-brown"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="eyebrow text-brown/60 text-[9px] block mb-1">
                    PHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    required
                    value={offlineGuestPhone}
                    onChange={(e) => setOfflineGuestPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full border border-brown/15 px-3 py-2 bg-white text-sm focus:border-gold outline-none text-brown"
                  />
                </div>
                <div>
                  <label className="eyebrow text-brown/60 text-[9px] block mb-1">
                    EMAIL (OPTIONAL)
                  </label>
                  <input
                    type="email"
                    value={offlineGuestEmail}
                    onChange={(e) => setOfflineGuestEmail(e.target.value)}
                    placeholder="guest@example.com"
                    className="w-full border border-brown/15 px-3 py-2 bg-white text-sm focus:border-gold outline-none text-brown"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="eyebrow text-brown/60 text-[9px] block mb-1">
                    ROOM CATEGORY *
                  </label>
                  <select
                    value={offlineRoomId}
                    onChange={(e) => setOfflineRoomId(e.target.value)}
                    className="w-full border border-brown/15 px-3 py-2 bg-white text-sm focus:border-gold outline-none text-brown"
                  >
                    <option value="lotus-sanctuary">Deluxe Room (14 Total)</option>
                    <option value="imperial-vista">Premium Room (5 Total)</option>
                  </select>
                </div>
                <div>
                  <label className="eyebrow text-brown/60 text-[9px] block mb-1">
                    ROOM COUNT *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    value={offlineRoomCount}
                    onChange={(e) => setOfflineRoomCount(Number(e.target.value) || 1)}
                    className="w-full border border-brown/15 px-3 py-2 bg-white text-sm focus:border-gold outline-none text-brown"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="eyebrow text-brown/60 text-[9px] block mb-1">
                    CHECK-IN DATE *
                  </label>
                  <input
                    type="date"
                    required
                    value={offlineCheckIn}
                    onChange={(e) => setOfflineCheckIn(e.target.value)}
                    className="w-full border border-brown/15 px-3 py-2 bg-white text-sm focus:border-gold outline-none text-brown"
                  />
                </div>
                <div>
                  <label className="eyebrow text-brown/60 text-[9px] block mb-1">
                    CHECK-OUT DATE *
                  </label>
                  <input
                    type="date"
                    required
                    value={offlineCheckOut}
                    min={offlineCheckIn}
                    onChange={(e) => setOfflineCheckOut(e.target.value)}
                    className="w-full border border-brown/15 px-3 py-2 bg-white text-sm focus:border-gold outline-none text-brown"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="eyebrow text-brown/60 text-[9px] block mb-1">
                    TOTAL CHARGED (₹)
                  </label>
                  <input
                    type="number"
                    value={offlineTotal}
                    onChange={(e) => setOfflineTotal(e.target.value)}
                    placeholder="Auto-calculated or custom"
                    className="w-full border border-brown/15 px-3 py-2 bg-white text-sm font-semibold focus:border-gold outline-none text-brown"
                  />
                </div>
                <div>
                  <label className="eyebrow text-brown/60 text-[9px] block mb-1">
                    GUESTS PER ROOM
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={4}
                    value={offlineGuestsPerRoom}
                    onChange={(e) => setOfflineGuestsPerRoom(Number(e.target.value) || 2)}
                    className="w-full border border-brown/15 px-3 py-2 bg-white text-sm focus:border-gold outline-none text-brown"
                  />
                </div>
              </div>

              <div>
                <label className="eyebrow text-brown/60 text-[9px] block mb-1">
                  BOOKING NOTES (PAYMENT / SOURCE)
                </label>
                <textarea
                  rows={2}
                  value={offlineNotes}
                  onChange={(e) => setOfflineNotes(e.target.value)}
                  placeholder="e.g. Paid in cash at desk, Walk-in, OTA Booking ID #12345"
                  className="w-full border border-brown/15 p-2.5 bg-white text-xs focus:border-gold outline-none text-brown"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setOfflineModalOpen(false)}
                  className="flex-1 border border-brown/20 text-brown eyebrow py-3 hover:bg-brown/5 transition-colors text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={offlineSubmitting}
                  className={`flex-1 bg-brown text-ivory eyebrow py-3 hover:bg-gold hover:text-brown transition-colors text-[10px] font-semibold ${
                    offlineSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {offlineSubmitting ? "Confirming..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: DAY OCCUPANCY DETAILS ── */}
      {selectedDayDetails && (
        <div className="fixed inset-0 z-50 bg-brown/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gold/40 max-w-xl w-full p-6 sm:p-7 shadow-2xl relative animate-fade-up max-h-[85vh] flex flex-col">
            <button
              onClick={() => setSelectedDayDetails(null)}
              className="absolute top-4 right-4 text-brown/40 hover:text-brown p-1 text-xl leading-none"
            >
              &times;
            </button>

            <span className="eyebrow text-gold text-[10px] block mb-1">DATE DETAIL</span>
            <h3 className="font-display text-2xl text-brown mb-1">
              Active Bookings on {selectedDayDetails.date} ({selectedDayDetails.dayOfWeek})
            </h3>
            {(() => {
              const modalStats = getOverallStats(selectedDayDetails);
              return (
                <p className="text-xs text-taupe mb-4">
                  Occupied:{" "}
                  <strong>
                    {modalStats.occupied} / {modalStats.total}
                  </strong>{" "}
                  (Deluxe: {selectedDayDetails.deluxe?.occupied ?? 0}/
                  {selectedDayDetails.deluxe?.total ?? 14} · Premium:{" "}
                  {selectedDayDetails.premium?.occupied ?? 0}/
                  {selectedDayDetails.premium?.total ?? 5})
                </p>
              );
            })()}

            <div className="flex-1 overflow-y-auto divide-y divide-brown/10 pr-1 text-xs">
              {selectedDayDetails.bookings.length === 0 ? (
                <div className="py-8 text-center text-taupe">No bookings on this date.</div>
              ) : (
                selectedDayDetails.bookings.map((b) => (
                  <div key={b.bookingId} className="py-3 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-display font-semibold text-gold text-sm tracking-wider">
                        {b.bookingId}
                      </span>
                      <span
                        className={`eyebrow text-[8px] px-2 py-0.5 font-semibold ${
                          b.source === "offline"
                            ? "bg-purple-100 text-purple-900 border border-purple-300"
                            : "bg-blue-100 text-blue-900 border border-blue-300"
                        }`}
                      >
                        {b.source === "offline" ? "🏢 Offline" : "🌐 Online"}
                      </span>
                    </div>

                    <div className="font-medium text-brown">{b.guestName}</div>
                    {b.guestPhone && (
                      <div className="text-taupe text-[11px]">Phone: {b.guestPhone}</div>
                    )}
                    <div className="text-taupe text-[11px]">
                      Stay: {b.checkIn} → {b.checkOut}
                    </div>
                    <div className="text-taupe text-[11px] font-semibold text-brown/80">
                      Rooms: {b.deluxeRooms > 0 && `${b.deluxeRooms} Deluxe`}{" "}
                      {b.premiumRooms > 0 && `${b.premiumRooms} Premium`} · ₹
                      {b.total.toLocaleString("en-IN")}
                    </div>
                    {b.notes && (
                      <div className="text-[11px] text-amber-900 bg-amber-50 p-1.5 border border-amber-200 mt-1">
                        Note: {b.notes}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-brown/10 mt-3 text-right">
              <button
                onClick={() => setSelectedDayDetails(null)}
                className="eyebrow bg-brown text-ivory px-6 py-2 text-[10px] hover:bg-gold hover:text-brown transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
