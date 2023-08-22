import React from "react";
import { PropagateLoader } from 'react-spinners';
import { ClipLoader } from 'react-spinners';

export default function Modal({vin}) {
  return (
    <>
        <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="relative p-6 px-0 flex-auto ">
                        <p className="text-xl font-bold text-center">Please <span className="text-cyan-400">Wait</span></p>
                        <img className="w-[80px] sm:w-auto float-left" src="./img/modal_image2.png" />
                        <img className="w-[80px] sm:w-auto float-right" src="./img/modal_image1.png" />
                        <div className="md:inline-block">
                            <p className="clear-none text-xl mt-10 text-center font-bold">We are checking your <span className="text-cyan-400">VIN</span></p>
                            <p className="clear-none text-xl mt-5 mx-auto text-center">{vin}</p>
                        </div>
                        <div className="justify-center flex clear-both">
                        {/* <PropagateLoader color="#36d7b7"  className="justify-center flex"/> */}
                        <ClipLoader color="#36d7b7" size={40} />
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>          
    </>
  );
}