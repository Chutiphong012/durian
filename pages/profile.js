import { useState, useRef } from 'react';
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

  return (
    <>
      <Head>
        <title>สมัครสมาชิก</title>
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
