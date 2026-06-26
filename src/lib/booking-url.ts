export function bookingHref(room = "", checkIn = "", checkOut = "", guests = "") {
  const params = new URLSearchParams({ room, checkIn, checkOut, guests });
  return `/booking?${params.toString()}`;
}
