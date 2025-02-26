import { useState } from "react";
import Head from "next/head";
import Link from "next/link"; 
import redirect_login from "@/lib/redirect_login";
import { useRouter } from "next/router";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);  // สถานะการแสดงรหัสผ่าน
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost/durian/database/login.php', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      })
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data);
      localStorage.setItem("userId", data.userId);
      alert("Login successful");
    if (data.occupation == "government"){
      router.push('/report');
    } else {
      router.push('/');
      }
    } else {
      const data = await res.json();
      console.log(data);
      alert("Email or password is incorrect.");
    }
  };

  return (
    <>
      <Head>
        <title>Log in</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <h1 className="text-center text-2xl md:text-4xl font-bold py-14 px-4 text-white mt-8">
        Durian Epidemic Geospatial Report System
      </h1>

      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4">Log in</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}  // เปลี่ยนประเภทของ input เมื่อคลิก
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}  // เปลี่ยนสถานะการแสดงรหัสผ่าน
                  className="absolute top-2 right-2 text-gray-500"
                >
                  {showPassword ? "🔓" : "🔒"} {/* สลับไอคอน */}
                </button>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 py-2 px-10"
              >
                Log in
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <Link href="/register" className="text-blue-500 underline">
              Not a member yet? Sign up now!
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default redirect_login(Login);