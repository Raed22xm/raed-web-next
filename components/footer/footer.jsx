import React from 'react';

function Footer() {
    return (
        <footer className="relative bg-[#1A1D2B] text-gray-300 py-12">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: Logo and Tagline */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center mb-4">
                            {/* Logo with gradient */}
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded mr-3"></div>
                            <span className="text-white font-bold text-xl">ResizeHub</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Professional image rescaling made simple.
                        </p>
                    </div>

                    {/* Column 2: Product */}
                    <div className="col-span-1">
                        <h3 className="text-white font-semibold mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Company */}
                    <div className="col-span-1">
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Legal */}
                    <div className="col-span-1">
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                        </ul>
                    </div>
                </div>

                {/* Separator Line */}
                <div className="border-t border-[#3A3F4D] my-8"></div>

                {/* Copyright Section */}
                <div className="text-center">
                    <p className="text-gray-400 text-sm">
                        © 2025 ResizeHub. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Floating Help Button */}
            <button className="fixed bottom-6 right-6 w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 z-50">
                ?
            </button>
        </footer>
    );
}

export default Footer;