import React, { useState, useEffect } from "react";
import Head from "next/head";

function ImportXLSX() {
  const [data, setData] = useState([]);
  const [severityList, setSeverityList] = useState([]);
  const [newSeverityId, setNewSeverityId] = useState("");
  const [newTreatmentMethods, setNewTreatmentMethods] = useState("");
  const [showForm, setShowForm] = useState(false); // 🔹 เพิ่ม state สำหรับซ่อน/แสดงฟอร์ม
  const [editRowId, setEditRowId] = useState(null);
  const [editSeverityId, setEditSeverityId] = useState("");
  const [editTreatmentMethods, setEditTreatmentMethods] = useState("");

  const fetchData = () => {
    fetch("http://localhost/durian/database/get_durian.php")
      .then((response) => response.json())
      .then((result) => setData(result.data || []))
      .catch(() => setData([]));
  };

  const fetchSeverity = () => {
    fetch("http://localhost/durian/database/get_severity.php")
      .then((response) => response.json())
      .then((result) => setSeverityList(result.data || []))
      .catch(() => setSeverityList([]));
  };

  useEffect(() => {
    fetchData();
    fetchSeverity();
  }, []);

  const handleAddTreatment = async () => {
    if (!newSeverityId || !newTreatmentMethods) {
      alert("Please select a severity level and provide treatment methods.");
      return;
    }

    const payload = { severity_id: newSeverityId, treatment_methods: newTreatmentMethods };

    try {
      const response = await fetch("http://localhost/durian/database/add_treatment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Treatment added successfully");
        fetchData();
        setNewSeverityId("");
        setNewTreatmentMethods("");
        setShowForm(false); // 🔹 ซ่อนฟอร์มหลังเพิ่มข้อมูลสำเร็จ
      } else {
        alert("Failed to add treatment: " + result.message);
      }
    } catch (error) {
      console.error("Error adding treatment:", error);
    }
  };

  const handleEdit = (item) => {
    setEditRowId(item.treatment_id);
    setEditSeverityId(item.severity_id);
    setEditTreatmentMethods(item.treatment_methods);
  };

  const handleCancelEdit = () => {
    setEditRowId(null);
    setEditSeverityId("");
    setEditTreatmentMethods("");
  };

  const handleUpdateTreatment = async () => {
    console.log("Edit Row ID:", editRowId); // ✅ ตรวจสอบค่าก่อนส่ง

  if (!editRowId || !editSeverityId || !editTreatmentMethods) {
    alert("Missing required fields.");
    return;
  }

    const payload = {
      treatment_id: editRowId,
      severity_id: editSeverityId,
      treatment_methods: editTreatmentMethods,
    };
    console.log("Payload being sent:", payload); // 🔍 Debug ตรวจสอบค่า
  
    try {
      console.log("Sending request to update treatment:", payload); // ตรวจสอบข้อมูลที่ส่งไป
      const response = await fetch("http://localhost/durian/database/update_treatment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      console.log("API Response:", result); // ตรวจสอบผลการตอบกลับจาก API
  
      if (result.status === "success") {
        alert("Treatment updated successfully");
        fetchData();
        setEditRowId(null);
      } else {
        alert("Failed to update treatment: " + result.message);
      }
    } catch (error) {
      console.error("Error updating treatment:", error);
    }
  };
  

  return (
    <>
      <Head>
        <title>Manage Treatment</title>
      </Head>
      <div className="min-h-screen flex flex-col justify-start items-center py-4">
      <h1 className="text-center text-3xl md:text-5xl font-bold py-4 px-4 text-white">
          Durian Epidemic Geospatial Report System
      </h1>
      <h1 className="text-center text-2xl md:text-4xl font-bold py-4 px-4 text-white">
          Manage treatment
      </h1>

        {/* ปุ่ม Add Treatment */}
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-lg mb-4"
          onClick={() => setShowForm(true)} // 🔹 กดปุ่มแล้วแสดงฟอร์ม
        >
          Add Treatment
        </button>

        {/* ฟอร์มเพิ่ม Treatment (แสดงเมื่อ showForm เป็น true) */}
        {showForm && (
          <div className="w-full bg-gray-100 p-4 rounded-lg shadow mb-4">
            <h3 className="text-xl font-semibold mb-4">Add New Treatment</h3>

            {/* Dropdown เลือก Severity Level */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Severity Level</label>
              <select
                value={newSeverityId}
                onChange={(e) => setNewSeverityId(e.target.value)}
                className="border p-2 w-full"
              >
                <option value="">Select Severity Level</option>
                {severityList.map((severity) => (
                  <option key={severity.severity_id} value={severity.severity_id}>
                    {severity.severity_level}
                  </option>
                ))}
              </select>
            </div>

            {/* ช่องกรอก Treatment Methods */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Treatment Methods</label>
              <input
                type="text"
                value={newTreatmentMethods}
                onChange={(e) => setNewTreatmentMethods(e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            {/* ปุ่ม Submit และ Cancel */}
            <div className="flex space-x-4">
            <button
              onClick={handleAddTreatment} // 🔹 เรียกใช้ handleAddTreatment เมื่อกดปุ่ม
              className="bg-green-500 text-white px-6 py-2 rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg ml-2"
            >
            Cancel
            </button>
            </div>
          </div>
        )}

        {/* แสดงข้อมูล Treatment */}
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4 text-white">Treatment Data:</h2>
          <div className="bg-gray-100 p-3 rounded-lg shadow">
            <table className="w-full border-collapse border border-gray-300">
            <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Severity Level</th>
                  <th className="border px-4 py-2">Treatment</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
            {editRowId !== null
              ? data
                  .filter((item) => item.treatment_id === editRowId) // ✅ แสดงเฉพาะแถวที่ต้องการแก้ไข
                  .map((item) => (
                    
                    <tr key={item.treatment_id} className="bg-white">
                      <td className="border px-4 py-2">
                        <select
                          value={editSeverityId}
                          onChange={(e) => setEditSeverityId(e.target.value)}
                          className="border p-2 w-full"
                        >
                          {severityList.map((severity) => (
                            <option key={severity.severity_id} value={severity.severity_id}>
                              {severity.severity_level}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          value={editTreatmentMethods}
                          onChange={(e) => setEditTreatmentMethods(e.target.value)}
                          className="border p-2 w-full"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <button 
                        onClick={handleUpdateTreatment}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg">
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 text-white px-6 py-2 rounded-lg ml-2"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))
              : data.map((item) => (
                  <tr key={item.treatment_id} className="bg-white">
                    <td className="border px-4 py-2">{item.severity_level}</td>
                    <td className="border px-4 py-2">{item.treatment_methods}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>

            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImportXLSX;
