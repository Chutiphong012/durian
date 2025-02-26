import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import authurize from '@/lib/auth';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

function Profile() {
  const router = useRouter();
  const {toast} = useToast();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    latitude: '',
    longitude: '',
  });
  const [formPassword,setFormPassword] = useState({
    oldPassword:'',
    newPassword:'',
    confirmPassword:''
  })

  const searchBoxRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
 
  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handlePasswordChange = (e) =>{
  const {id,value} = e.target;

  setFormPassword((prevData)=>{
    return {
      ...prevData,
      [id]: value
    };
  })

  console.log(formPassword);
}
  // ฟังก์ชันจัดการการส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updateData = {
      uid: localStorage.getItem("userId"),
      username: formData.username,
      email: formData.email,
      latitude: formData.latitude,
      longitude: formData.longitude,
    };
  
    if (formPassword.oldPassword && formPassword.newPassword) {
      if (formPassword.newPassword !== formPassword.confirmPassword) {
        toast({
          title: "Password Error",
          description: "รหัสผ่านไม่ตรงกัน",
        });
        return;
      }
      updateData.oldPassword = formPassword.oldPassword;
      updateData.newPassword = formPassword.newPassword;
    }
  
    const res = await fetch("http://localhost/durian/database/update_user.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
  
    if (res.ok) {
      toast({
        title: "Successful",
        description: "เปลี่ยนข้อมูลผู้ใช้สำเร็จ",
      });
    } else if (res.status === 403) {
      toast({
        title: "Password Error",
        description: "รหัสผ่านไม่ถูกต้อง",
      });
    } else {
      toast({
        title: "Error",
        description: "ไม่สามารถเปลี่ยนข้อมูลผู้ใช้ได้",
      });
    }
  };
  
  

  // ฟังก์ชันจัดการออกจากระบบ
  // const handleLogout = () => {
  //   // ทำการล้างข้อมูลที่เกี่ยวข้องกับการเข้าสู่ระบบ เช่น การลบ token หรือ session
  //   // แล้วเปลี่ยนเส้นทางไปที่หน้า login
  //   router.push('/login');
  // };

  const getUserdata = async() =>{
   
    const res = await fetch("http://localhost/durian/database/userdata.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: localStorage.getItem("userId"),
        
      }),
    })
    const data = await res.json();

    if(res.ok){

      console.log(data);
      setFormData(data.data)
     
    }else{
      console.log("error")
      
    }
  }
  useEffect(()=>{
      getUserdata();
  },[])

  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      // Google Map
      if (typeof window !== 'undefined' && window.google) {
        const location = {
          lat: parseFloat(formData.latitude),  // Ensure latitude is a number
          lng: parseFloat(formData.longitude)  // Ensure longitude is a number
        };
  
        const map = new window.google.maps.Map(mapRef.current, {
          center: location, // Set center to the updated location
          zoom: 17,
        });
  
        // Create a new marker at the updated location
        new window.google.maps.Marker({
          position: location,
          map: map,
          title: "ตำแหน่งตัวอย่าง",
          icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
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
  
        // Add marker function
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
    }
  }, [formData]);  // Effect will run whenever formData changes
  

  return (
    <>
      <Head>
      <title>Edit member information</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <h1 className="text-center text-3xl md:text-5xl font-bold py-4 px-4 text-white">
        Durian Epidemic Geospatial Report System
      </h1>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Edit member information
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ฟอร์ม */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">Username</label>
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
            <label className="block text-lg font-medium text-gray-600">Email</label>
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
            <label className="block text-lg font-medium text-gray-600">Old password</label>
            <input
              type="text"
              name="password"
              value={formPassword.oldPassword}
            id='oldPassword'
              onChange={handlePasswordChange}
              
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">New password</label>
            <input
              type="text"
              name="password"
              value={formPassword.newPassword}
            id='newPassword'
              onChange={handlePasswordChange}
              
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">confirm password</label>
            <input
              type="text"
              name="password"
              value={formPassword.confirmPassword}
            id='confirmPassword'
              onChange={handlePasswordChange}
              
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">Find location</label>
            <input
              ref={searchBoxRef}
              type="text"
              placeholder="Find nearby places to pinpoint your garden"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">Pin the garden location</label>
            <div
              ref={mapRef}
              className="w-full h-96 border rounded-md bg-gray-100"
            ></div>
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">Latitude</label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-600">Latitude</label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* ปุ่มบันทึกการแก้ไข */}
          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              className="py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Save
            </button>

            {/* ปุ่มออกจากระบบ */}
           
          </div>
        </form>
      </div>
      <Toaster/>
    </>
  );
}

export default authurize(Profile);
