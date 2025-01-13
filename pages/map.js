import { useRef, useEffect } from "react";
import Head from "next/head";
import authurize from "@/lib/auth";

function Map() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // จำลองตำแหน่งตัวอย่างสำหรับการแสดงแผนที่
    const exampleLocation = { lat: 13.736717, lng: 100.523186 }; // พิกัดกรุงเทพฯ
    const exampleLocation2 = { lat: 13.735717, lng: 100.522186 }; // พิกัดกรุงเทพฯ

    if (typeof window !== "undefined" && window.google) {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: exampleLocation,
        zoom: 17, // ระดับการซูม
      });

      // เพิ่ม marker ที่พิกัดตัวอย่าง
      new window.google.maps.Marker({
        position: exampleLocation,
        map: map,
        title: "ตำแหน่งตัวอย่าง",
      });
       
      new window.google.maps.Marker({
        position: exampleLocation2,
        map: map,
        title: "ตำแหน่งตัวอย่าง",
      });
    }
  }, []);

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
        <div className="bg-white p-8 mx-4 my-6 rounded-2xl shadow-lg w-full max-w-4xl">
          <div
            ref={mapContainerRef}
            style={{ width: "100%", height: "400px" }}
            className="rounded-lg"
          ></div>
        </div>
      </div>
    </>
  );
}

export default authurize(Map);
