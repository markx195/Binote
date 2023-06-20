import React, {useState, useEffect, useCallback} from "react"
import axios from "axios"
import SearchIcon from '@mui/icons-material/Search';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import RecentlyCourses from "./recentlyCourses";
import {useNavigate} from "react-router-dom"
import {useTranslation} from "react-i18next";

const CourseCard = () => {
    const {t} = useTranslation()
    const [storedAccessToken, setStoredAccessToken] = useState(null);
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        setStoredAccessToken(accessToken);
    }, []);
    const LIMIT_DATA = 999;
    const navigate = useNavigate()
    const [dataSource, setDataSource] = useState([])
    const [page, setPage] = useState(1);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const fetchData = useCallback(
        async (id = 0) => {
            try {
                const payload = {
                    title: searchQuery,
                    category_id: [id]
                };
                const config = {
                    headers: {
                        Accept: "*/*",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${storedAccessToken}`
                    }
                };

                const response = await axios.post(
                    `http://192.168.3.150:8050/flows/trigger/6871f313-a5e3-4edd-917b-6217451e01b9?page=${page}&limit=${LIMIT_DATA}&sort=sort&sort=-id`,
                    payload,
                    config
                );

                if (page === 1) {
                    // If it's the initial fetch, set the data as is
                    setDataSource(response.data.data.slice(0, LIMIT_DATA)); // Update to limit the number of items displayed initially
                } else {
                    // If it's subsequent fetches, append new data to existing data
                    setDataSource(prevData => [...prevData, ...response.data.data]); // Fetch all data from response as it should already be paginated on the server side
                }
                if (response.data.data.length < LIMIT_DATA) {
                    setHasMoreItems(false);
                }
            } catch (error) {
                console.error(error);
            }
        },
        [searchQuery, page, storedAccessToken]
    );

    useEffect(() => {
        fetchData(0);
    }, []);

    useEffect(() => {
        // Debounce the API call to reduce the number of requests during rapid input changes
        const debounceTimer = setTimeout(() => {
            fetchData(0);
            // fetchData();
        }, 300); // Adjust the debounce delay as needed
        // Clean up the timer on unmount or when searchQuery changes
        return () => {
            clearTimeout(debounceTimer);
        };
    }, [searchQuery, fetchData]);

    useEffect(() => {
        axios
            .get("http://192.168.3.150:8050/items/category", {})
            .then((res) => {
                setCourses(res.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleButtonClick = (id) => {
        setPage(1)
        setSelectedCategoryId(id);
        fetchData(id);
    };

    const handleNoteDetails = (id) => {
        navigate(`/NoteDetails/${id}`);
    };

    return (<>
            <RecentlyCourses></RecentlyCourses>
            <div className="bg-[#F5F5F5]">
                <div className="border border-solid border-[#D5D5D5] mx-[5%]"></div>
            </div>
            {/*Course catalog*/}
            <div className="flex flex-wrap pt-10 pb-6 gap-4 px-[5%] mx-auto bg-[#F5F5F5]">
                <button
                    onClick={() => handleButtonClick()}
                    className={`h-[39px] hover:bg-[#2F2E2E] border-[#D5D5D5] rounded-lg hover:text-[#F0C528] ${
                        selectedCategoryId === null ? "bg-[#2F2E2E] text-[#F0C528]" : ""}`}
                >{t("all")}
                </button>
                {courses.map((item) => (
                    <button
                        onClick={() => handleButtonClick(item.id)}
                        key={item.code}
                        className={`h-[39px] hover:bg-[#2F2E2E] border-[#D5D5D5] rounded-lg hover:text-[#F0C528] ${
                            selectedCategoryId === item.id ? "bg-[#2F2E2E] text-[#F0C528]" : ""}`}
                    >
                        {item.name}
                    </button>
                ))}
            </div>
            {/*Searching*/}
            <div className="px-[5%] mx-auto w-full bg-[#F5F5F5]">
                <div className="relative flex">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <SearchIcon className="text-gray-400"/>
                    </div>
                    <input
                        type="text"
                        placeholder={t("Search")}
                        className="bg-white border-solid border-[#D5D5D5] border rounded-lg w-full h-[52px] pl-10 pr-3 text-left"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            {/*Courses*/}
            <div>
                <div
                    className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4 pb-14 px-[5%] mx-auto bg-[#F5F5F5]'>
                    {dataSource?.map((item, index) => (
                        <div
                            key={index}
                            className='border shadow-md rounded-lg hover:scale-105 duration-300 bg-white'
                            onClick={() => handleNoteDetails(item.id)}
                        >
                            <div className="p-4">
                                <img
                                    key={item.image}
                                    src={`http://192.168.3.150:8050/assets/${item.image}`}
                                    alt={item?.name}
                                    className='w-full rounded h-[150px] object-cover rounded-t-lg'
                                />
                            </div>
                            <p className='font-bold flex justify-between px-4 pb-4 text-sm truncate hover:text-clip hover:whitespace-normal hover:break-all'>
                                {item?.title}
                            </p>
                            <div className='flex justify-between px-4 pb-4'>
                                <p className="inline-flex items-center">
                                    <StickyNote2Icon></StickyNote2Icon>
                                    <span className='p-1'>
                        {item?.notes_count} notes
                        </span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
export default CourseCard
