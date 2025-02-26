import React, { useState, useEffect } from "react";
import authurize from "@/lib/auth";
import * as XLSX from "xlsx";
import { Upload, RefreshCcw } from "lucide-react";
import Head from "next/head";

function ImportXLSX() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState(null); // state สำหรับเก็บข้อมูลที่กำลังแก้ไข

  // ฟังก์ชันดึงข้อมูลจาก update_durian.php
  const fetchData = () => {
    setLoading(true);
    setError("");

    fetch("http://localhost/durian/database/update_durian.php")
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          setData(result.data);
        } else {
          setError("No data found.");
        }
      })
      .catch((error) => {
        setError("Error fetching data: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ฟังก์ชันอัปโหลดและอ่านไฟล์ XLSX
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      console.log("Excel Data:", jsonData);
      setData(jsonData); // อัปเดตข้อมูลในตาราง
    };
    reader.readAsArrayBuffer(file);
  };

  // ฟังก์ชันเพื่อเริ่มการแก้ไขข้อมูล
  const startEditing = (item) => {
    setEditingItem({ ...item }); // กำหนดให้เก็บข้อมูลที่กำลังแก้ไข
  };

  // ฟังก์ชันเพื่อยกเลิกการแก้ไข
  const cancelEditing = () => {
    setEditingItem(null);
  };

  // ฟังก์ชันเพื่อบันทึกการแก้ไข
  const saveEditing = () => {
    const updatedData = data.map((item) =>
      item.id === editingItem.id ? editingItem : item
    );
    setData(updatedData); // อัปเดตข้อมูลในตาราง
    setEditingItem(null); // ปิดโหมดแก้ไข
  };

  return (
    <>
      <Head>
        <title>Show Disease Location</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen flex flex-col justify-start items-center py-4">
        <h1 className="text-center text-3xl md:text-5xl font-bold py-4 px-4 text-white">
          Durian Epidemic Geospatial Report System
        </h1>
        <h1 className="text-center text-2xl md:text-4xl font-bold py-4 px-4 text-white">
          Show Nearby Disease Hotspots
        </h1>

        {/* ปุ่มอัปโหลดไฟล์ & โหลดเทมเพลต & รีเฟรชข้อมูล */}
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            className="hidden"
            id="file-upload"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-[#A3D1C6]"
          >
            <Upload className="mr-2" /> Import XLSX
          </label>

					<label className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-[#A3D1C6]"
          ><a href="/template_import.xlsx"
						download>Download excel template</a></label>

          <button
            onClick={fetchData}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            <RefreshCcw className="mr-2" /> Refresh Data
          </button>
        </div>

        {/* ตารางแสดงข้อมูล */}
        <div className="w-full justify-items-center">
          <h2 className="text-xl font-semibold mb-4 text-white">Search Results:</h2>

          {/* แสดงสถานะ Loading */}
          {loading && <p className="text-white">Loading data...</p>}

          {/* แสดง Error ถ้ามี */}
          {error && <p className="text-red-500">{error}</p>}

          {/* ตารางข้อมูล */}
          <div className="bg-gray-100 p-3 rounded-lg shadow">
            <table className="w-full border-collapse border border-gray-300 ">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Severity Level</th>
                  <th className="border border-gray-300 px-4 py-2">Treatment</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th> {/* คอลัมน์สำหรับปุ่ม Edit */}
                </tr>
              </thead>
              <tbody>
                {editingItem ? (
                  // แสดงแถวที่กำลังแก้ไข
                  <tr key={editingItem.id} className="bg-white">
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        value={editingItem.severity_level}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            severity_level: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        value={editingItem.treatment_methods}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            treatment_methods: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        onClick={saveEditing}
                      >
                        Save
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  // แสดงข้อมูลทั้งหมดถ้าไม่มีการแก้ไข
                  data.map((item, index) => (
                    <tr key={index} className="bg-white">
                      <td className="border border-gray-300 px-4 py-2">{item.severity_level}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.treatment_methods}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                          onClick={() => startEditing(item)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default authurize(ImportXLSX);
