import { useRef, useEffect, useState } from "react";
import Head from "next/head";
import authurize from "@/lib/auth";
import { Button } from "@/components/ui/button";

const severity_lvl = {
  ระยะเริ่มต้น: "🟡",
  ระยะกลาง: "🟠",
  ระยะรุนแรง: "🔴",
};

function Map() {
  const [usersData, setUsersData] = useState({ detection: [] }); // เก็บข้อมูลทั้งหมดของผู้ใช้
  const [currentUserLocation, setCurrentUserLocation] = useState(null); // เก็บข้อมูลตำแหน่งผู้ใช้ที่ล็อกอิน
  const [detection_data, setDetection_data] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null); // สร้างตัวแปรอ้างอิงแผนที่
  const infoWindow = useRef(null); // สร้างตัวแปรอ้างอิง InfoWindow

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

    if (usersData.length > 0 && currentUserLocation) {
      // Google Map
      if (typeof window !== "undefined" && window.google) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: currentUserLocation, // ตั้งตำแหน่งเริ่มต้นเป็นตำแหน่งของผู้ใช้ที่ล็อกอิน
          zoom: 16, // ปรับระยะซูมตามความเหมาะสม
        });

        mapInstance.current = map; // เก็บการอ้างอิงแผนที่
        infoWindow.current = new window.google.maps.InfoWindow(); // สร้าง InfoWindow

        // หมุดของผู้ใช้ที่ล็อกอิน
        const currentUserMarker = new window.google.maps.Marker({
          position: currentUserLocation,
          map: map,
          title: "Current User",
        });

        // เพิ่ม event listener ให้หมุดของผู้ใช้ที่ล็อกอิน
        currentUserMarker.addListener("click", () => {
          infoWindow.current.setContent("You are here!"); // ข้อความที่จะแสดงใน InfoWindow
          infoWindow.current.open(map, currentUserMarker); // แสดง InfoWindow
        });

        // เพิ่มมาร์คเกอร์ให้กับผู้ใช้ทุกคน
        usersData.forEach((user) => {
          const location = {
            lat: parseFloat(user.latitude),
            lng: parseFloat(user.longitude),
          };

          const marker = new window.google.maps.Marker({
            position: location,
            map: map,
            title: `User ID: ${user.user_id}`,
          });

          // เพิ่ม event listener ให้มาร์คเกอร์ของผู้ใช้
          marker.addListener("click", () => {
            const detections = detection_data?.filter((det) => det.uid === user.user_id) || []; // ดึงข้อมูลทั้งหมดที่เกี่ยวข้องกับ user_id

let detectionInfo = ""; // เก็บข้อมูลระดับความรุนแรงและวันที่ทั้งหมด
if (detections.length > 0) {
  detections.forEach((detection) => {
    const lvl = severity_lvl[detection.svt_lvl] || "Unknown"; // ใช้ระดับความรุนแรงหรือ "Unknown" หากไม่มีข้อมูล
    detectionInfo += `
      <li>
        <strong>ระดับ:</strong> ${lvl} 
        <br>
        <strong>วันที่:</strong> ${new Date(detection.date).toDateString()}
      </li>
    `;
  });
} else {
  detectionInfo = "<li>ไม่พบข้อมูลการวิเคราะห์</li>"; // แสดงข้อความกรณีไม่มีข้อมูล
}

const userInfo = `
  <div class="overflow-y-auto max-h-52 w-64">
    <strong>ชื่อผู้ใช้:</strong> ${user.username} <br>
    <ul>${detectionInfo}</ul> <!-- แสดงข้อมูลทั้งหมดในรูปแบบรายการ -->
  </div>
`;

infoWindow.current.setContent(userInfo); // ข้อความที่จะแสดงใน InfoWindow
infoWindow.current.open(map, marker); // แสดง InfoWindow

          });
        });
      }
    }
  }, [usersData, currentUserLocation, detection_data]);

  const debug = () => {
    console.log(usersData);
  };

  return (
    <>
      <Head>
        <title>แสดงตำแหน่งโรค</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen flex flex-col justify-start items-center py-4">
  <h1 className="text-center text-3xl md:text-5xl font-bold py-4 px-4 text-white">
    Durian Epidemic Geospatial Report System
  </h1>
  <h1 className="text-center text-2xl md:text-4xl font-bold py-4 px-4 text-white">
    แสดงจุดพบโรคละแวกใกล้เคียง
  </h1>

  {/* Container หลักสำหรับแผนที่และกล่องตัวอธิบาย */}
  <div className="flex justify-center items-start w-full max-w-6xl gap-4">
    {/* กล่องแผนที่ */}
    <div
      ref={mapRef}
      style={{ width: "90%", height: "500px" }}
      className="bg-white rounded-lg shadow-lg"
    ></div>

    {/* กล่องตัวอธิบาย */}
    <div className="space-y-4">
      <ul className="space-y-2 text-white">
        <li>🟡ระยะเริ่มต้น</li>
        <li>🟠ระยะกลาง</li>
        <li>🔴ระยะรุนแรง</li>
      </ul>
    </div>
  </div>
</div>



      


      {/* <button onClick={debug}>Console</button> */}
    </>
  );
}

export default authurize(Map);
