import { faFutbol } from "@fortawesome/free-regular-svg-icons";
import { faHome, faPaintRoller, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const features = [
    { icon: faHome, title: "Duplex Layout" },
    { icon: faShieldAlt, title: "High-Level Security" },
    { icon: faPaintRoller, title: "Royal Touch Paint" },
    { icon: faFutbol, title: "Large Playground" },
];

const Success = () => {
    return (
        <div id="success" className="py-12">
            <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl font-bold">
                    <span className="brand text-green-600 px-2 rounded-md">GREEN HOME</span>
                    <span className="text-yellow-500 px-2 font-semibold rounded-md">Properties</span>
                    <br />
                </h3>
                <h3 className="text-xl md:text-2xl font-bold text-gray-700 mt-5">Features</h3>
            </div>

            <div className="pb-5 max-w-7xl overflow-hidden mx-auto px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-300 hover:bg-cyan-300/80 transition-colors rounded-lg shadow-md px-20 py-10 flex flex-col items-center text-center"
                        >
                            <FontAwesomeIcon icon={feature.icon} size="5x" className="text-gray-700 mb-4" />
                            <h4 className="text-lg font-semibold">{feature.title}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Success;
