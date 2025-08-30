'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import { format } from 'date-fns';

const ExpensesPrint = forwardRef(({ details }, ref) => {
    console.log(details);

    const [serial, setSerial] = useState("");

    function getTotalAmount() {
        return details?.stockIn.reduce((total, next) => {
            const value = Number(next?.rupees) || 0;
            return total + value;
        }, 0);
    }

    useEffect(() => {
        setSerial(Math.floor(10000 + Math.random() * 90000));
    }, []);

    return (
        <div ref={ref} style={{ display: 'none' }} className="max-w-3xl mx-auto border border-black p-6 text-sm">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
                <img src="logo.png" alt="Logo" className="h-24 sm:h-32" />
                <div className="flex flex-col gap-3 text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-center">Makkah Cold Storage</h1>
                    <div className="text-xs text-center flex flex-col gap-1 items-center">
                        <p> Plot No. A-155, Phase-1, S.I.T.E. Super Highway Scheme #33, KARACHI.</p>
                        <p className="text-xs">Syed Nisar Ali: 0313-5764939</p>
                        <p className="text-xs">Syed Hazrat Ali: 0312-2889710, 0302-2776706</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
                <div className="flex justify-between">
                    <span>S. No.</span>
                    <span className="flex-1 border-b border-black ml-2 mr-4 text-center">{serial}</span>
                    <span>Date</span>
                    <span className="flex-1 border-b border-black ml-2 text-center">{format(new Date(), 'dd / MM / yyyy')}</span>
                </div>
                <div className="flex justify-between">
                    <span>Party’s Name</span>
                    <span className="flex-1 border-b border-black ml-2 mr-4 text-center">{details?.partyName || ""}</span>
                </div>
                <div className="flex justify-between">
                    <span>Sub Party’s Name</span>
                    <span className="flex-1 border-b border-black ml-2 text-center"></span>
                </div>
            </div>

            <table className="w-full text-sm border border-gray-800 mt-4">
                <thead>
                    <tr className="bg-gray-100 text-center">
                        <th className="border border-gray-800 px-2 py-1 w-12">S. No.</th>
                        <th className="border border-gray-800 px-2 py-1 w-16">Qty.</th>
                        <th className="border border-gray-800 px-2 py-1 w-16">Received</th>
                        <th className="border border-gray-800 px-2 py-1 w-16">T. Qty</th>
                        <th className="border border-gray-800 px-2 py-1">Particulars</th>
                        <th className="border border-gray-800 px-2 py-1 w-16">Rate</th>
                        <th className="border border-gray-800 px-2 py-1 w-24">Amount Rs.</th>
                    </tr>
                </thead>
                <tbody>
                    {details?.stockIn?.map((row, i) => (
                        <tr className="text-center" key={i}>
                            <td className="border border-gray-800 py-1">{i + 1}</td>
                            <td className="border border-gray-800 py-1">{row?.crates ?? ''}</td>
                            <td className="border border-gray-800 py-1">{row?.received ?? ''}</td>
                            <td className="border border-gray-800 py-1">{row?.cratesPerMonth ?? ''}</td>
                            <td className="border border-gray-800 py-1 text-left px-2">
                                {row?.roomNo ? `(rooms ${row.roomNo}) ` : ''}{row?.rackNo ? `(racks ${row.rackNo})` : ''}
                            </td>
                            <td className="border border-gray-800 py-1">{row?.serialNo ? 650 : ''}</td>
                            <td className="border border-gray-800 py-1">{row?.rupees ?? '—'}</td>
                        </tr>
                    ))}
                    <tr className="text-center">
                        <td className="border border-gray-800 py-1 text-xs">Total Crates</td>
                        <td className="border border-gray-800 py-1 text-right pr-3" colSpan={5}>Total Amount:</td>
                        <td className="border border-gray-800 py-1">{getTotalAmount()}</td>
                    </tr>
                </tbody>
            </table>

            <div className="flex justify-between items-center mt-10 text-xs">
                <div>Gate Pass No. <span className="inline-block w-32 border-b border-black"></span></div>
                <div>Signature: <span className="inline-block w-48 border-b border-black"></span></div>
            </div>
        </div>
    )
});

export default ExpensesPrint
