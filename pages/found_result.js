"use client";
import { useState,useEffect,useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import authurize from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
// import { UploadButton } from "@/components/ui/uploadButton";

const symtomMap = [
  {
    severity: "Early stage",
    symtom:
      "The leaves turn pale yellow. The trunk, branches, and roots have dark, watery bark.",
  },
  {
    severity: "Intermediate stage",
    symtom: "Leaves will start to fall off, wounds around the roots, trunk and branches will become larger.",
  },
  {
    severity: "Severe stage",
    symtom: "Many leaves fall or all leaves fall from the tree. The roots are severely damaged. The trunk rots and the tree dies.",
  },
];

function Analyze() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
  });

  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [treatment, setTreatment] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const { toast } = useToast();
  const [imagePreview, setImage] = useState();
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const savedImage = localStorage.getItem("image");
    if (savedImage) {
      setImage(savedImage);
    }
  }, []);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
        script.async = true;
        script.onload = initMap;
        document.body.appendChild(script);
      } else {
        initMap();
      }
    };
  
    const initMap = () => {
      // ตรวจสอบว่าเบราว์เซอร์รองรับ Geolocation หรือไม่
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
  
            const map = new window.google.maps.Map(mapRef.current, {
              center: userLocation,  // ตั้งศูนย์กลางที่ตำแหน่งปัจจุบันของผู้ใช้
              zoom: 15,
            });
  
            const marker = new window.google.maps.Marker({
              position: userLocation,
              map: map,
              draggable: true,
            });
  
            markerRef.current = marker;
  
            // อัปเดตค่า latitude และ longitude เมื่อหมุดถูกลาก
            marker.addListener("dragend", () => {
              const pos = marker.getPosition();
              setFormData((prev) => ({
                ...prev,
                latitude: pos.lat().toFixed(6),
                longitude: pos.lng().toFixed(6),
              }));
            });
  
            // อัปเดตค่า latitude และ longitude ทันทีที่โหลดแผนที่
            setFormData((prev) => ({
              ...prev,
              latitude: userLocation.lat.toFixed(6),
              longitude: userLocation.lng.toFixed(6),
            }));
          },
          (error) => {
            console.error("Error getting location: ", error);
            alert("ไม่สามารถดึงตำแหน่งปัจจุบันได้ โปรดเปิด GPS แล้วลองใหม่");
            // ถ้าไม่สามารถดึงตำแหน่งปัจจุบันได้ ใช้ตำแหน่งดีฟอลต์ (กรุงเทพฯ)
            fallbackLocation();
          }
        );
      } else {
        alert("เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง");
        fallbackLocation();
      }
    };
  
    const fallbackLocation = () => {
      const defaultLocation = { lat: 13.736717, lng: 100.523186 }; // Bangkok
  
      const map = new window.google.maps.Map(mapRef.current, {
        center: defaultLocation,
        zoom: 10,
      });
  
      const marker = new window.google.maps.Marker({
        position: defaultLocation,
        map: map,
        draggable: true,
      });
  
      markerRef.current = marker;
  
      marker.addListener("dragend", () => {
        const pos = marker.getPosition();
        setFormData((prev) => ({
          ...prev,
          latitude: pos.lat().toFixed(6),
          longitude: pos.lng().toFixed(6),
        }));
      });
  
      setFormData((prev) => ({
        ...prev,
        latitude: defaultLocation.lat.toFixed(6),
        longitude: defaultLocation.lng.toFixed(6),
      }));
    };
  
    loadGoogleMaps();
  }, []);
  

  const disease_record = async (e) => {
    e.preventDefault();
  
    // แปลง selectedStage เป็นตัวเลข
    let severityLevel = 0;
    if (selectedStage === "Early stage") {
      severityLevel = 1;
    } else if (selectedStage === "Intermediate stage") {
      severityLevel = 2;
    } else if (selectedStage === "Severe stage") {
      severityLevel = 3;
    }

    try {
      const res = await fetch("http://localhost/durian/database/detection.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: localStorage.getItem("userId"),
          severity_lvl: severityLevel,
          latitude_detec: formData.latitude,
          longitude_detec: formData.longitude
        }),
      });
  
      const data = await res.json();
  
      if (data.status === "success") {
        toast({ title: "แจ้งเตือน", description: "เพิ่มสำเร็จ" });

        //กำหนดให้ isSubmit เป็น true หลังบันทึกสำเร็จ
        setIsSubmit(true);

        // โหลดข้อมูลการรักษาหลังจากบันทึกข้อมูลเสร็จ
        getTreatmentData(severityLevel);

      } else {
        toast({ title: "แจ้งเตือน", description: "เพิ่มไม่สำเร็จ: " + data.message });
      }
    } catch (err) {
      console.error("❌ Error:", err);
    }

    console.log("🚀 Data to send:");
    console.log("UID:", localStorage.getItem("userId"));
    console.log("Severity Level:", selectedStage);
    console.log("Latitude:", formData.latitude);
    console.log("Longitude:", formData.longitude);
  
  };
  

  const getTreatmentData = async (severityLevel) => {
    console.log("🚀 Requesting Treatment for Severity Level:", severityLevel);
    try {
        const res = await fetch("http://localhost/durian/database/get_treatment.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ severity_lvl: severityLevel })
        });

        const data = await res.json();
        console.log("✅ API Response:", data);

        if (data.success) {
            setTreatment(data.treatment);
            console.log("🎯 Treatment Set:", data.treatment);
        } else {
            toast({
                title: "Error",
                description: "ไม่สามารถดึงข้อมูลการรักษาได้",
            });
        }
    } catch (err) {
        console.error("❌ Error fetching treatment data:", err);
    }
};


  
  const handleChange = (value) => {
    setSelectedStage(value);
  
    // แปลง selectedStage เป็นตัวเลข
    let severityLevel = 0;
    if (value === "Early stage") {
      severityLevel = 1;
    } else if (value === "Intermediate stage") {
      severityLevel = 2;
    } else if (value === "Severe stage") {
      severityLevel = 3;
    }
  
    // ดึงข้อมูลการรักษาจากฐานข้อมูล
    getTreatmentData(severityLevel);
  };
  

  return (
    <>
      <Head>
        <title>Disease analysis</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen">
        <form onSubmit={disease_record}>
          <div className="mb-10">
            <h1 className="text-center text-3xl md:text-5xl font-bold py-4 px-4 text-white">
              Durian Epidemic Geospatial Report System
            </h1>
            <h1 className="text-center text-2xl md:text-4xl font-bold py-4 px-4 text-white">
              Disease analysis
            </h1>

            <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
              <div className="mb-6">
                
                  <div className="mt-4 text-center">
                    {/* <h3>ตัวอย่างรูปภาพ:</h3> */}
                    <img src={imagePreview} alt="Uploaded" className="w-full h-auto" />
                  </div>
                
              
              </div>

              {/* ////////////////////////////////////////////////////////////////// */}
              {/* ปุ่มเลือกผลการวิเคราะห์ */}
              <div className="bg-red-200 text-xl p-5 text-center">
                <h1>Analysis results found root rot disease.</h1>
              </div>
              {/* ////////////////////////////////////////////////////////////////// */}
              {/* แสดงผลการวิเคราะห์ */}
              <div className="mt-4 mb-2">
                <h1 className="text-lg">Please specify symptoms</h1>
              </div>

              <div>
                <RadioGroup
                  className="flex flex-col gap-4 mt-4"
                  value={selectedStage}
                  name="severity"
                  onValueChange={handleChange}
                >
                  {symtomMap.map((items, index) => {
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={items.severity}
                          name="severity"
                          id={`option-${index}`}
                        />
                        <Label
                          htmlFor={`option-${index}`}
                          style={{ fontSize: "17px" }}
                        >
                          {items.symtom}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>


          <div className="space-y-2 mt-4">
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
      

              <div className="flex flex-col justify-center items-center mt-4">
                <Button
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-700 px-8"
                >
                  Save
                </Button>
              </div>

              {/* เพิ่ม Radio Button ในส่วนนี้ */}
            </div>
          </div>
        </form>

        <div>
        {isSubmit && treatment && (
          <Card className="max-w-xl mx-auto text-lg">
            <div className="mt-5 ml-4">
              <CardTitle>Treatment advice</CardTitle>
              <CardDescription className="flex">
                It is a root rot disease at the level:
                <p className="text-red-500 ml-2">{selectedStage}</p>
              </CardDescription>
            </div>
            <CardContent className="mt-4">
              <div className="bg-gray-100 p-4 rounded-md">
                {treatment} {/* แสดงข้อมูลการรักษาที่ดึงมา */}
              </div>
            </CardContent>
          </Card>
        )}

        </div>

      </div>

      <Toaster />
    </>
  );
}

export default authurize(Analyze);
