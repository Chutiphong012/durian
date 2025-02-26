export default function Footer() {
    return (
        <footer className="w-full bg-white text-gray-800 p-4 flex flex-col sm:flex-row items-center justify-between shadow-md mt-10">
            <div className="text-sm text-center sm:text-left mb-2 sm:mb-0">
                <span className="block">
                    Durian Epidemic Geospatial Report System
                </span>
            </div>
            <div className="text-sm text-gray-600 text-center sm:text-right">
                <span>© PSU 2024</span>
            </div>
        </footer>
    );
}
