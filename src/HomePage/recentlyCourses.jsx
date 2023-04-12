import React, {useCallback, useEffect, useState} from 'react'
import "../dataSlider"
import axios from "axios"

const RecentlyCourses = () => {

    return (<>
            <div className="pt-12 pb-[42px] max-w-[1762px] mx-auto flex">
                <div className="w-[837.33px] h-[480px]">
                    <img src="pic1.jpg" alt="" className="rounded-lg"/>
                </div>
                <div className="pl-8">
                    <p className="text-left">Khóa học gần đây</p>
                    <p className="text-left font-bold text-4xl">Adobe Illustrator CC Masterclass: Shortcuts &
                        Workflow
                        Tips</p>
                    <div className="pb-8 pt-2.5"><a
                        className="flex justify-center items-center w-[177.67px] h-[52.67px] block px-4 py-2 text-center transition duration-300 ease-in-out transform border border-[#F0C528] rounded-md shadow-md bg-[#F0C528] text-[#2F2E2E] hover:scale-105"

                        target="_blank"
                        rel="noopener noreferrer"
                    >Đi tới khóa học
                    </a>
                    </div>
                    <div className="w-[554.67px] border border-[#D5D5D5] border-solid"></div>
                    <p className="font-bold text-left pt-6">Ghi chú</p>
                    <div className="flex justify-between py-4">
                        <p className="text-left">Adobe Illustrator is the designer's bread and butter</p>
                        <a>Chi tiết</a>
                    </div>
                    <div className="border border-[#000000] border-dashed"></div>
                </div>
            </div>
        </>
    );
}

export default RecentlyCourses
