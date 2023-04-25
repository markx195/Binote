import React, {useCallback, useEffect, useState} from 'react'
import axios from "axios"
import CropSquareIcon from '@mui/icons-material/CropSquare';
import "../App.css"

const RecentlyCourses = () => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const [courses, setCourses] = useState([])
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
            const fetchData = async () => {
                try {
                    // Make API call with token in request headers
                    const response = await axios.get("http://192.168.3.150:8055/flows/trigger/df524185-f718-4c57-891d-0761aabbd03e?sort=sort,-notes.date_updated,-notes.date_created&limit=4&page=0", {
                        headers: {
                            Accept: "*/*",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${storedAccessToken}`
                        }
                    });
                    setCourses(response.data.data);
                } catch
                    (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchData();
        }, [storedAccessToken]
    );

    const goToSlide = useCallback((dataIndex) => {
        setActiveSlide(dataIndex);
        setCourses((prevCourses) => {
            const updatedCourses = [...prevCourses];
            // Swap the course at the clicked index with the course at index 0
            [updatedCourses[dataIndex], updatedCourses[0]] = [updatedCourses[0], updatedCourses[dataIndex]];
            return updatedCourses;
        });
    }, []);

    return (
        <>
            {courses.length > 0 && (
                <div className="pt-12 max-w-[1300px] mx-auto flex">
                    <div className="flex-grow">
                        <img
                            key={courses[0].image}
                            src={`http://192.168.3.150:8055/assets/${courses[0].image}`}
                            alt={courses[0].name}
                            className="w-[868px] h-[468px] object-cover rounded-lg"
                        />
                    </div>
                    <div className="flex-grow pl-8">
                        <p className="text-left">Khóa học gần đây</p>
                        <p className="text-left font-bold text-4xl">{courses[0].title}</p>
                        <div className="pb-8 pt-2.5">
                            <a
                                className="flex justify-center items-center w-[177.67px] h-[52.67px] block px-4 py-2 text-center transition duration-300 ease-in-out transform border border-[#F0C528] rounded-md shadow-md bg-[#F0C528] text-[#2F2E2E] hover:scale-105"
                                href={courses[0].link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Đi tới khóa học
                            </a>
                        </div>
                        <div className="w-[554.67px] border border-[#D5D5D5] border-solid"></div>
                        <p className="font-bold text-left pt-6">Ghi chú</p>
                        <div className="overflow-y-scroll scroll-container">
                            {courses[0].notes?.map(course => (
                                <div key={course.id}>
                                    <div className="flex justify-between py-4">
                                        <p className="text-left">{course.title}</p>
                                        <span className="text-[#4790E4]">Chi tiết</span>
                                    </div>
                                    <div className="border border-[#000000] border-dashed"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <div className="flex justify-center items-center pb-10">
                {courses.map((data, dataIndex) => (
                    <div className="flex top-4 justify-center py-2" key={dataIndex}>
                        <div
                            onClick={() => goToSlide(dataIndex)}
                            className="cursor-pointer flex flex-col items-center"
                        >
                            {/* Apply CSS classes to change icon color on hover */}
                            <CropSquareIcon
                                fontSize="small"
                                className="text-gray-500 hover:text-[#F0C528] transition duration-300"
                            />
                        </div>
                    </div>
                ))}
            </div>

        </>
    );
}

export default RecentlyCourses
