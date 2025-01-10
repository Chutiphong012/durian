import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="p-3 cd mx-4 my-2 rounded-2xl shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        <div className="flex space-x-4 md:space-x-6">
         {/* โลโก้ */}
          <Link href="" className="flex items-center">
            <img 
              src="/img/logo.png" 
              alt="Logo"
              width="32"
              height="32"
              className="text-gray-800"
            />
          </Link>

          {/* เมนู */}
          <Link href="/" className="text-black hover:text-red-500 text-lg md:text-xl">
            หน้าหลัก
          </Link>
          <Link href="/analyze" className="text-black hover:text-red-500 text-lg md:text-xl">
            วิเคราะห์โรค
          </Link>
          <Link href="/map" className="text-black hover:text-red-500 text-lg md:text-xl">
            แสดงตำแหน่งโรค
          </Link>
        </div>
        {/* โปรไฟล์ */}

        <div className="flex justify-center space-x-2">
        <span className="text-black text-lg md:text-xl hover:text-red-500">
            ข้อมูลสมาชิก
          </span>
        <Link href="/profile">
        
          <img
            src="/img/profile.png"
            alt="Profile"
            width="50"
            height="50"
            className="h-8 w-8 text-gray-800 hover:opacity-80"
          />
        </Link>
        </div>
        <div>
          
            <button
              type="button"
              
              className="py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              ออกจากระบบ
            </button>
          
        </div>
      </div>
    </nav>
  );
}
