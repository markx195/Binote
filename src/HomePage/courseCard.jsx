import React, {useState, useEffect, useCallback} from "react"
import {LoadingCard} from "../loadingCard"
import InfiniteScroll from "react-infinite-scroll-component"
import axios from "axios"
import StarRatingComponent from 'react-star-rating-component';
import SearchIcon from '@mui/icons-material/Search';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';

const CourseCard = (props) => {
    const [dataSource, setDataSource] = useState([])
    const [hasMore, setHasMore] = useState("")
    const [courses, setCourses] = useState([]);
    const fetchData = useCallback(() => {
        axios.get(
            "http://192.168.102.216:8055/items/course?fields=*,notes.*,count(notes)&meta=total_count",
            {}
        )
            .then((res) => {
                setDataSource(dataSource.concat(res.data.data));
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        axios
            .get("http://192.168.102.216:8055/items/catalog", {})
            .then((res) => {
                setCourses(res.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    // const fetchData = () => {
    //     // if (dataSource.length < 8) {
    //     setTimeout(() => {
    //         axios.get("http://192.168.102.216:8055/items/course", {}).then((res) => {
    //             setDataSource(res.data.data)
    //         })
    //         setDataSource(dataSource.concat(Array.from({length: 6})))
    //     }, 500)
    //     // } else {
    //     //     setHasMore(false)
    //     // }
    // }

    useEffect(() => {
        // axios.get("http://192.168.102.216:8055/items/course", {}).then((res) => {
        //     setDataSource(res.data.data)
        //     console.log(res.data.data)
        // })
        fetchData();
    }, [fetchData])

    return (<>
            <div className="border border-solid border-[#D5D5D5] max-w-[1762px] mx-auto"></div>
            {/*Course catalog*/}
            <div className="flex flex-wrap pt-10 pb-6 gap-4 px-[79px]">
                {courses.map((item) => (
                    <button
                        key={item.code}
                        className="h-[39px] hover:bg-[#2F2E2E] border-[#D5D5D5] rounded-lg hover:text-[#F0C528]"
                    >
                        {item.name}
                    </button>
                ))}
            </div>
            {/*Searching*/}
            <div className="px-[79px] w-full">
                <div className="relative flex">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <SearchIcon className="text-gray-400"/>
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm tại mục kỹ năng làm việc"
                        className="bg-white border-solid border-[#D5D5D5] border rounded-lg w-full h-[52px] pl-10 pr-3 text-left"
                    />
                </div>
            </div>
            {/*courses component*/}
            <InfiniteScroll dataLength={dataSource.length} next={fetchData} hasMore={hasMore} endMessage={<p>Đã hết</p>}
                            loader={<LoadingCard/>}>
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 max-w-[1762px] mx-auto'>
                    {dataSource.map((item, index) => (
                        <div
                            key={index}
                            className='border shadow-lg rounded-lg hover:scale-105 duration-300'
                        >
                            <div className="p-4">
                                <img
                                    key={item.image}
                                    src={`http://192.168.102.216:8055/assets/${item.image}`}
                                    alt={item?.name}
                                    className='w-full rounded h-[150px] object-cover rounded-t-lg'
                                />
                            </div>
                            <p className='font-bold flex justify-between px-4 pb-4 text-sm truncate hover:text-clip hover:whitespace-normal hover:break-all'>
                                {item?.title}
                            </p>
                            <div className="px-4 pb-4">
                                <a
                                    className="block px-4 py-2 text-center transition duration-300 ease-in-out transform border border-[#F0C528] rounded-md shadow-md hover:bg-[#F0C528] hover:text-[#2F2E2E] hover:scale-105"
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
