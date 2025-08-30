'use client';

import React, { forwardRef } from 'react';
import { format } from 'date-fns';

const StockOutPrint = forwardRef(({ item }, ref) => {
    return (
        <div ref={ref} style={{ display: 'none' }} className="max-w-3xl mx-auto border border-black p-6 text-sm">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center p-6">
                <img src="logo.png" alt="Logo" className="h-28 sm:h-40" />
                <div className="flex flex-col gap-3 text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-center">Makkah Cold Storage</h1>
                    <div className="text-xs text-center flex flex-col gap-1 items-center">
                        <p> Plot No. A-155, Phase-1, S.I.T.E. Super Highway Scheme #33, KARACHI.</p>
                        <p className="text-xs font-bold">Syed Nisar Ali: <span className='font-normal'>0313-5764939</span></p>
                        <p className="text-xs font-bold">Syed Hazrat Ali: <span className='font-normal'>0312-2889710, 0302-2776706</span></p>
                        <p className="border-2 border-black px-1 py-0.5 no-underline shadow-[4px_5px_1px_#000] uppercase font-extrabold text-lg">Gate Pass</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col ">
                <div className="flex justify-between">
                    <span>S. No. #</span>
                    <span className="flex-1 border-b border-black ml-2 mr-4 text-center">{item?.serialNo || ""}</span>
                    <span>Date</span>
                    <span className="flex-1 border-b border-black ml-2 text-center">{item?.date ? format(new Date(item?.date), 'MMM dd, yyyy') : ""}</span>
                </div>
            </div>
            <div className="flex flex-col gap-8 mt-16">
                <div className="flex justify-between">
                    <span>Party’s Name</span>
                    <span className="flex-1 border-b border-black ml-2 mr-4 text-center">{item?.partyName || ""}</span>
                    <span>Sub Party’s Name</span>
                    <span className="flex-1 border-b border-black ml-2 text-center">{item?.subPartyName || ""}</span>
                </div>

                <div className="flex justify-between">
                    <span>Goods Delivered to</span>
                    <span className="flex-1 border-b border-black ml-2" text-center>{item?.goodDeliveredTo || ""}</span>
                </div>
                <div className="flex justify-between mt-4">
                    <span className="flex-1 border-b border-black text-center">{item?.received || ""}</span>
                </div>
                <div className="flex justify-between">
                    <span>Party GR No.</span>
                    <span className="flex-1 border-b border-black ml-2 text-center">{item?.partyGrNo || ""}</span>
                    <span className="ml-2">Cold Storage GR No.</span>
                    <span className="flex-1 border-b border-black ml-2 text-center">{item?.coldStoreGrNo || ""}</span>
                </div>
                <div className="flex justify-between">
                    <span>Vehicle #</span>
                    <span className="flex-1 border-b border-black ml-2 text-center">{item?.vehicle || ""}</span>
                    <span className="ml-2">Driver Name</span>
                    <span className="flex-1 border-b border-black ml-2 text-center">{item?.driverName || ""}</span>
                </div>
            </div>

            <div className="flex justify-end items-center mt-16 text-xs">
                <div className='flex flex-col items-center justify-end gap-2'>
                    <span className="inline-block w-48 border-b border-black"></span>
                    <span>Signature:</span>
                </div>
            </div>
        </div>
    )
});

export default StockOutPrint
