"use client";
import Navbar from "../../components/navbar/navbar";
import HowItWorks from "../../components/howItWorks/HowItWorks";
import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Footer from "../../components/footer/footer";
import Link from "next/link";
function Home() {
    return (
        <div  >
            <Navbar />
            {/* Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-20 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Resize Images in Seconds
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                        Professional image rescaling with intelligent algorithms. Upload, rescale, and download your images with our powerful cloud-based platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Link
                            href="/upload"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 inline-flex items-center gap-2 shadow-lg"
                        >
                            <BrokenImageOutlinedIcon />
                            Start Resizing Free
                        </Link>
                        <button className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg">
                            View Demo
                        </button>
                    </div>

                    {/* Hero Image */}
                    <div className="relative max-w-4xl mx-auto">
                        <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50">
                            <img
                                src="https://images.unsplash.com/photo-1623715537851-8bc15aa8c145?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNobm9sb2d5JTIwd29ya3NwYWNlfGVufDF8fHx8MTc2MTAxMjk3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                                alt="Modern workspace setup"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>


            </div>

            <HowItWorks />

            {/* Powerful Features Section */}
            <div className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need for professional image rescaling
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Lightning Fast Card */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <BoltOutlinedIcon className="text-white text-2xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                                Lightning Fast
                            </h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Process images in seconds with our optimized cloud infrastructure and smart algorithms.
                            </p>
                        </div>

                        {/* Secure & Private Card */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <ShieldOutlinedIcon className="text-white text-2xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                                Secure & Private
                            </h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Your images are encrypted and automatically deleted after 24 hours for maximum privacy.
                            </p>
                        </div>

                        {/* Easy Download Card */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <FileDownloadOutlinedIcon className="text-white text-2xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                                Easy Download
                            </h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Download your rescaled images instantly in multiple formats with one click.
                            </p>
                        </div>


                    </div>



                </div>
            </div>

            <div className=" bg-blue-400 flex flex-col items-center p-20 " color="black" >
                <h2 className="text-center font-bold mb-5 text-3xl text-white" >Ready to Get Started</h2>
                <p className="text-center font-bold mb-5 text-white" >Join thousands of users who trust ResizeHub for their image rescaling needs.</p>
                <Link
                    href="/upload"
                    className="bg-white hover:bg-blue-700 text-black p-3 rounded-lg font-semibold text-lg transition-colors duration-200 inline-flex items-center gap-2 shadow-lg"
                >
                    <BrokenImageOutlinedIcon />
                    Start Resizing Free
                </Link>

            </div>
            <Footer />

        </div>
    )
}


export default Home