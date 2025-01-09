import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

function Profile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    latitude: '',
    longitude: '',
  });
  const searchBoxRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันจัดการการส่งฟอร์ม
  const handleSubmit = (e) => {
    e.preventDefault();
    // ดำเนินการสมัครสมาชิกที่นี่
    console.log(formData);
  };

  useEffect(() => {
    // Google Map
    if (typeof window !== 'undefined' && window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 13.736717, lng: 100.523186 }, // Default location (Bangkok)
        zoom: 12,
      });

      // Search Box
      const input = searchBoxRef.current;
      const searchBox = new window.google.maps.places.SearchBox(input);

      // Bias the SearchBox results towards current map bounds
      map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds());
      });

      searchBox.addListener('places_changed', () => {
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
      map.addListener('click', (event) => {
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
        marker.addListener('dragend', () => {
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

  return (
    <>
      <Head>
        <title>แก้ไขข้อมูลสมาชิก</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          แก้ไขข้อมูลสมาชิก
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
        </form>
      </div>
    </>
  );
}

export default Profile;
