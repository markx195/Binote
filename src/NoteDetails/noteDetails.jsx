import React, {useState, useEffect} from "react";
import {useParams, useLocation} from "react-router-dom";
import HomePage from "../HomePage/homePage"
import Note from "./Note"
import StarRatingComponent from 'react-star-rating-component';

const NoteDetails = ({noteId, handleAddNote, handleDeleteNote}) => {
    const id = useParams()
    const [courseData, setCourseData] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await fetch(
                    "http://192.168.102.216:8055/items/course/29?fields=*,notes.*"
                );
                const data = await response.json();
                setCourseData(data.data);
                console.log(data)
            } catch (error) {
                console.error("Error fetching course data:", error);
            }
        };

        fetchCourseData();
    }, []);

    return (
        <>
            <HomePage/>
            <div className="max-w-[1762px] mx-auto pt-[37px]">
                {courseData && (
                    <>
                        <img
                            src={`http://192.168.102.216:8055/assets/${courseData.image}`}
                            alt="" className="rounded-lg"/>
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
                                class="flex-shrink-0"
                                font
                                name="rate1"
                                starCount={courseData.rating}
                            />
                        </div>
                        <div className="text-left">{courseData.description}</div>
                    </>
                )}
            </div>
        </>
    );
};

export default NoteDetails;
