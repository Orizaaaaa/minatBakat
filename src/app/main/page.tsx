import React from 'react'
import { GrNotes } from 'react-icons/gr'

type Props = {}

const page = (props: Props) => {
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
                <h2 className='mt-2' >Anda akan lebih tau minat bakat serta kemampuan anda dimana</h2>
                <button className='py-2 px-4 rounded-full bg-primary text-white text-sm mt-7' > LAKUKAN TES</button>
            </section>

            <div className="px-33">
                <section className='w-full h-[500px]  mt-10  rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] shadow-black/25  p-4' >
                    <h1>Apakah anda tertarik pada dunia komputer ?</h1>
                    <div className="flex mt-2 gap-3">
                        <button className='bg-slate-300 px-3 py-1 rounded-xl ' >Sangat setuju</button>
                        <button className='bg-slate-300 px-3 py-1 rounded-xl ' >Setuju</button>
                        <button className='bg-slate-300 px-3 py-1 rounded-xl ' >Netral</button>
                        <button className='bg-slate-300 px-3 py-1 rounded-xl ' >Tidak setuju</button>
                        <button className='bg-slate-300 px-3 py-1 rounded-xl ' >Sangat tidak setuju</button>
                    </div>

                </section>
            </div>

        </section>

    )
}

export default page