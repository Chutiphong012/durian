import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link"; // import Link from Next.js

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    latitude: "",
    longitude: "",
  });
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    // Google Map
    if (typeof window !== "undefined" && window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 13.736717, lng: 100.523186 }, // Default location (Bangkok)
        zoom: 12,
      });

      // Search Box
      const input = searchBoxRef.current;
      const searchBox = new window.google.maps.places.SearchBox(input);

      // Bias the SearchBox results towards current map bounds
      map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
      });

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;
        const place = places[0];
        const location = place.geometry.location;

        // Update map center and add marker
        map.setCenter(location);
        map.setZoom(15);

        addMarker(location.lat(), location.lng(), map);
      });

      // Click to add marker
      map.addListener("click", (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        addMarker(lat, lng, map);
      });

      // Add marker
      const addMarker = (lat, lng, map) => {
        // Remove existing marker if any
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        // Add a new marker
        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          draggable: true,
        });

        markerRef.current = marker;

        // Update formData with the marker's position
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));

        // Update formData on marker drag
        marker.addListener("dragend", () => {
          const position = marker.getPosition();
          setFormData((prev) => ({
            ...prev,
            latitude: position.lat(),
            longitude: position.lng(),
          }));
        });
      };
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Placeholder function for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("ระบบยังไม่พร้อมใช้งาน กรุณาลองใหม่ในภายหลัง");
  };

  return (
    <>
      <Head>
        <title>สมัครสมาชิก</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <h1 className="text-center text-2xl md:text-4xl font-bold py-14 px-4 text-white mt-8">
        Durian Epidemic Geospatial Report System
      </h1>
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg ">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          สมัครสมาชิก
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ฟอร์ม */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">ชื่อ</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">อีเมล</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">รหัสผ่าน</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">ค้นหา</label>
            <input
              ref={searchBoxRef}
              type="text"
              placeholder="ค้นหาสถานที่ใกล้เคียงเพื่อปักตำแหน่งสวน"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">ปักตำแหน่งสวน</label>
            <div
              ref={mapRef}
              className="w-full h-96 border rounded-md bg-gray-100"
            ></div>
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">ละติจูด</label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">ลองจิจูด</label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              สมัครสมาชิก
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link href="/login" className="text-blue-500 underline">
            เป็นสมาชิกอยู่แล้ว? เข้าสู่ระบบเลย!
          </Link>
        </div>
      </div>
    </>
  );
}
