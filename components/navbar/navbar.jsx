import AspectRatioSharpIcon from '@mui/icons-material/AspectRatioSharp';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const router = useRouter();
    useEffect(() => {
        const storedUserData = localStorage.getItem("userData");
        if(storedUserData) {
            try {
                const parsedUserData = JSON.parse(storedUserData);
                setUserData(parsedUserData);
            } catch (error) {
                console.error('Failed to parse userData from localStorage', error);
                setUserData(null);
            }
            setIsLoggedIn(true);
        } else {
            setUserData(null);
            setIsLoggedIn(false);
        }

    }, []);
    
    return (
        <div className='flex justify-between p-3 border-b items-center' >
            <div className='flex ml-20' >
                <AspectRatioSharpIcon />
                <h2>ResizeHub</h2>
            </div>
            <div className='mr-20 flex items-center gap-4'>
                {
                    isLoggedIn ? (
                        <>
                            <Link 
                                href="/dashboard" 
                                className='hover:bg-gray-100 p-2 rounded-md px-4 inline-flex items-center justify-center gap-2 transition-colors'
                            >
                                <DashboardOutlinedIcon fontSize="small" />
                                <span className="font-medium">Dashboard</span>
                            </Link>
                            <div className="relative inline-block text-left">
                            <button
                                type="button"
                                className="flex items-center gap-2 focus:outline-none"
                                onClick={() => setShowUserMenu((prev) => !prev)}
                            >
                                <div className="bg-indigo-500 text-white w-8 h-8 flex items-center justify-center rounded-full text-lg uppercase">
                                    {userData && userData.user?.name
                                        ? userData.user.name.charAt(0)
                                        : "U"}
                                </div>
                                <span className="hidden sm:block font-medium">
                                    {userData && userData.user?.name
                                        ? userData.user.name
                                        : "User"}
                                </span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${showUserMenu ? "rotate-180" : "rotate-0"}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {showUserMenu && (
                                <div className="origin-top-right absolute right-0 mt-2 w-60 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                    <div className="py-4 px-6 flex flex-col gap-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="bg-indigo-500 text-white w-10 h-10 flex items-center justify-center rounded-full text-xl uppercase">
                                                {userData && userData.user?.name
                                                    ? userData.user.name.charAt(0)
                                                    : "U"}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900">
                                                    {userData && userData.user?.name
                                                        ? userData.user.name
                                                        : "User Name"}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {userData && userData.user?.email
                                                        ? userData.user.email
                                                        : "Email not found"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-t border-slate-200 my-2"></div>
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem("userData");
                                                setIsLoggedIn(false);
                                                setShowUserMenu(false);
                                                router.push("/");
                                            }}
                                            className="w-full text-left px-3 py-2 rounded-md hover:bg-red-100 text-red-600 font-semibold"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        </>
                    ) : (
                        <Link href="/auth" className='mr-5 hover:bg-gray-100 p-2 rounded-md px-6 inline-flex items-center justify-center'>
                            Login
                        </Link>
                    )
                }
                
            </div>
        </div>
    )
}

export default Navbar