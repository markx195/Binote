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
import {Table, Typography} from 'antd';
import "../App.css"
import BarChart from "../common/BarChart";
import dayjs from 'dayjs';
import RenderColumn from "./Render_column"
import AddIcon from '@mui/icons-material/Add';
import {Card, Col, Row, Statistic} from 'antd';
import Tooltip from "@mui/material/Tooltip";

const {Text} = Typography;
const {RangePicker} = DatePicker;
const storedAccessToken = localStorage.getItem('accessToken');
const Statistical = () => {
    const monthFormat = 'YYYY/MM';
    const currentYear = dayjs().format('YYYY');
    const currentMonth = dayjs().format('MM');
    const firstMonth = `${currentYear}/01`;
    const lastMonth = `${currentYear}/${currentMonth}`;
    const disabledMonth = (current) => {
        const currentDate = new Date();
        return current.isAfter(currentDate, 'month');
    };
    const {t} = useTranslation()
    const [courses, setCourses] = useState([]);
    const [selectedValue, setSelectedValue] = useState('individual');
    const [type, setType] = useState('month');
    const [startDate, setStartDate] = useState(new Date(firstMonth).toISOString());
    const [endDate, setEndDate] = useState(new Date(lastMonth).toISOString());
    const [dataSource, setDataSource] = useState([]);
    const [tableName, setTableName] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [totalLearningHours, setTotalLearningHours] = useState([]);
    const [getDate, setDate] = useState([firstMonth, lastMonth]);
    const [getQuarter, setQuarter] = useState([]);
    const [getYear, setYear] = useState([]);

    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const noiticeIcon = <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7.99992 11.8335C8.18881 11.8335 8.34725 11.7695 8.47525 11.6415C8.60325 11.5135 8.66703 11.3553 8.66659 11.1668V8.50016C8.66659 8.31127 8.60259 8.15283 8.47459 8.02483C8.34659 7.89683 8.18836 7.83305 7.99992 7.8335C7.81103 7.8335 7.65259 7.8975 7.52459 8.0255C7.39659 8.1535 7.33281 8.31172 7.33325 8.50016V11.1668C7.33325 11.3557 7.39725 11.5142 7.52525 11.6422C7.65325 11.7702 7.81147 11.8339 7.99992 11.8335ZM7.99992 6.50016C8.18881 6.50016 8.34725 6.43616 8.47525 6.30816C8.60325 6.18016 8.66703 6.02194 8.66659 5.8335C8.66659 5.64461 8.60259 5.48616 8.47459 5.35816C8.34659 5.23016 8.18836 5.16639 7.99992 5.16683C7.81103 5.16683 7.65259 5.23083 7.52459 5.35883C7.39659 5.48683 7.33281 5.64505 7.33325 5.8335C7.33325 6.02239 7.39725 6.18083 7.52525 6.30883C7.65325 6.43683 7.81147 6.50061 7.99992 6.50016ZM7.99992 15.1668C7.0777 15.1668 6.21103 14.9917 5.39992 14.6415C4.58881 14.2913 3.88325 13.8164 3.28325 13.2168C2.68325 12.6168 2.20836 11.9113 1.85859 11.1002C1.50881 10.2891 1.3337 9.42239 1.33325 8.50016C1.33325 7.57794 1.50836 6.71127 1.85859 5.90016C2.20881 5.08905 2.6837 4.3835 3.28325 3.7835C3.88325 3.1835 4.58881 2.70861 5.39992 2.35883C6.21103 2.00905 7.0777 1.83394 7.99992 1.8335C8.92214 1.8335 9.78881 2.00861 10.5999 2.35883C11.411 2.70905 12.1166 3.18394 12.7166 3.7835C13.3166 4.3835 13.7917 5.08905 14.1419 5.90016C14.4921 6.71127 14.667 7.57794 14.6666 8.50016C14.6666 9.42239 14.4915 10.2891 14.1413 11.1002C13.791 11.9113 13.3161 12.6168 12.7166 13.2168C12.1166 13.8168 11.411 14.2919 10.5999 14.6422C9.78881 14.9924 8.92214 15.1673 7.99992 15.1668ZM7.99992 13.8335C9.48881 13.8335 10.7499 13.3168 11.7833 12.2835C12.8166 11.2502 13.3333 9.98905 13.3333 8.50016C13.3333 7.01127 12.8166 5.75016 11.7833 4.71683C10.7499 3.6835 9.48881 3.16683 7.99992 3.16683C6.51103 3.16683 5.24992 3.6835 4.21659 4.71683C3.18325 5.75016 2.66659 7.01127 2.66659 8.50016C2.66659 9.98905 3.18325 11.2502 4.21659 12.2835C5.24992 13.3168 6.51103 13.8335 7.99992 13.8335Z"
            fill="#979696"/>
    </svg>

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
                        disabledDate={disabledMonth}
                    />
                );
            case 'quarter':
                return <RangePicker className="mr-6" picker="quarter" style={{width: '100%'}}
                                    disabledDate={disabledMonth}
                                    onChange={renderQuarter}/>;
            case 'year':
                return <RangePicker className="mr-6" picker="year" style={{width: '100%'}} disabledDate={disabledMonth}
                                    onChange={renderYear}/>;
            default:
                return null;
        }
    };

    const renderQuarter = (date, dateString) => {
        const startQuarter = parseInt(dateString[0].split('-')[1].substring(1));
        const endQuarter = parseInt(dateString[1].split('-')[1].substring(1));
        const startMonth = (startQuarter - 1) * 3 + 1; // Calculate start month
        const endMonth = endQuarter * 3; // Calculate end month
        const startDate = dayjs().month(startMonth - 1).startOf('month').toISOString();
        const endDate = dayjs().month(endMonth - 1).endOf('month').toISOString();
        setStartDate(startDate);
        setEndDate(endDate);

        const quarters = Array.from({length: endQuarter - startQuarter + 1}, (_, index) => startQuarter + index);
        const quarterLabels = quarters.map(quarter => `Quý ${quarter}`);
        setQuarter(quarterLabels);
    };

    const handleDateChange = (date, dateString) => {
        if (dateString) {
            setDate(dateString);
        }
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

    const renderYear = (date, dateString) => {
        const startYear = parseInt(dateString[0]);
        const endYear = parseInt(dateString[1]);
        const startDate = dayjs().year(startYear).startOf('year').toISOString();
        const endDate = dayjs().year(endYear).endOf('year').toISOString();
        setStartDate(startDate);
        setEndDate(endDate);

        const years = Array.from({length: endYear - startYear + 1}, (_, index) => startYear + index);
        const yearLabels = years.map((year) => year.toString());
        setYear(yearLabels);
    }

    const handleRadioChange = (event) => {
        setType(event.target.value);
    };

    useEffect(() => {
        sendDataTable()
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
////////////////////////////////////////// table/////////////////////////////////////////
    const timePeriods = dataSource && dataSource.length > 0 ? dataSource[0].timePeriods : [];
    const dynamicColumns = timePeriods.map((timePeriod, index) => {
        let title;
        if (type === 'month') {
            title = <RenderColumn dates={getDate} index={index}/>;
        } else if (type === 'quarter') {
            title = getQuarter[index];
        } else if (type === 'year') {
            title = getYear[index];
        }
        return {
            title,
            dataIndex: `timePeriods[${index}].learningHour`,
            key: `T${index + 1}`,
            render: (text, record) => {
                const learningHour = record.timePeriods[index].learningHour;
                return (
                    <>
                        <span>{learningHour}</span>
                        {index < timePeriods.length - 1 && <br/>}
                    </>
                );
            }
        }
    });

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'name',
            key: 'name',
            render: (text) => {
                const username = text.split('@')[0];
                return <span>{username}</span>;
            },
        },
        ...dynamicColumns,
    ];


    return (<>
            <HomePage/>
            <div className="px-[5%] mx-auto py-[54px] bg-[#F5F5F5]">
                {/*Header//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
                <div className="grid gap-[24px] md:grid-cols-3">
                    <div className="max-w-full rounded-2xl overflow-hidden border border-solid shadow-sm flex bg-white"
                         style={{boxShadow: '0px 0px 8px rgba(46, 45, 40, 0.1)'}}>
                        <div className="py-6 pl-6 flex-1">
                            <div className="flex">
                                <div
                                    className="font-normal text-sm mb-2 text-left pr-1">{t("numberOfUsers")}</div>
                                <Tooltip title={t("numberOfUsersHint")}
                                         placement="top">
                                    {noiticeIcon}
                                </Tooltip>
                            </div>
                            <div className="flex items-center">
                                <p className="text-[40px] font-semibold" style={{marginRight: '10px'}}>
                                    40
                                </p>
                                <Statistic
                                    value={11.28}
                                    precision={2}
                                    valueStyle={{
                                        fontSize: '14px',
                                        color: '#3f8600',
                                    }}
                                    prefix={<AddIcon style={{fontSize: '14px'}}/>}
                                    suffix="%"
                                />
                            </div>
                        </div>
                        <div className="flex items-center pr-6">
                            <img src="/Images/user.svg" alt=""/>
                        </div>
                    </div>
                    <div className="max-w-full rounded-2xl overflow-hidden border border-solid shadow-sm flex bg-white"
                         style={{boxShadow: '0px 0px 8px rgba(46, 45, 40, 0.1)'}}>
                        <div className="py-6 pl-6 flex-1">
                            <div className="flex">
                                <div className="font-normal text-sm mb-2 text-left pr-1">{t("averageStudyTimes")}</div>
                                <Tooltip title={t("averageStudyTimesHint")} placement="top">
                                    {noiticeIcon}
                                </Tooltip>
                            </div>
                            <div className="flex items-center">
                                <p className="text-[40px] font-semibold" style={{marginRight: '10px'}}>
                                    4:03
                                </p>
                                <Statistic
                                    value={11.28}
                                    precision={2}
                                    valueStyle={{
                                        fontSize: '14px',
                                        color: '#3f8600',
                                    }}
                                    prefix={<AddIcon style={{fontSize: '14px'}}/>}
                                    suffix="%"
                                />
                            </div>
                        </div>
                        <div className="flex items-center pr-6">
                            <img src="/Images/Book.svg" alt=""/>
                        </div>
                    </div>

                    <div className="max-w-full overflow-hidden border border-solid rounded-2xl shadow-sm flex bg-white"
                         style={{boxShadow: '0px 0px 8px rgba(46, 45, 40, 0.1)'}}>
                        <div className="py-6 pl-6 flex-1">
                            <div className="flex">
                                <div
                                    className="font-normal text-sm mb-2 text-left pr-1">{t("averageUsingTime")}</div>
                                <Tooltip title={t("averageUsingTimeHint")}
                                         placement="top">
                                    {noiticeIcon}
                                </Tooltip>
                            </div>
                            <div className="flex items-center">
                                <p className="text-[40px] font-semibold" style={{marginRight: '10px'}}>
                                    4:03
                                </p>
                                <Statistic
                                    value={11.28}
                                    precision={2}
                                    valueStyle={{
                                        fontSize: '14px',
                                        color: '#3f8600',
                                    }}
                                    prefix={<AddIcon style={{fontSize: '14px'}}/>}
                                    suffix="%"
                                />
                            </div>
                        </div>
                        <div className="flex items-center pr-6">
                            <img src="/Images/Time.svg" alt=""/>
                        </div>
                    </div>
                </div>
                {/*Body//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
                <div className="flex pt-10">
                    {/*featuredCourse//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
                    <div className="w-4/12">
                        <p className="text-left font-bold pb-4">{t("featuredCourse")}</p>
                        <div className="rounded-lg bg-white" style={{boxShadow: "0px 0px 8px rgba(51, 51, 51, 0.1)"}}>
                            {courses.map((course) => (
                                <div key={course.id} className="p-4 cursor-pointer border-b">
                                    <div className="flex">
                                        <img src={`https://binote-api.biplus.com.vn/assets/${course.image}`} alt=""
                                             className="w-[56px] h-[56px] rounded object-cover"/>
                                        {courses.image}
                                        <div className="pl-2">
                                            <p className="text-left text-xl font-bold">{course.title}</p>
                                            <p className="lowercase text-left text-[#979696] text-base">{course.userCount} {t("learner")}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                            }
                        </div>
                    </div>
                    {/*learningHoursStatistics//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
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
                        <div className="flex rounded-lg p-4 justify-between bg-white"
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
                        <div className="rounded-lg p-4 mt-4 bg-white"
                             style={{boxShadow: "0px 0px 8px rgba(51, 51, 51, 0.1)"}}>
                            <Table
                                columns={columns}
                                dataSource={dataSource}
                                pagination={false}
                                bordered
                                scroll={{y: 360}}
                                summary={(pageData) => {
                                    return (
                                        <>
                                            <Table.Summary.Row style={{fontWeight: 'bold'}}>
                                                <Table.Summary.Cell>Tổng
                                                    (giờ)</Table.Summary.Cell>
                                                {totalLearningHours.map((record, index) => (
                                                    <Table.Summary.Cell key={index}>
                                                        <Text>{record.totalLearningHours}</Text>
                                                    </Table.Summary.Cell>
                                                ))}
                                            </Table.Summary.Row>
                                        </>
                                    );
                                }}
                                className="sticky-summary"
                            />
                        </div>
                    </div>
                </div>
                {selectedValue !== "individual" && (
                    <BarChart labels={tableName} data={dataTable}/>
                )}
            </div>
        </>
    )
}
export default Statistical;
