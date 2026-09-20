"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

interface AdminBooking {
  bookingId: string;
  createdAt: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  arrivalTime?: string;
  roomId: string;
  total: number;
  specialRequest?: string;
  status?: string;
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
  specialPrice?: string;
  specialPriceStartDate?: string;
  specialPriceEndDate?: string;
  imageUrl?: string;
  imageKey?: string;
  imageAlt?: string;
  gallery?: string[];
}

const COMMON_AMENITIES = [
  "King-size bed",
  "Queen-size bed",
  "Twin beds",
  "Garden view",
  "City view",
  "Temple view",
  "Free Wi-Fi",
  "Smart TV",
  "Mini-bar",
  "Air conditioning",
  "Room heater",
  "Work desk",
  "En-suite bathroom",
  "Bathtub",
  "Balcony",
  "Safe box",
  "Coffee maker",
  "Kitchenette",
  "Room service",
  "Spa access",
  "Gym access",
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"bookings" | "rooms" | "settings">("bookings");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Bookings state
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  // Rooms state
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState<string | null>(null);

  // Add/Edit Room form state
  const [editingRoom, setEditingRoom] = useState<AdminRoom | null>(null);
  const [roomName, setRoomName] = useState("");
  const [roomCategory, setRoomCategory] = useState("Deluxe");
  const [roomDescription, setRoomDescription] = useState("");
  const [roomAmenities, setRoomAmenities] = useState("");
  const [roomSize, setRoomSize] = useState("");
  const [roomCapacity, setRoomCapacity] = useState("2 Guests");
  const [roomPrice, setRoomPrice] = useState("1500");
  const [specialPrice, setSpecialPrice] = useState("");
  const [specialPriceStartDate, setSpecialPriceStartDate] = useState("");
  const [specialPriceEndDate, setSpecialPriceEndDate] = useState("");

  const [isCouponLive, setIsCouponLive] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [marqueeText, setMarqueeText] = useState("");
  const [settingsStatus, setSettingsStatus] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [addRoomError, setAddRoomError] = useState<string | null>(null);
  const [addRoomSuccess, setAddRoomSuccess] = useState<string | null>(null);

  // Gallery viewing and custom delete modal states
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

  // Fetch bookings when bookings tab is active
  useEffect(() => {
    if (!token || activeTab !== "bookings") return;

    async function fetchBookings() {
      setBookingsLoading(true);
      setBookingsError(null);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load bookings");
        }

        setBookings(data);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "An error occurred while fetching bookings.";
        setBookingsError(msg);
      } finally {
        setBookingsLoading(false);
      }
    }

    fetchBookings();
  }, [token, activeTab]);

  // Fetch rooms when rooms tab is active
  useEffect(() => {
    if (!token || activeTab !== "rooms") return;

    async function fetchRooms() {
      setRoomsLoading(true);
      setRoomsError(null);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load rooms");
        }

        setRooms(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "An error occurred while fetching rooms.";
        setRoomsError(msg);
      } finally {
        setRoomsLoading(false);
      }
    }

    fetchRooms();
  }, [token, activeTab]);

  // Handle logout
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
    setTimeout(() => setSettingsStatus(""), 3000);
  }

  function handleLogout() {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  }

  // Handle cancel booking
  async function handleCancelBooking(bookingId: string) {
    if (!confirm(`Are you sure you want to cancel booking ${bookingId}?`)) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/bookings/${bookingId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel booking");
      }

      // Update state
      setBookings((prevBookings) =>
        prevBookings.map((b) => (b.bookingId === bookingId ? { ...b, status: "Cancelled" } : b)),
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to cancel booking. Please try again.";
      alert(msg);
    }
  }

  // Handle image upload and conversion to Base64
  async function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setUploadingImage(true);
    setAddRoomError(null);

    // Read file as Base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileName: file.name,
            fileData: base64Data,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "File upload failed");
        }

        setUploadedImageUrl(data.url);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "unknown error";
        setAddRoomError(`Image upload failed: ${msg}`);
        setImageFile(null);
      } finally {
        setUploadingImage(false);
      }
    };

    reader.onerror = () => {
      setAddRoomError("Failed to read file.");
      setUploadingImage(false);
    };

    reader.readAsDataURL(file);
  }

  // Handle gallery images upload and conversion to Base64
  async function handleGalleryFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setAddRoomError(null);

    const urls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Wrap FileReader in Promise to handle sequentially
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error(`Failed to read file ${file.name}`));
          reader.readAsDataURL(file);
        });

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileName: file.name,
            fileData: base64Data,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Upload failed for ${file.name}`);
        }

        urls.push(data.url);
      }

      setGalleryUrls((prev) => [...prev, ...urls]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "unknown error";
      setAddRoomError(`Gallery upload failed: ${msg}`);
    } finally {
      setUploadingGallery(false);
    }
  }

  // Helper to pre-populate edit room fields
  function startEditRoom(room: AdminRoom) {
    setEditingRoom(room);
    setRoomName(room.name);
    setRoomCategory(room.category);
    setRoomDescription(room.description);
    setRoomAmenities(room.amenities.join(", "));
    setRoomSize(room.size || "");
    setRoomCapacity(room.capacity);
    setRoomPrice(room.price);
    setSpecialPrice(room.specialPrice || "");
    setSpecialPriceStartDate(
      room.specialPriceStartDate
        ? new Date(room.specialPriceStartDate).toISOString().split("T")[0]
        : "",
    );
    setSpecialPriceEndDate(
      room.specialPriceEndDate
        ? new Date(room.specialPriceEndDate).toISOString().split("T")[0]
        : "",
    );
    setUploadedImageUrl(room.imageUrl || null);
    setGalleryUrls(room.gallery || []);
    setAddRoomError(null);
    setAddRoomSuccess(null);
  }

  // Reset form and cancel edit
  function cancelEditRoom() {
    setEditingRoom(null);
    setRoomName("");
    setRoomCategory("Deluxe");
    setRoomDescription("");
    setRoomAmenities("");
    setRoomSize("");
    setRoomCapacity("2 Guests");
    setRoomPrice("");
    setSpecialPrice("");
    setSpecialPriceStartDate("");
    setSpecialPriceEndDate("");
    setUploadedImageUrl(null);
    setGalleryUrls([]);
    setImageFile(null);
    setAddRoomError(null);
    setAddRoomSuccess(null);
  }

  // Trigger delete modal confirmation
  function handleDeleteRoom(roomId: string) {
    setDeletingRoomId(roomId);
  }

  // Execute delete room call to backend
  async function executeDeleteRoom(roomId: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/rooms/${roomId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete room");
      }

      // If we are currently editing the deleted room, reset the edit state
      if (editingRoom && editingRoom.id === roomId) {
        cancelEditRoom();
      }

      setRooms((prevRooms) => prevRooms.filter((r) => r.id !== roomId));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete room.";
      alert(msg);
    }
  }

  // Handle Create or Update Room
  async function handleAddRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!roomName.trim() || !roomDescription.trim() || !roomPrice.trim()) {
      setAddRoomError("Please fill in all required room details.");
      return;
    }

    setAddRoomError(null);
    setAddRoomSuccess(null);

    const isEditing = !!editingRoom;
    const url = isEditing
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/rooms/${editingRoom.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/rooms`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: roomName,
          category: roomCategory,
          description: roomDescription,
          amenities: roomAmenities,
          size: roomSize,
          capacity: roomCapacity,
          price: roomPrice,
          specialPrice,
          specialPriceStartDate: specialPriceStartDate || undefined,
          specialPriceEndDate: specialPriceEndDate || undefined,
          imageUrl: uploadedImageUrl || "", // Optional if not uploaded
          gallery: galleryUrls,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Failed to ${isEditing ? "update" : "create"} room`);
      }

      setAddRoomSuccess(`Room "${roomName}" ${isEditing ? "updated" : "created"} successfully!`);

      // Reset form
      cancelEditRoom();

      // Refresh rooms list
      if (isEditing) {
        setRooms((prevRooms) => prevRooms.map((r) => (r.id === editingRoom.id ? data.room : r)));
      } else {
        setRooms((prevRooms) => [...prevRooms, data.room]);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : `Failed to ${isEditing ? "update" : "create"} room. Please try again.`;
      setAddRoomError(msg);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brown text-ivory">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gold border-r-2 mx-auto mb-4"></div>
          <span className="eyebrow text-gold text-xs tracking-widest">LOADING SESSION...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-ivory text-brown flex flex-col">
      {/* Admin Header */}
      <header className="bg-brown text-ivory py-5 px-5 sm:px-8 lg:px-20 flex items-center justify-between border-b border-gold/15">
        <div className="flex items-center gap-6">
          <BrandLogo tone="ivory" size="sm" showTagline={false} />
          <div className="h-6 w-px bg-gold/30 hidden sm:block" />
          <span className="eyebrow text-gold text-[10px] tracking-widest hidden sm:block">
            ADMINISTRATOR PORTAL
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="eyebrow border border-gold/40 text-gold px-4 py-2 hover:bg-gold hover:text-brown transition-colors text-[10px]"
        >
          LOG OUT
        </button>
      </header>

      {/* Tabs Selector */}
      <div className="bg-white border-b border-brown/8 px-5 sm:px-8 lg:px-20 py-4 flex gap-6">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`eyebrow text-[11px] pb-1 transition-all ${
            activeTab === "bookings"
              ? "text-gold border-b-2 border-gold font-semibold"
              : "text-brown/40 hover:text-brown"
          }`}
        >
          Bookings Management
        </button>
        <button
          onClick={() => setActiveTab("rooms")}
          className={`eyebrow text-[11px] pb-1 transition-all ${
            activeTab === "rooms"
              ? "text-gold border-b-2 border-gold font-semibold"
              : "text-brown/40 hover:text-brown"
          }`}
        >
          Room Curation
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-5 sm:px-8 lg:px-20 py-8 max-w-7xl w-full mx-auto">
        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <section className="animate-fade-up">
            <div className="flex justify-between items-baseline mb-6 border-b border-brown/10 pb-4">
              <div>
                <span className="eyebrow text-gold text-[10px]">RESERVATIONS</span>
                <h2 className="font-display text-3xl mt-1">Bookings Received</h2>
              </div>
              <span className="text-xs text-taupe font-sans">
                {bookings.length} reservation{bookings.length !== 1 ? "s" : ""} in total
              </span>
            </div>

            {bookingsError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 mb-6 text-xs font-sans">
                {bookingsError}
              </div>
            )}

            {bookingsLoading ? (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gold border-r-2 mx-auto mb-4"></div>
                <span className="eyebrow text-gold text-xs">FETCHING BOOKINGS...</span>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white border border-brown/10 p-12 text-center text-taupe font-sans text-sm">
                No reservation requests received yet.
              </div>
            ) : (
              <div className="bg-white border border-brown/10 overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse font-sans text-[13px]">
                  <thead>
                    <tr className="bg-brown/5 border-b border-brown/10 eyebrow text-[9px] text-brown/50">
                      <th className="p-4 lg:p-5">BOOKING ID</th>
                      <th className="p-4 lg:p-5">GUEST DETAILS</th>
                      <th className="p-4 lg:p-5">STAY DETAILS</th>
                      <th className="p-4 lg:p-5">ROOM & TOTAL</th>
                      <th className="p-4 lg:p-5">STATUS</th>
                      <th className="p-4 lg:p-5 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brown/8 text-brown/80">
                    {bookings.map((b) => (
                      <tr key={b.bookingId} className="hover:bg-brown/[0.01] transition-colors">
                        <td className="p-4 lg:p-5 align-top">
                          <span className="font-display font-semibold text-gold tracking-widest text-[14px] block">
                            {b.bookingId}
                          </span>
                          <span className="text-[10px] text-taupe mt-1 block">
                            {new Date(b.createdAt).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>
                        <td className="p-4 lg:p-5 align-top space-y-1">
                          <div className="font-semibold text-brown">{b.guestName}</div>
                          <div className="text-xs text-taupe">{b.guestEmail}</div>
                          {b.guestPhone && <div className="text-xs text-taupe">{b.guestPhone}</div>}
                        </td>
                        <td className="p-4 lg:p-5 align-top space-y-1">
                          <div className="font-medium">
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
                          <div className="text-xs text-taupe">Guests: {b.guests}</div>
                          {b.arrivalTime && (
                            <div className="text-[11px] text-gold/80 font-medium">
                              Arrival: {b.arrivalTime}
                            </div>
                          )}
                        </td>
                        <td className="p-4 lg:p-5 align-top space-y-1">
                          <div className="font-medium text-brown">{b.roomId}</div>
                          <div className="font-display font-semibold text-brown text-sm">
                            ₹{b.total.toLocaleString("en-IN")}
                          </div>
                          {b.specialRequest && (
                            <div className="text-xs italic text-taupe max-w-xs border-l-2 border-gold/30 pl-2 mt-2">
                              "{b.specialRequest}"
                            </div>
                          )}
                        </td>
                        <td className="p-4 lg:p-5 align-top">
                          <span
                            className={`eyebrow text-[9px] px-2.5 py-1 inline-block ${
                              b.status === "Cancelled"
                                ? "bg-red-500/10 text-red-500"
                                : "bg-green-500/10 text-green-600"
                            }`}
                          >
                            {b.status || "Confirmed"}
                          </span>
                        </td>
                        <td className="p-4 lg:p-5 align-top text-right">
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
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ROOMS TAB */}
        {activeTab === "rooms" && (
          <section className="animate-fade-up grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-14 items-start">
            {/* Left: Rooms list */}
            <div>
              <div className="mb-6 border-b border-brown/10 pb-4">
                <span className="eyebrow text-gold text-[10px]">INVENTORY</span>
                <h2 className="font-display text-3xl mt-1">Current Rooms</h2>
              </div>

              {roomsError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 mb-6 text-xs font-sans">
                  {roomsError}
                </div>
              )}

              {roomsLoading ? (
                <div className="py-20 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gold border-r-2 mx-auto mb-4"></div>
                  <span className="eyebrow text-gold text-xs">LOADING ROOMS...</span>
                </div>
              ) : rooms.length === 0 ? (
                <div className="bg-white border border-brown/10 p-12 text-center text-taupe font-sans text-sm">
                  No rooms catalogued in database yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms.map((r, i) => (
                    <div
                      key={r.id}
                      className="bg-white border border-brown/10 p-5 flex gap-5 items-start font-sans"
                    >
                      <div
                        onClick={() => {
                          setActiveGalleryRoom(r);
                          setActiveGalleryIdx(0);
                        }}
                        className="w-24 h-18 bg-brown/10 shrink-0 overflow-hidden relative cursor-zoom-in group"
                        title="Click to view gallery"
                      >
                        <img
                          src={
                            r.imageUrl
                              ? r.imageUrl.startsWith("http") ||
                                r.imageUrl.startsWith("/") ||
                                r.imageUrl.startsWith("data:")
                                ? r.imageUrl
                                : `${process.env.NEXT_PUBLIC_API_URL}${r.imageUrl}`
                              : "/placeholder-room.jpg"
                          }
                          alt={r.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                          <span className="text-[7px] text-white tracking-widest font-semibold uppercase">
                            View Gallery
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between mb-1 gap-2">
                          <h3 className="font-display text-xl text-brown leading-tight truncate">
                            {r.name}
                          </h3>
                          <span className="eyebrow text-gold text-[10px] shrink-0 font-semibold">
                            {r.price}
                          </span>
                        </div>
                        <span className="eyebrow text-[9px] bg-brown/5 text-brown/60 px-2 py-0.5 rounded inline-block mb-2">
                          {r.category}
                        </span>
                        <p className="text-xs text-taupe leading-relaxed line-clamp-2">
                          {r.description}
                        </p>
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-brown/5">
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-taupe font-sans">
                            {r.size && <span>Size: {r.size}</span>}
                            {r.size && <span className="text-gold/40">·</span>}
                            <span>Capacity: {r.capacity}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditRoom(r)}
                              className="eyebrow text-[9px] text-gold border border-gold/30 px-2.5 py-1 hover:bg-gold hover:text-brown transition-colors uppercase font-medium"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Add Room form */}
            <div className="bg-white border border-brown/10 p-6 lg:p-8 sticky top-28 shadow-sm">
              <span className="eyebrow text-gold text-[10px] block mb-2">CURATOR</span>
              <h3 className="font-display text-2xl mb-6">
                {editingRoom
                  ? `Edit Price: ${editingRoom.name}`
                  : "Select a room to edit its price"}
              </h3>

              {addRoomError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 mb-6 text-xs font-sans">
                  {addRoomError}
                </div>
              )}

              {addRoomSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-600 p-4 mb-6 text-xs font-sans">
                  {addRoomSuccess}
                </div>
              )}

              {editingRoom ? (
                <form onSubmit={handleAddRoom} className="space-y-4 text-xs font-sans">
                  <div className="mb-6 p-4 bg-brown/[0.02] border border-brown/10">
                    <span className="eyebrow text-brown/40 text-[9px] block mb-3">
                      ROOM IMAGES IN USE (FRONTEND)
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {editingRoom.category === "Deluxe" && (
                        <>
                          <img
                            src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Froom-deluxe.jpg&w=128&q=75"
                            alt="Deluxe"
                            className="w-16 h-12 object-cover border border-brown/10"
                          />
                          <img
                            src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Froom-deluxe-2.png&w=128&q=75"
                            alt="Deluxe"
                            className="w-16 h-12 object-cover border border-brown/10"
                          />
                          <img
                            src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Froom-deluxe-3.png&w=128&q=75"
                            alt="Deluxe"
                            className="w-16 h-12 object-cover border border-brown/10"
                          />
                        </>
                      )}
                      {editingRoom.category === "Premium" && (
                        <>
                          <img
                            src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Froom-premium.jpg&w=128&q=75"
                            alt="Premium"
                            className="w-16 h-12 object-cover border border-brown/10"
                          />
                          <img
                            src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Froom-premium-2.png&w=128&q=75"
                            alt="Premium"
                            className="w-16 h-12 object-cover border border-brown/10"
                          />
                          <img
                            src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Froom-premium-3.png&w=128&q=75"
                            alt="Premium"
                            className="w-16 h-12 object-cover border border-brown/10"
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="eyebrow text-brown/40 text-[9px] block mb-1">
                      BASE PRICE / NIGHT *
                    </label>
                    <input
                      type="text"
                      required
                      value={roomPrice}
                      onChange={(e) => setRoomPrice(e.target.value)}
                      placeholder="e.g. 1500"
                      className="w-full border border-brown/12 px-3 py-2 bg-transparent text-sm focus:border-gold outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="eyebrow text-brown/40 text-[9px] block mb-1">
                        SPECIAL PRICE
                      </label>
                      <input
                        type="text"
                        value={specialPrice}
                        onChange={(e) => setSpecialPrice(e.target.value)}
                        placeholder="e.g. 2500"
                        className="w-full border border-brown/12 px-3 py-2 bg-transparent text-sm focus:border-gold outline-none"
                      />
                    </div>
                    <div>
                      <label className="eyebrow text-brown/40 text-[9px] block mb-1">
                        START DATE
                      </label>
                      <input
                        type="date"
                        value={specialPriceStartDate}
                        onChange={(e) => setSpecialPriceStartDate(e.target.value)}
                        className="w-full border border-brown/12 px-3 py-2 bg-transparent text-sm focus:border-gold outline-none text-brown"
                      />
                    </div>
                    <div>
                      <label className="eyebrow text-brown/40 text-[9px] block mb-1">
                        END DATE
                      </label>
                      <input
                        type="date"
                        value={specialPriceEndDate}
                        onChange={(e) => setSpecialPriceEndDate(e.target.value)}
                        className="w-full border border-brown/12 px-3 py-2 bg-transparent text-sm focus:border-gold outline-none text-brown"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={cancelEditRoom}
                      className="flex-1 border border-brown/25 text-brown eyebrow py-4 hover:border-red-500 hover:text-red-500 transition-colors text-[10px]"
                    >
                      Cancel Edit
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-brown text-ivory eyebrow py-4 hover:bg-gold hover:text-brown transition-colors text-[10px]"
                    >
                      Save Price Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-sm text-taupe py-4">
                  Please select a room from the list on the left to edit its prices.
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox / Gallery Viewer Modal */}
      {activeGalleryRoom && (
        <div
          className="fixed inset-0 z-50 bg-brown/95 flex flex-col justify-center items-center font-sans"
          onClick={() => setActiveGalleryRoom(null)}
        >
          <div
            className="absolute top-4 right-4 text-ivory text-4xl cursor-pointer select-none hover:text-gold transition-colors p-2"
            onClick={() => setActiveGalleryRoom(null)}
          >
            &times;
          </div>

          <div
            className="relative max-w-4xl w-full flex items-center justify-between px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                const total = activeGalleryRoom.gallery?.length || 1;
                setActiveGalleryIdx((prev) => (prev - 1 + total) % total);
              }}
              className="text-ivory/60 hover:text-gold text-5xl leading-none p-4 select-none focus:outline-none transition-colors"
            >
              &#8249;
            </button>

            <div className="flex-1 flex justify-center items-center p-2">
              <img
                src={
                  activeGalleryRoom.gallery && activeGalleryRoom.gallery.length > 0
                    ? activeGalleryRoom.gallery[activeGalleryIdx]
                    : activeGalleryRoom.imageUrl || ""
                }
                alt={`${activeGalleryRoom.name} gallery`}
                className="max-h-[70vh] max-w-full object-contain border border-gold/20 shadow-2xl"
              />
            </div>

            <button
              onClick={() => {
                const total = activeGalleryRoom.gallery?.length || 1;
                setActiveGalleryIdx((prev) => (prev + 1) % total);
              }}
              className="text-ivory/60 hover:text-gold text-5xl leading-none p-4 select-none focus:outline-none transition-colors"
            >
              &#8250;
            </button>
          </div>

          <div className="text-gold/80 mt-4 text-xs font-semibold tracking-widest uppercase">
            Image {activeGalleryIdx + 1} of {activeGalleryRoom.gallery?.length || 1}
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deletingRoomId && (
        <div className="fixed inset-0 z-50 bg-brown/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-gold/30 max-w-md w-full p-6 text-center relative shadow-2xl animate-fade-up">
            <div className="text-red-500 text-4xl mb-3">&#9888;</div>
            <h3 className="font-display text-2xl text-brown mb-2">Delete Room</h3>
            <p className="text-sm text-taupe mb-6 font-sans leading-relaxed">
              Are you sure you want to delete this room? Please note that{" "}
              <strong className="text-red-600 font-semibold">
                once the room is deleted, it cannot be restored.
              </strong>
            </p>
            <div className="flex gap-4 font-sans text-xs">
              <button
                onClick={() => setDeletingRoomId(null)}
                className="flex-1 border border-brown/20 py-3 hover:bg-brown/5 transition-colors uppercase font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const id = deletingRoomId;
                  setDeletingRoomId(null);
                  await executeDeleteRoom(id);
                }}
                className="flex-1 bg-red-600 text-white py-3 hover:bg-red-700 transition-colors uppercase font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
