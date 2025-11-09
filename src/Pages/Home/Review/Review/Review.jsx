import { faQuoteLeft, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Avatar from "../../../../assets/images/avatar1.png";

const Review = ({ review }) => {
    const { reviewtext, user, rating = 0 } = review;

    return (
        <div className="p-3">
            <div className="bg-gray-100 rounded-2xl shadow-md h-full flex flex-col items-center p-6 text-center">
                {/* Avatar */}
                <img src={user?.photoURL || Avatar} alt={name} className="w-24 h-24 rounded-full object-cover mb-4" />

                {/* Quote Icon */}
                <FontAwesomeIcon icon={faQuoteLeft} className="text-gray-400 text-xl mb-3" />

                {/* Review Text */}
                <p className="flex-grow text-gray-700 italic">{reviewtext}</p>

                {/* Rating & Name */}
                <div className="mt-auto pt-4">
                    <div className="flex justify-center space-x-1">
                        {[...Array(5)].map((_, index) => (
                            <FontAwesomeIcon
                                key={index}
                                icon={faStar}
                                className={index < rating ? "text-yellow-400" : "text-gray-300"}
                            />
                        ))}
                    </div>
                    <h4 className="mt-3 font-semibold text-lg">{user?.displayName}</h4>
                </div>
            </div>
        </div>
    );
};

export default Review;
