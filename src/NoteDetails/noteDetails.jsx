import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import HomePage from "../HomePage/homePage";
import Note from '../NoteDetails/Note';
import StarRatingComponent from 'react-star-rating-component';

const NoteDetails = () => {
    const id = useParams()
    const [courseData, setCourseData] = useState([]);
    const [rating, setRating] = useState(0); // Add state for rating

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await fetch(
                    `http://192.168.3.150:8055/items/course/${id.id}?fields=*,notes.*`
                    // `http://192.168.3.150:8055/flows/trigger/20202c51-f8a4-4204-a479-b0b40f064f90?id=${id.id}`
                );
                const data = await response.json();
                setCourseData(data.data);
            } catch (error) {
                console.error("Error fetching course data:", error);
            }
        };

        fetchCourseData();
    }, []);

    // Define onStarClick function
    const onStarClick = (nextValue) => {
        setRating(nextValue);
    };

    return (
        <>
            <HomePage/>
            <div className="max-w-[1300px] mx-auto pt-[37px]">
                {courseData && (
                    <>
                        <img
                            src={`http://192.168.3.150:8055/assets/${courseData.image}`}
                            alt="" className="rounded-lg h-[400px] w-full"/>
                        <div className="font-bold text-[32px] leading-[120%] text-left pt-6">
                            {courseData.title}
                        </div>
                        <div className="flex justify-between py-6">
                            <a
                                className="flex justify-center items-center w-[177.67px] h-[52.67px] px-4 py-2 text-center transition duration-300 ease-in-out transform border border-[#F0C528] rounded-md shadow-md bg-[#F0C528] text-[#2F2E2E] hover:scale-105"
                                target="_blank"
                                rel="noopener noreferrer"
                                href={courseData.link}
                            >
                                Đi tới khóa học
                            </a>
                            <StarRatingComponent
                                className="flex-shrink-0" // Fix typo: 'class' should be 'className'
                                name="rate1"
                                starCount={5}
                                value={rating} // Pass the rating value from state
                                onStarClick={onStarClick} // Use the defined onStarClick function
                                renderStarIcon={() => (
                                    <span
                                        className="text-4xl" // Increase the font size to make it bigger
                                        style={{paddingRight: "4px"}} // Add some padding between stars
                                    >&#9733;
                                    </span>
                                )}
                            />
                        </div>
                        <div className="text-left">{courseData.description}</div>
                    </>
                )}
            </div>
            <Note courseData={courseData.notes} idNoted={id.id}/>
        </>
    );
};

export default NoteDetails;
