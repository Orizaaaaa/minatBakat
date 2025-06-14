import React from 'react'
import { GrNotes } from 'react-icons/gr'
import { IoIosArrowForward } from 'react-icons/io';
import { IoFolderOpenOutline } from 'react-icons/io5';
import { PiPaperPlaneRightLight } from "react-icons/pi";
import { RiRobot2Line } from "react-icons/ri";
import { FiUserCheck } from "react-icons/fi";
type Props = {}

const page = (props: Props) => {


    const conditions = (value: string) => {
        if (value === 'pending') {
            return (
                <div className=" h-[50vh]  flex justify-center items-center">
                    <div className="flex justify-center items-center gap-2 bg-red-200 p-4 rounded">
                        <IoFolderOpenOutline size={25} />
                        <IoIosArrowForward size={25} />
                        <RiRobot2Line size={25} />
                        <IoIosArrowForward size={25} />
                        <FiUserCheck size={25} />
                    </div>
                </div>

            )

        } else if (value === 'start') {
            return (
                <>
                    <div className='mb-5'>
                        <h1>Apakah anda tertarik pada dunia komputer?</h1>
                        <div className="flex mt-2 gap-3 flex-wrap">
                            <button className='bg-slate-300 px-3 py-1 rounded-xl'>Sangat setuju</button>
                            <button className='bg-slate-300 px-3 py-1 rounded-xl'>Setuju</button>
                            <button className='bg-slate-300 px-3 py-1 rounded-xl'>Netral</button>
                            <button className='bg-slate-300 px-3 py-1 rounded-xl'>Tidak setuju</button>
                            <button className='bg-slate-300 px-3 py-1 rounded-xl'>Sangat tidak setuju</button>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button className='py-2 px-4 rounded-full bg-primary text-white text-sm mt-7 flex items-center gap-2' > KIRIM JAWABAN  <PiPaperPlaneRightLight size={20} /></button>
                    </div>
                </>
            )
        } else if (value === 'end') {
            console.log('end')
        }
    }


    return (
        <section className='container mx-auto mt-9' >
            <div className="flex justify-between">
                <div className="flex justify-center items-center gap-2">
                    <GrNotes size={30} />
                    <h1 className=" font-bold text-lg">TES MINAT BAKAT</h1>
                </div>
                <button className='py-2 px-4 rounded-full bg-primary text-white' > TES MINAT GRATIS</button>
            </div>

            <hr className=' mb-10 mt-5 text-slate-200' />

            <section>
                <h1 className='text-5xl font-bold' >
                    Lakukan tes minat bakat anda dengan berbagai pilihan pertanyaan
                </h1>
                <h2 className='mt-2' >Anda akan lebih tau minat bakat serta kemampuan anda untuk masuk ke sekolah yadika</h2>
                <button className='py-2 px-4 rounded-full bg-primary text-white text-sm mt-7' > LAKUKAN TES</button>
            </section>

            <div className="px-8 h-screen overflow-y-auto">
                <section className='w-full h-[500px] mt-10 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] shadow-black/25 p-4 overflow-y-auto'>
                    {conditions('pending')}
                </section>


            </div>


        </section>

    )
}

export default page