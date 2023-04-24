import React, {useState, useEffect, useCallback} from "react"
import axios from "axios"
import InfiniteScroll from "react-infinite-scroll-component"
import {LoadingCard} from "../loadingCard"
import StarRatingComponent from 'react-star-rating-component';
import SearchIcon from '@mui/icons-material/Search';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import RecentlyCourses from "./recentlyCourses";
import {useNavigate} from "react-router-dom"

const CourseCard = ({access_token}) => {
    const accessToken = access_token
    const [dataSource, setDataSource] = useState([])
    const [hasMore, setHasMore] = useState("")
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState([]);

    const fetchData = useCallback(
        async (id = 1, page = 0) => {
            try {
                const payload = {
                    title: searchQuery,
                    category_id: [id]
                };
                const response = await axios.post(
                    'http://192.168.3.150:8055/flows/trigger/6871f313-a5e3-4edd-917b-6217451e01b9?page=0&limit=5&sort=sort&sort=-id',
                    payload
                );
                setDataSource(response.data.data);
                setHasMore(response.total_count > page + 1);
            } catch (error) {
                console.error(error);
            }
        },
        [searchQuery]
    );

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

    useEffect(() => {
        // Debounce the API call to reduce the number of requests during rapid input changes
        const debounceTimer = setTimeout(() => {
            fetchData();
        }, 300); // Adjust the debounce delay as needed

        // Clean up the timer on unmount or when searchQuery changes
        return () => {
            clearTimeout(debounceTimer);
        };
    }, [searchQuery, fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData])

    const handleButtonClick = (id) => {
        console.log(id)
        fetchData(id);
    };

    const navigate = useNavigate()
    const handleNoteDetails = (id) => {
        navigate(`/NoteDetails/${id}`);
    };

    return (<>
            <RecentlyCourses token={accessToken}></RecentlyCourses>
            <div className="border border-solid border-[#D5D5D5] max-w-[1300px] mx-auto"></div>
            {/*Course catalog*/}
            <div className="flex flex-wrap pt-10 pb-6 gap-4 max-w-[1300px] mx-auto">
                {courses.map((item) => (
                    <button
                        onClick={() => handleButtonClick(item.id)}
                        key={item.code}
                        className="h-[39px] hover:bg-[#2F2E2E] border-[#D5D5D5] rounded-lg hover:text-[#F0C528]"
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
                        placeholder="Tìm kiếm tại mục kỹ năng làm việc"
                        className="bg-white border-solid border-[#D5D5D5] border rounded-lg w-full h-[52px] pl-10 pr-3 text-left"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            {/*courses component*/}
            <InfiniteScroll
                dataLength={dataSource.length}
                next={() => fetchData(dataSource.id, dataSource.length / 5)}
                hasMore={hasMore}
                loader={<LoadingCard/>}
            >
                <div
                    className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4 pb-14 max-w-[1300px] mx-auto'>
                    {dataSource.map((item, index) => (
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
                                <StarRatingComponent
                                    name="rate1"
                                    starCount={5}
                                    value={item?.rating}
                                />
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
            </InfiniteScroll>
        </>
    );
}
export default CourseCard
