import { FaFacebookF, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-10 pb-3">
            <div className="max-w-7xl overflow-hidden mx-auto px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    {/* Brand + Social */}
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-3 mb-4">
                            <img
                                src="https://i.ibb.co/pz3fBBX/B-GREEN.png"
                                alt="logo"
                                className="w-20 h-12 object-contain"
                            />
                            <div>
                                <h4 className="text-green-500 brand text-lg">GREEN HOME</h4>
                                <h6 className="text-yellow-400 text-sm">Properties</h6>
                            </div>
                        </div>

                        <div className="flex space-x-10 mt-4">
                            <a href="https://www.facebook.com/shoieb.ctg" target="_blank" rel="noreferrer">
                                <FaFacebookF size={36} className="text-gray-100 hover:text-green-500 transition" />
                            </a>
                            <a href="https://twitter.com/Shoieb5" target="_blank" rel="noreferrer">
                                <FaTwitter size={36} className="text-gray-100 hover:text-green-500 transition" />
                            </a>
                            <a href="https://www.linkedin.com/in/shoieb-alam/" target="_blank" rel="noreferrer">
                                <FaLinkedin size={36} className="text-gray-100 hover:text-green-500 transition" />
                            </a>
                            <a
                                href="https://www.youtube.com/channel/UCCIDe_dIDwvX1rBK-Yz30VA"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FaYoutube size={36} className="text-gray-100 hover:text-green-500 transition" />
                            </a>
                        </div>
                    </div>

                    {/* Useful Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Useful Links</h4>
                        <div className="flex flex-col space-y-2">
                            <Link to="/home#banner" className="text-gray-100 hover:text-green-400 transition">
                                Home
                            </Link>
                            <Link to="/home#featured" className="text-gray-100 hover:text-green-400 transition">
                                Featured
                            </Link>
                            <Link to="/apartments" className="text-gray-100 hover:text-green-400 transition">
                                Apartments
                            </Link>
                            <Link to="/home#reviews" className="text-gray-100 hover:text-green-400 transition">
                                Reviews
                            </Link>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Get In Touch</h4>
                        <div className="flex flex-col space-y-2">
                            <p className="flex items-center space-x-2">
                                <FiPhone /> <span>+88-031-656570</span>
                            </p>
                            <p className="flex items-center space-x-2">
                                <FiMail /> <span>support.ghp@gmail.com</span>
                            </p>
                            <p className="flex items-center space-x-2">
                                <FiMapPin /> <span>Uttara, Dhaka-1230 Bangladesh</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-16 text-sm text-gray-400">
                    &copy; {new Date().getFullYear()}, All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
