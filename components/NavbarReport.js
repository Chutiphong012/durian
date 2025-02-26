import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NavbarReport = () => {
  const router = useRouter();
  const handleLogout = () => {
    // ล้างข้อมูลที่เกี่ยวข้องกับการเข้าสู่ระบบ เช่น การลบ token หรือ session
    // เปลี่ยนเส้นทางไปที่หน้า login
    localStorage.clear();
    router.push('/login');
  };
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
        <Link href="/report" className="text-black hover:text-red-500 text-lg md:text-xl">
          Disease detection report</Link>
        <Link href="/exportdata" className="text-black hover:text-red-500 text-lg md:text-xl">
          Export</Link>
        <Link href="/importdata" className="text-black hover:text-red-500 text-lg md:text-xl">
          Import</Link>
        </div>

        {/* โปรไฟล์ */}
        <div className=' flex gap-4 justify-center items-center'>
        <div className="flex justify-center space-x-2">
        <Link className='flex justify-center text-lg items-center gap-2 hover:text-red-500 ' href="/profilegorn">
        
        Profile
          <img
            src="/img/profile.png"
            alt="Profile"
            width="50"
            height="50"
            className="h-8 w-8 text-gray-800 hover:opacity-80"
          />
        </Link>
        </div>
            <button
              type="button"
              onClick={handleLogout}
              className="py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Log out
            </button>
          
        </div>
      </div>
    </nav>
  );
}
export default NavbarReport;