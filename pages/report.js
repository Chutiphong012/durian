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
 
function Report() {
  const [usersData, setUsersData] = useState({ detection: [] }); // เก็บข้อมูลทั้งหมดของผู้ใช้
  const [currentUserLocation, setCurrentUserLocation] = useState(null); // เก็บข้อมูลตำแหน่งผู้ใช้ที่ล็อกอิน
  const [detection_data, setDetection_data] = useState(null);
  const infoWindow = useRef(null); // สร้างตัวแปรอ้างอิง InfoWindow
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

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

  const fetchFilteredData = async () => {
    if (!startDate || !endDate) {
      alert("Please select start date and end date.");
      return;
    }
  
    setLoading(true);
    try {
      const res = await fetch("http://localhost/durian/database/report.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate }),
      });
  
      const data = await res.json();
      if (res.ok) {
        setFilteredData(data.data || []);
        setDetection_data(data.data || []); // 🎯 ใช้ callback เพื่อบังคับให้ `useEffect` ทำงาน
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };
  
    useEffect(() => {
      getUsersData();
      getDetection();
      getCurrentUserLocation(); // ดึงตำแหน่งผู้ใช้ที่ล็อกอิน
    }, []);

    useEffect(() => {
      if (!mapInstance.current && currentUserLocation) {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: currentUserLocation,
          zoom: 16,
        });
      }
    }, [currentUserLocation]);

    useEffect(() => {
      if (!mapInstance.current) return;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
  
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
          map: mapInstance.current,
          title: `Date: ${detection.date}`,
          icon: severityIcon[detection.svt_lvl] || "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });
        markersRef.current.push(marker);
      });
    }, [detection_data]);
    

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
        <li>🟡 Initial stage</li>
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

<div className="basis-64">
      <div className="flex flex-col items-center justify-center">
        {/* ปุ่มค้นหา */}
        <h2 className="text-2xl font-bold mb-4 text-white">Search</h2>
        <div className="space-y-4">
          {/* Start Date Input */}
          <div>
            <label className="block text-sm font-medium text-white">
              Start Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="YYYY-MM-DD"
              lang="en"
            />
          </div>

          {/* End Date Input */}
          <div>
            <label className="block text-sm font-medium text-white">
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full mt-1"
            />
          </div>

          {/* ปุ่มกดค้นหา */}
          <div>
            <Button
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-400"
              onClick={fetchFilteredData} // เชื่อมปุ่มค้นหากับฟังก์ชัน handleSearch
            >
              Search
            </Button>
          </div>
        </div>
      </div>
                </div>
            </div>
          </div>


          <div className="w-full justify-items-center">
              <h2 className="text-xl font-semibold mb-4 text-white">Search results:</h2>
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                {loading ? (
                  <p className="text-gray-500">Loading data...</p>
                ) : filteredData.length > 0 ? (
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">Date</th>
                        <th className="border border-gray-300 px-4 py-2">Username</th>
                        <th className="border border-gray-300 px-4 py-2">Severity level</th>
                        <th className="border border-gray-300 px-4 py-2">Latitude</th>
                        <th className="border border-gray-300 px-4 py-2">Longitude</th>
                      </tr>
                    </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={index} className="bg-white">
                        <td className="border border-gray-300 px-4 py-2">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.username ? item.username : "No data"} 
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.svt_lvl || "No data"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.latitude_detec ? item.latitude_detec : "No data"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.longitude_detec ? item.longitude_detec : "No data"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  </table>
                ) : (
                <p className="text-gray-500">There is no data matching the selected time period.</p>
              )}
  </div>
</div>



      {/* <button onClick={debug}>Console</button> */}
    </>
  );
}

export default authurize(Report);