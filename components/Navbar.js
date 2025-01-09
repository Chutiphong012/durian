import Link from 'next/link';

export default function Navbar() {
  return (
    <nav
      className="p-3 cd mx-4 my-2 rounded-2xl shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* ด้านซ้าย */}
        <div className="flex space-x-4 md:space-x-6">
          {/* โลโก้ */}
          <Link href="" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="32"
              height="32"
              className="text-gray-800"
            >
              <path d="m3.707 21.707 2.967-2.967a7.533 7.533 0 0 0 4.2 1.23 8.886 8.886 0 0 0 6.332-2.763C21.019 13.4 21.958 3.51 22 3.09a1 1 0 0 0-.289-.8 1.013 1.013 0 0 0-.8-.289 45.808 45.808 0 0 0-5.7.961 1 1 0 0 0-.714.64l-.649 1.834-.539-1.085a1 1 0 0 0-1.219-.5 13.782 13.782 0 0 0-5.295 2.94c-3.571 3.571-3.216 8.066-1.535 10.535l-2.967 2.967a1 1 0 0 0 1.414 1.414zm4.5-13.5a10.7 10.7 0 0 1 3.705-2.164l1.192 2.4a.98.98 0 0 0 .957.557 1 1 0 0 0 .881-.665L16.2 4.791a46.16 46.16 0 0 1 3.66-.647c-.367 2.694-1.48 9.066-4.063 11.649-2.788 2.788-5.945 2.457-7.668 1.5l4.582-4.582a1 1 0 0 0-1.414-1.414l-4.586 4.578C5.751 14.151 5.42 11 8.207 8.207z" />
            </svg>
          </Link>
          {/* ลิงก์เมนู */}
          <Link href="/" className="text-black hover:text-red-500 text-sm md:text-base">
            หน้าหลัก
          </Link>
          <Link href="/analyze" className="text-black hover:text-red-500 text-sm md:text-base">
            วิเคราะห์โรค
          </Link>
          <Link href="/map" className="text-black hover:text-red-500 text-sm md:text-base">
          แสดงตำแหน่งโรค
          </Link>
          
        </div>
        {/* ด้านขวา */}
        <div>
          <Link href="/profile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="h-8 w-8 text-gray-800 hover:opacity-80"
            >
              <path d="M16 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm0-12c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zM27 32a1 1 0 0 1-1-1v-6.115a6.95 6.95 0 0 0-6.942-6.943h-6.116A6.95 6.95 0 0 0 6 24.885V31a1 1 0 1 1-2 0v-6.115c0-4.93 4.012-8.943 8.942-8.943h6.116c4.93 0 8.942 4.012 8.942 8.943V31a1 1 0 0 1-1 1z" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
