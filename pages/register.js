"use client";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link"; 
import { useRouter } from "next/router";
import redirect_login from "@/lib/redirect_login";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    latitude: "",
    longitude: "",
    occupation: "",
  });

  const [showPassword, setShowPassword] = useState(false);  // สถานะการแสดงรหัสผ่าน
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const searchBoxRef = useRef(null);
  const router = useRouter();
  const { toast } = useToast();
  
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
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          draggable: true,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png", // ใช้ URL ของ marker สีเขียว
          },
        });

        markerRef.current = marker;

        // Update formData with the marker's position
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost/durian/database/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        latitude: formData.latitude,
        longitude: formData.longitude,
        occupation: formData.occupation,
      }),
    });

    const data = await res.json();
    
    if (res.ok) {
      router.push("/login");
    } else if (res.status == 409) {
      toast({
        title: "แจ้งเตือน",
        description: "ชื่อผู้ใช้ซ้ำ",
      });
      console.log(data);
    } else {
      toast({
        title: "แจ้งเตือน",
        description: "ไม่สามารถสมัครสมาชิกได้",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Register</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <button
        type="button"
        onClick={() => router.push("/login")}
        className="absolute top-4 left-4 py-2 px-6 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        Log in
      </button>

      <h1 className="text-center text-2xl md:text-4xl font-bold py-14 px-4 text-white mt-8">
        Durian Epidemic Geospatial Report System
      </h1>
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg ">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ฟอร์ม */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">
              Username
            </label>
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
            <label className="block text-lg font-medium text-gray-600">
              Email
            </label>
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
            <label className="block text-lg font-medium text-gray-600">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2 right-2 text-gray-500"
              >
                {showPassword ? "🔓" : "🔒"} 
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">
              Find location
            </label>
            <input
              ref={searchBoxRef}
              type="text"
              placeholder="Find nearby places to pinpoint your garden"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">
              Pin the garden location
            </label>
            <div
              ref={mapRef}
              className="w-full h-96 border rounded-md bg-gray-100"
            ></div>
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">
              Latitude
            </label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">
              Longitude
            </label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">
              User type
            </label>
              <div className="flex space-x-4">
              <label className="flex items-center">
              <input
                  type="radio"
                  name="occupation"
                  value="farmer" // เกษตรกร
                  checked={formData.occupation === "farmer"}
                  onChange={handleChange}
                  required
                  className="mr-2"
              />
                Farmer
              </label>
              <label className="flex items-center">
              <input
                type="radio"
                name="occupation"
                value="government" // หน่วยงานราชการ
                checked={formData.occupation === "government"}
                onChange={handleChange}
                required
                className="mr-2"
              />
                Government officer
              </label>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="py-2 px-10 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Send
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link href="/login" className="text-blue-500 underline">
            Already a member? Log in now!
          </Link>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default redirect_login(Register);
