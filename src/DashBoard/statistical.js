import React, {useState, useEffect} from "react";
import HomePage from "../HomePage/homePage";
import {useTranslation} from "react-i18next";
import axios from "axios";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import {DatePicker} from 'antd';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import {Table} from 'antd';
import "../App.css"
import BarChart from "../common/BarChart";
import dayjs from 'dayjs';

const {RangePicker} = DatePicker;
const storedAccessToken = localStorage.getItem('accessToken');
const Statistical = () => {
    const {t} = useTranslation()
    const [courses, setCourses] = useState([]);
    const [selectedValue, setSelectedValue] = useState('individual');
    const [type, setType] = useState('month');
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dataSource, setDataSource] = useState([]);
    const [tableName, setTableName] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [totalLearningHours, setTotalLearningHours] = useState([]);

    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const monthFormat = 'YYYY/MM';
    const currentYear = dayjs().format('YYYY');
    const firstMonth = `${currentYear}/01`;
    const lastMonth = `${currentYear}/12`;

    const renderDatePicker = () => {
        switch (type) {
            case 'month':
                return (
                    <RangePicker
                        defaultValue={[dayjs(firstMonth, monthFormat), dayjs(lastMonth, monthFormat)]}
                        format={monthFormat}
                        className="mr-6"
                        onChange={handleDateChange}
                        picker="month"
                        style={{width: '100%'}}
                    />
                );
            case 'quarter':
                return <RangePicker className="mr-6" picker="quarter"/>;
            case 'year':
                return <RangePicker className="mr-6" picker="year"/>;
            default:
                return null;
        }
    };

    const handleDateChange = (date) => {
        if (date && date.length === 2) {
            const startDate = new Date(date[0]);
            const endDate = new Date(date[1]);

            if (!isNaN(startDate) && !isNaN(endDate)) {
                setStartDate(startDate.toISOString());
                setEndDate(endDate.toISOString());
            } else {
                console.log('Invalid date format');
            }
        }
    };


    const handleRadioChange = (event) => {
        setType(event.target.value);
    };

    useEffect(() => {
        handleDateChange([dayjs(firstMonth, monthFormat), dayjs(lastMonth, monthFormat)]);
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://192.168.3.150:8055/flows/trigger/d03f7d11-8dec-4099-bd94-730a87995d5f?limit=5",
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

    const sendDataTable = () => {
        const url = "http://192.168.3.150:8055/flows/trigger/d81543a3-bf6f-4551-a673-7e1cf148c0a6";
        const requestData = {
            from_date: startDate,
            to_date: endDate,
            option: selectedValue,
            type: type
        };

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${storedAccessToken}`
            },
            body: JSON.stringify(requestData)
        })
            .then(response => response.json())
            .then(data => {
                // Update the tableData state with the fetched data
                setDataSource(data.data);
                setTableName(data.data.map(item => item.name));
                setDataTable(data.data.map(item => item.totalLearningHours));
                setTotalLearningHours(data.totalLearningHours)
            })
            .catch(error => {
                // Handle error
            });
    }

    const timePeriods = dataSource && dataSource.length > 0 ? dataSource[0].timePeriods : [];
    const dynamicColumns = timePeriods.map((timePeriod, index) => ({
        title: `T${index + 1}`,
        dataIndex: `timePeriods[${index}].learningHour`, // Updated dataIndex
        key: `T${index + 1}`,
        render: (text, record) => {
            const learningHour = record.timePeriods[index].learningHour;
            return <span>{learningHour}</span>;
        },
    }));

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'name',
            key: 'name',
        },
        ...dynamicColumns,
    ];

    return (<>
            <HomePage/>
            <div className="px-[5%] mx-auto">
                {/*Header*/}
                <div className="grid gap-[24px] md:grid-cols-3">
                    <div
                        className="max-w-full rounded-lg overflow-hidden border border-solid border-blue-500 shadow-lg">
                        <div className="px-6 py-4">
                            <div className="font-bold text-xl mb-2">{t("onlineUser")}</div>
                            <p className="text-gray-700 text-base">
                                Cut the card into 1/2. This is the text under it. It's number 20/80.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-full rounded border border-solid border-yellow-400 overflow-hidden shadow-lg">
                        <div className="px-6 py-4">
                            <div className="font-bold text-xl mb-2">{t("averageOnlineTime")}</div>
                            <p className="text-gray-700 text-base">
                                Cut the card into 1/2. This is the text under it. It's number 20/80.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-full rounded-md overflow-hidden border border-solid border-[#11BF8E]">
                        <div className="px-6 py-4">
                            <div className="font-bold text-xl mb-2">{t("averageTimeTime")}</div>
                            <p className="text-gray-700 text-base">
                                Cut the card into 1/2. This is the text under it. It's number 20/80.
                            </p>
                        </div>
                    </div>
                </div>
                {/*Body*/}
                <div className="flex pt-[34px]">
                    <div className="w-4/12">
                        <p className="text-left font-bold pb-4">{t("featuredCourse")}</p>
                        <div className="rounded-lg" style={{boxShadow: "0px 0px 8px rgba(51, 51, 51, 0.1)"}}>
                            {courses.map((course) => (
                                <div key={course.id} className="p-4 cursor-pointer">
                                    <div className="flex border-b">
                                        <img src={`https://binote-api.biplus.com.vn/assets/${course.image}`} alt=""
                                             className="w-[38px] h-[38px] rounded"/>
                                        {courses.image}
                                        <div className="pl-2 pb-3">
                                            <p className="text-left h-[38px] text-base">{course.title}</p>
                                            <p className="lowercase text-left text-[#979696] text-sm">{course.userCount} {t("learner")}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                            }
                        </div>
                    </div>
                    <div className="w-8/12 ml-6">
                        <div className="flex items-center">
                            <p className="text-left flex-grow font-bold pb-4">{t("learningHoursStatistics")}</p>
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    defaultValue="month"
                                    onChange={handleRadioChange}
                                >
                                    <FormControlLabel
                                        value="month"
                                        control={<Radio style={{color: '#F0C528'}}/>}
                                        label={t('month')}
                                    />
                                    <FormControlLabel
                                        value="quarter"
                                        control={<Radio style={{color: '#F0C528'}}/>}
                                        label={t('quarter')}
                                    />
                                    <FormControlLabel
                                        value="year"
                                        control={<Radio style={{color: '#F0C528'}}/>}
                                        label={t('year')}
                                    />
                                </RadioGroup>
                            </FormControl>
                        </div>
                        {/*end header*/}
                        <div className="flex rounded-lg p-4 justify-between"
                             style={{boxShadow: "0px 0px 8px rgba(51, 51, 51, 0.1)"}}>
                            <div className="flex">
                                {renderDatePicker()}
                                <FormControl fullWidth>
                                    <InputLabel>{t("selectStatisticalObject")}</InputLabel>
                                    <Select
                                        value={selectedValue}
                                        label={t("selectStatisticalObject")}
                                        onChange={handleSelectChange}
                                    >
                                        <MenuItem value="individual">{t("individual")}</MenuItem>
                                        <MenuItem value="team">{t("team")}</MenuItem>
                                        <MenuItem value="company">{t("company")}</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <Button variant="contained" size="medium"
                                    style={{backgroundColor: '#F0C528', color: "black", minWidth: 200}}
                                    onClick={sendDataTable}>
                                {t("confirm")}
                            </Button>
                        </div>
                        <div className="rounded-lg p-4 mt-4"
                             style={{boxShadow: "0px 0px 8px rgba(51, 51, 51, 0.1)"}}>
                            {type === 'month' && (
                                <Table
                                    columns={columns}
                                    dataSource={dataSource}
                                    scroll={{y: 360}}
                                    pagination={false}
                                    footer={() => (
                                        <div className="sticky-bottom-row">
                                            <span>Tổng (giờ):</span>
                                            {totalLearningHours.map((record, index) => (
                                                <span key={index} style={{marginLeft: '8px'}}>
          {record.totalLearningHours}
        </span>
                                            ))}
                                        </div>
                                    )}
                                />
                            )}
                        </div>
                    </div>
                </div>
                {type !== 'month' && (
                    <BarChart labels={tableName} data={dataTable}/>
                )}
            </div>
        </>
    )
}
export default Statistical;
