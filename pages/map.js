import { useRef, useEffect, useState } from "react";
import Head from "next/head";
import authurize from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const severity_lvl = {
  "Early stage": "🟡",
  "Intermediate stage": "🟠",
  "Severe stage": "🔴",
};

function Map() {
  const [usersData, setUsersData] = useState({ detection: [] }); // เก็บข้อมูลทั้งหมดของผู้ใช้
  const [currentUserLocation, setCurrentUserLocation] = useState(null); // เก็บข้อมูลตำแหน่งผู้ใช้ที่ล็อกอิน
  const [detection_data, setDetection_data] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null); // สร้างตัวแปรอ้างอิงแผนที่
  const infoWindow = useRef(null); // สร้างตัวแปรอ้างอิง InfoWindow
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUsersData = async () => {
    try {
      const res = await fetch("http://localhost/durian/database/mapdata.php");

      const data = await res.json();
      if (res.ok) {
        console.log(data);
        setUsersData(data.data); // เก็บข้อมูลทั้งหมดของผู้ใช้
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  const getCurrentUserLocation = async () => {
    const userId = localStorage.getItem("userId"); // ดึง userId จาก localStorage หรือที่เก็บข้อมูลผู้ใช้
    if (userId) {
      try {
        const res = await fetch(
          "http://localhost/durian/database/userdata.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: userId }),
          }
        );

        const data = await res.json();
        if (res.ok) {
          setCurrentUserLocation({
            lat: parseFloat(data.data.latitude),
            lng: parseFloat(data.data.longitude),
          });
        } else {
          console.error("Error fetching current user location");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
  };
  const getDetection = async () => {
    try {
      const res = await fetch(
        "http://localhost/durian/database/getDetection.php",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setDetection_data(data.data);
      } else {
        console.error("Error fetching current user location");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

    useEffect(() => {
    getUsersData();
    getDetection();
    getCurrentUserLocation(); // ดึงตำแหน่งผู้ใช้ที่ล็อกอิน
    }, []);

    useEffect(() => {
      if (detection_data && detection_data.length > 0 && currentUserLocation) {
        if (typeof window !== "undefined" && window.google) {
          const map = new window.google.maps.Map(mapRef.current, {
            center: currentUserLocation, // ตำแหน่งเริ่มต้นเป็นของผู้ใช้ที่ล็อกอิน
            zoom: 16, // ปรับซูมให้อยู่ในระดับที่มองเห็นหลายจุด
          });
    
          mapInstance.current = map;
          infoWindow.current = new window.google.maps.InfoWindow();
    
          // หมุดของผู้ใช้ที่ล็อกอิน (สีเขียว)
          const currentUserMarker = new window.google.maps.Marker({
            position: currentUserLocation,
            map: map,
            title: "Your Location",
            icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
          });
    
          currentUserMarker.addListener("click", () => {
            infoWindow.current.setContent("You are here!");
            infoWindow.current.open(map, currentUserMarker);
          });
    
          // วางหมุดจาก `detection_data`
          detection_data.forEach((detection) => {
            const location = {
              lat: parseFloat(detection.latitude_detec),
              lng: parseFloat(detection.longitude_detec),
            };
    
            const severityIcon = {
              "Early stage": "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
              "Intermediate stage": "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
              "Severe stage": "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            };
    
            const marker = new window.google.maps.Marker({
              position: location,
              map: map,
              title: `Date: ${detection.date}`,
              icon: severityIcon[detection.svt_lvl] || "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            });
    
            marker.addListener("click", () => {
              const content = `
                <div class="p-2">
                  <strong>Severity:</strong> ${severity_lvl[detection.svt_lvl] || "Unknown"} <br>
                  <strong>Date:</strong> ${new Date(detection.date).toDateString()} <br>
                  <strong>Username:</strong> ${detection.username || "Unknown"}
                </div>
              `;
    
              infoWindow.current.setContent(content);
              infoWindow.current.open(map, marker);
            });
          });
        }
      }
    }, [detection_data, currentUserLocation]);
    

  const debug = () => {
    console.log(usersData);
  };
  
  

  return (
    <>
      <Head>
        <title>Show disease location</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen flex flex-col justify-start items-center py-4">
        <h1 className="text-center text-3xl md:text-5xl font-bold py-4 px-4 text-white">
          Durian Epidemic Geospatial Report System
        </h1>
        <h1 className="text-center text-2xl md:text-4xl font-bold py-4 px-4 text-white">
        Show epidemic location
        </h1>
    

  {/* Container หลักสำหรับแผนที่และกล่องตัวอธิบาย */}
  <div className="flex flex-row justify-center items-start w-full max-w-7xl gap-2">
    {/* กล่องตัวอธิบาย */}
  <div className="space-y-4 basis-64">
      <ul className="space-y-3 text-white">
        <li>🟡 Early stage</li>
        <li>🟠 Intermediate stage</li>
        <li>🔴 Severe stage</li>
      </ul>
    </div>
    {/* กล่องแผนที่ */}
    <div
      ref={mapRef}
      style={{ width: "90%", height: "500px" }}
      className="bg-white rounded-lg shadow-lg basis-128"
    ></div>
            </div>
          </div>





      {/* <button onClick={debug}>Console</button> */}
    </>
  );
}

export default authurize(Map);
