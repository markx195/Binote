import React, {useEffect, useState} from "react"
import axios from "axios";
import {useTranslation} from "react-i18next";

const FeaturedCourse = () => {
    const {t} = useTranslation()
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken');
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://192.168.3.150:8050/flows/trigger/d03f7d11-8dec-4099-bd94-730a87995d5f?limit=5",
                    {
                        headers: {
                            Authorization: `Bearer ${storedAccessToken}`,
                        },
                    }
                );
                setCourses(response.data.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchData();
    }, []);

    return (<>
        <div className="text-left font-bold pb-4">{t("featuredCourse")}</div>
        <div className="rounded-lg bg-white" style={{boxShadow: "0px 0px 8px rgba(51, 51, 51, 0.1)"}}>
            {courses.map((course) => (
                <div key={course.id} className="p-4 cursor-pointer border-b">
                    <div className="flex">
                        <img src={`http://192.168.3.150:8050/assets/${course.image}`} alt=""
                             className="w-[56px] h-[56px] rounded object-cover"/>
                        {courses.image}
                        <div className="pl-2">
                            <p className="text-left text-lg font-bold">{course.title}</p>
                            <p className="lowercase text-left text-[#979696] text-base">{course.userCount} {t("learner")}</p>
                        </div>
                    </div>
                </div>
            ))
            }
        </div>
    </>)
}
export default FeaturedCourse
