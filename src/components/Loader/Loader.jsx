const Loader = () => {
    return (
        <div className="flex items-center justify-center h-screen relative">
            <div className="relative w-32 h-32">
                {/* Pulsing border */}
                <div className="absolute inset-0 border-4 border-green-400 rounded-lg animate-ping"></div>

                {/* House icon with subtle bounce */}
                <div className="absolute inset-0 flex items-center justify-center text-green-700 text-6xl animate-pulse">
                    🏡
                </div>
            </div>
        </div>
    );
};

export default Loader;
