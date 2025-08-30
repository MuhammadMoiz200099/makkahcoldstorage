'use client';

import React, { forwardRef } from 'react';
import { format } from 'date-fns';

const StockInPrint = forwardRef(({ item }, ref) => {
    return (
        <div ref={ref} style={{ display: 'none' }} className="max-w-3xl mx-auto border border-black p-6 text-sm">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center p-6">
                <img src="logo.png" alt="Logo" className="h-28 sm:h-40" />
                <div className="flex flex-col gap-3 text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-center">Makkah Cold Storage</h1>
                    <div className="text-xs text-center flex flex-col gap-1 items-center">
                        <p> Plot No. A-155, Phase-1, S.I.T.E. Super Highway Scheme #33, KARACHI.</p>
                        <p className="text-xs">Syed Nisar Ali: 0313-5764939</p>
                        <p className="text-xs">Syed Hazrat Ali: 0312-2889710, 0302-2776706</p>
                        <p className="border-2 border-black px-1 py-0.5 no-underline shadow-[4px_5px_1px_#000] uppercase font-extrabold text-lg">Goods Received Note</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-8 mt-5">
                <div className="flex justify-between">
                    <span>G. R. No.</span>
                    <span className="flex-1 border-b border-black ml-2 mr-4 text-center">{ item?.serialNo || "" }</span>
                    <span>Inward Date</span>
                    <span className="flex-1 border-b border-black ml-2 text-center">{ item?.inwardDate ? format(new Date(item?.inwardDate),  'MMM dd, yyyy') : "" }</span>
                </div>
                <div className="flex justify-between">
                    <span></span>
                    <span className="flex-1 border-b border-transparent ml-2 mr-4"></span>
                    <span>Page No.</span>
                    <span className="flex-1 border-b border-black ml-2"></span>
                </div>
                <div className="flex justify-between">
                    <span>Party’s Name</span>
                    <span className="flex-1 border-b border-black ml-2 mr-4 text-center">{ item?.partyName || "" }</span>
                </div>
                <div className="flex justify-between">
                    <span>Sub Party’s Name</span>
                    <span className="flex-1 border-b border-black ml-2 text-center">{ item?.subPartyName || "" }</span>
                </div>
                <div className="flex justify-between">
                    <span>Room No.</span>
                    <span className="flex-1 border-b border-black ml-2 mr-4 text-center">{ item?.roomNo || "" }</span>
                    <span>Rack No.</span>
                    <span className="flex-1 border-b border-black ml-2 text-center">{ item?.rackNo || "" }</span>
                </div>
                <div className="flex justify-between">
                    <span>Received</span>
                    <span className="flex-1 border-b border-black ml-2 text-center">{ item?.received || "" }</span>
                    <span className="ml-2">Cases/Crates/Parcels</span>
                    <span className="flex-1 border-b border-black ml-2 text-center">{ item?.crates || "" }</span>
                </div>
                <div className="flex justify-between">
                    <span>Rupees per month</span>
                    <span className="flex-1 border-b border-black ml-2 text-center">{ item?.rupees || "0" }</span>
                    <span className="ml-2">Crates / Parcels weight kg</span>
                    <span className="flex-1 border-b border-black ml-2 text-center">{ item?.cratesPerMonth || "0" }</span>
                </div>
                <div className='flex'>
                    <span>Customer’s Mark:</span>
                    <span className="flex-1 border-b border-black ml-2 text-center">{ item?.customerMark || "" }</span>
                </div>
            </div>

            <div className="mt-6 p-3 text-xs leading-5 flex flex-col gap-8 mb-5">
                <div className='flex justify-center'>
                    <div className="border-2 border-black px-1 py-0.5 no-underline shadow-[4px_5px_1px_#000] uppercase font-extrabold text-lg text-center w-24">: نوٹ</div>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-right text-lg" dir="rtl">
                    <li>ہر پارٹی پر لازم ہے کہ وہ ہفتے میں دو بار مال چیک کرے اور اپنے مال کی پوزیشن سے باخبر رہے۔</li>
                    <li>اسٹوریج بجلی جانے یا مشین کے خراب ہونے یا کسی حادثاتی وجہ سے مال کے خراب ہونے کا ذمہ دار نہ ہو گا۔</li>
                    <li>اسٹوریج کریٹ ٹوٹنے کی صورت میں ذمہ دار نہ ہو گا۔</li>
                    <li>پرچی گم ہونے کی صورت میں اسٹوریج کو فوری اطلاع کریں ورنہ اسٹوریج کی ذمہ داری نہیں ہوگی۔</li>
                    <li>مال کی ڈلیوری صرف اسٹوریج ٹائمنگ میں ہوگی۔</li>
                </ol>

            </div>

            <div className="flex justify-between items-center mt-8 text-xs">
                <div>Issue Date: <span className="inline-block w-32 border-b border-black text-center">{ item?.issuedDate ? format(new Date(item?.issuedDate),  'MMM dd, yyyy') : "" }</span></div>
                <div>Signature: <span className="inline-block w-48 border-b border-black"></span></div>
            </div>
        </div>
    )
});

export default StockInPrint
