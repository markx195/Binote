import React, {useState, useEffect} from "react";
import HomePage from "../HomePage/homePage";
import {useTranslation} from "react-i18next";
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
import FeaturedCourse from "./ Featured_course";
import CardInfo from "./Card_info";
import {Spin} from 'antd';

const {Text} = Typography;
const {RangePicker} = DatePicker;
const storedAccessToken = localStorage.getItem('accessToken');
const monthFormat = 'YYYY/MM';
const currentYear = dayjs().format('YYYY');
const currentMonth = dayjs().format('MM');
const firstMonth = `${currentYear}/01`;
const lastMonth = `${currentYear}/${currentMonth}`;

const Statistical = (props) => {
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date(firstMonth).toISOString());
    const [endDate, setEndDate] = useState(new Date(lastMonth).toISOString());
    useEffect(() => {
        handleDateChange([dayjs(firstMonth, monthFormat), dayjs(lastMonth, monthFormat)]);
        sendDataTable()
    }, []);

    const disabledMonth = (current) => {
        const currentDate = new Date();
        return current.isAfter(currentDate, 'month');
    };
    const {t} = useTranslation()
    const [selectedValue, setSelectedValue] = useState('individual');
    const [type, setType] = useState('month');
    const [dataSource, setDataSource] = useState([]);
    const [tableName, setTableName] = useState([]);
    const [totalLearningHours, setTotalLearningHours] = useState([]);
    const [chartData, setChartData] = useState([])
    const [chartValue, setChartValue] = useState([])
    const [showChart, setShowChart] = useState(false)
    const [renderTitleTable, setRenderTitleTable] = useState([])

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
        const formattedDateString = dateString.map(str => str.replace('-Q', ' '));
        const startQuarter = formattedDateString[0];
        const endQuarter = formattedDateString[1]
        let startDate = null;
        let endDate = null;
        if (startQuarter && endQuarter) {
            const [startYear, startQuarterNum] = startQuarter.split(' ');
            const [endYear, endQuarterNum] = endQuarter.split(' ');

            startDate = new Date(startYear, (startQuarterNum - 1) * 3, 1).toISOString();
            endDate = new Date(endYear, endQuarterNum * 3, 1).toISOString();
        }
        setStartDate(startDate);
        setEndDate(endDate);
    };

    const renderYear = (date, dateString) => {
        if (!date || !dateString) {
            // Handle the case when the value is cleared
            setStartDate(null);
            setEndDate(null);
            return;
        }
        const startYear = parseInt(dateString[0]);
        const endYear = parseInt(dateString[1]);
        const startDate = dayjs().year(startYear).startOf('year').toISOString();
        const endDate = dayjs().year(endYear).endOf('year').toISOString();
        setStartDate(startDate);
        setEndDate(endDate);
    }

    const handleDateChange = (date, dateString) => {
        console.log(date, dateString)
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
        setDataSource([]);
        setTotalLearningHours([])
    };

    const sendDataTable = async () => {
        const url = "http://192.168.3.150:8050/flows/trigger/d81543a3-bf6f-4551-a673-7e1cf148c0a6";
        const requestData = {
            from_date: startDate,
            to_date: endDate,
            option: selectedValue,
            type: type
        };
        try {
            setLoading(true);
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedAccessToken}`
                },
                body: JSON.stringify(requestData)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataSource(data.data);
            setTotalLearningHours(data.totalLearningHours)
            setChartData(data.timePeriods.map(period => period.period));
            const listMonthForChart = data.timePeriods.map(item => item.period)
            setRenderTitleTable(listMonthForChart);
            setTableName(data?.data.map(item => item.name));

        } catch (error) {
        } finally {
            setShowChart(true);
            setLoading(false);
            renderValueChartCompany()
        }
    };

    const renderValueChartCompany = () => {
        const learningHours = [];
        console.log(totalLearningHours)
        totalLearningHours.forEach((item) => {
            learningHours.push(item.learningHour)
            //// sẽ thay đổi trường totalLeaningHours
            //// thay đổi khi chọn công ty
        });
        setChartValue(learningHours)
    }
    const timePeriods = dataSource && dataSource.length > 0 ? dataSource[0].timePeriods : [];
    const dynamicColumns = timePeriods.map((timePeriod, index) => {
        let title;
        if (type === 'month') {
            const value = renderTitleTable[index];
            let monthNumber;
            if (value) {
                const monthString = value.substring(0, value.indexOf(' '));
                const date = new Date(`${monthString} 1, 2000`);
                monthNumber = date.getMonth() + 1;
            } else {
                monthNumber = -1;
            }
            title = `T${monthNumber}`
        } else if (type === 'quarter') {
            title = renderTitleTable[index];
        } else if (type === 'year') {
            title = renderTitleTable[index];
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

    const dynamicColumnsCompany = totalLearningHours.map((timePeriod, index) => {
        let title;
        if (type === 'month') {
            const value = renderTitleTable[index];
            let monthNumber;
            if (value) {
                const monthString = value.substring(0, value.indexOf(' '));
                const date = new Date(`${monthString} 1, 2000`);
                monthNumber = date.getMonth() + 1;
            } else {
                monthNumber = -1;
            }
            title = `T${monthNumber}`
        } else if (type === 'quarter') {
            title = renderTitleTable[index];
        } else if (type === 'year') {
            title = renderTitleTable[index];
        }
        return {
            title,
            dataIndex: `timePeriods[${index}].learningHour`,
            key: `T${index + 1}`,
        }
    });

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'name',
            key: 'name',
            render: (text) => {
                console.log(text)
                const username = text.split('@')[0];
                return <span>{username}</span>;
            },
        },
        ...dynamicColumns,
    ];
    const companyColumns = [
        {
            title: '',
            dataIndex: '',
            key: '',
        },
        ...dynamicColumnsCompany,
    ];

    const onChangeShowChart = (value) => {
        const selectedPeriod = value.target.value;
        const learningHours = [];
        dataSource.forEach((item) => {
            const timePeriod = item.timePeriods.find((period) => period.period === selectedPeriod);
            if (timePeriod) {
                learningHours.push(timePeriod.learningHour);
            }
        });
        setChartValue(learningHours)
    }

    const handleSelectChange = (event) => {
        const value = event.target.value
        setSelectedValue(value);
        setShowChart(false)
    };

    const renderedColumns = selectedValue === "company" ? companyColumns : columns;

    const handleExport = async () => {
        const url = "http://192.168.3.150:8050/export";
        const requestData = {
            from_date: startDate,
            to_date: endDate,
            option: selectedValue,
            type: type
        };
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedAccessToken}`
                },
                body: JSON.stringify(requestData)
            });
            const data = await response.json();
            const fileId = data.data.id;
            const downloadUrl = `http://192.168.3.150:8050/assets/${fileId}?download`;
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.target = '_blank';
            link.style.display = 'none';
            document.body.appendChild(link);
            setTimeout(function () {
                link.click();
                document.body.removeChild(link);
            }, 500);
        } catch (error) {
            console.error(error);
        }
    };

    return (<>
            <HomePage handleSignOut={props.handleSignOut}/>
            <div className="px-[5%] mx-auto py-[54px] bg-[#F5F5F5]">
                <CardInfo/>
                <div className="flex pt-10">
                    <div className="w-4/12">
                        <FeaturedCourse/>
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
                        <div className="flex rounded-lg p-4 justify-between bg-white"
                             style={{boxShadow: "0px 0px 8px rgba(51, 51, 51, 0.1)"}}>
                            <div className="flex">
                                {renderDatePicker()}
                                <FormControl fullWidth>
                                    <InputLabel>{t("selectStatisticalObject")}</InputLabel>
                                    <Select
                                        value={selectedValue}
                                        size="small"
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
                            {loading ? (
                                <div className="text-center">
                                    <Spin size="large"/>
                                </div>
                            ) : dataSource?.length === 0 ? (
                                <div className="text-center">
                                    <p>No data</p>
                                </div>
                            ) : (
                                <div className="grid justify-items-end">
                                    <Table
                                        columns={renderedColumns}
                                        dataSource={dataSource}
                                        pagination={false}
                                        bordered
                                        scroll={{y: 360}}
                                        summary={(pageData) => {
                                            return (
                                                <>
                                                    <Table.Summary.Row style={{fontWeight: 'bold'}}>
                                                        <Table.Summary.Cell>
                                                            Tổng (giờ)
                                                        </Table.Summary.Cell>
                                                        {totalLearningHours.length === 0 ? (
                                                            <Table.Summary.Cell
                                                                colSpan={renderedColumns.length - 1}>
                                                                <Text>No total learning hours available</Text>
                                                            </Table.Summary.Cell>
                                                        ) : (
                                                            totalLearningHours.map((record, index) => (
                                                                <Table.Summary.Cell key={index}>
                                                                    <Text>{record.learningHour}</Text>
                                                                </Table.Summary.Cell>
                                                            ))
                                                        )}
                                                    </Table.Summary.Row>
                                                </>
                                            );
                                        }}
                                        className="sticky-summary pb-8"
                                    />
                                    <button
                                        className="rounded-xl border-2 border-yellow-500 px-4 py-2 rounded text-yellow-500 hover:bg-yellow-500 hover:text-white transition-colors duration-300 ease-in-out cursor-pointer"
                                        onClick={handleExport}
                                    >
                                        Export
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {selectedValue !== "individual" && showChart && (
                    <div className="pt-10">
                        {selectedValue === "team" && (
                            <>
                                <select value={chartData.period} onChange={onChangeShowChart} className="float-right">
                                    {chartData.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                <BarChart labels={tableName} data={chartValue}/>
                            </>
                        )}
                        {selectedValue === "company" && (
                            <BarChart labels={renderTitleTable} data={chartValue}/>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}
export default Statistical;
