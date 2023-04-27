import React, {useState, useEffect, useCallback} from "react"
import axios from "axios"
import SearchIcon from '@mui/icons-material/Search';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import RecentlyCourses from "./recentlyCourses";
import {useNavigate} from "react-router-dom"

const storedAccessToken = localStorage.getItem('accessToken');

const CourseCard = () => {
    const LIMIT_DATA = 8;
    const navigate = useNavigate()
    const [dataSource, setDataSource] = useState([])
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [hasMoreItems, setHasMoreItems] = useState(true);
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
                    `http://192.168.3.150:8055/flows/trigger/6871f313-a5e3-4edd-917b-6217451e01b9?page=${page}&limit=${LIMIT_DATA}&sort=sort&sort=-id`,
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
        [searchQuery, page]
    );

    useEffect(() => {
        fetchData(0);
    }, []);

    const handleLoadMore = () => {
        if (hasMoreItems) {
            setPage(prevPage => prevPage + 1);
        }
    };

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
            .get("http://192.168.3.150:8055/items/category", {})
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
            <div className="border border-solid border-[#D5D5D5] max-w-[1300px] mx-auto"></div>
            {/*Course catalog*/}
            <div className="flex flex-wrap pt-10 pb-6 gap-4 max-w-[1300px] mx-auto">
                <button
                    onClick={() => handleButtonClick()}
                    className={`h-[39px] hover:bg-[#2F2E2E] border-[#D5D5D5] rounded-lg hover:text-[#F0C528] ${
                        selectedCategoryId === null ? "bg-[#2F2E2E] text-[#F0C528]" : ""}`}
                >Tất Cả
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
            <div className="max-w-[1300px] mx-auto w-full">
                <div className="relative flex">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <SearchIcon className="text-gray-400"/>
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm khóa học"
                        className="bg-white border-solid border-[#D5D5D5] border rounded-lg w-full h-[52px] pl-10 pr-3 text-left"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            {/*Courses*/}
            <div>
                <div
                    className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4 pb-14 max-w-[1300px] mx-auto'>
                    {dataSource?.map((item, index) => (
                        <div
                            key={index}
                            className='border shadow-lg rounded-lg hover:scale-105 duration-300'
                            onClick={() => handleNoteDetails(item.id)}
                        >
                            <div className="p-4">
                                <img
                                    key={item.image}
                                    src={`http://192.168.3.150:8055/assets/${item.image}`}
                                    alt={item?.name}
                                    className='w-full rounded h-[150px] object-cover rounded-t-lg'
                                />
                            </div>
                            <p className='font-bold flex justify-between px-4 pb-4 text-sm truncate hover:text-clip hover:whitespace-normal hover:break-all'>
                                {item?.title}
                            </p>
                            <div className="px-4 pb-4">
                                <a
                                    className="block px-4 py-2 text-center transition duration-300 ease-in-out transform border border-[#F0C528] border-solid rounded-md shadow-md hover:bg-[#F0C528] hover:text-[#2F2E2E] hover:scale-105"
                                    href={item?.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >Đi tới khóa học
                                </a>
                            </div>
                            <div className='flex justify-between px-4 pt-4'>
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
                <div className="pb-14">
                    {hasMoreItems && (
                        <button onClick={handleLoadMore}>Load More</button>
                    )}
                </div>
            </div>
        </>
    );
}
export default CourseCard
