'use client'
import React, { useEffect, useRef, useState } from 'react'
import { GrNotes } from 'react-icons/gr'
import { IoIosArrowForward } from 'react-icons/io';
import { IoFolderOpenOutline } from 'react-icons/io5';
import { PiPaperPlaneRightLight } from "react-icons/pi";
import { RiRobot2Line } from "react-icons/ri";
import { FiUserCheck } from "react-icons/fi";
import { HiOutlineDownload } from "react-icons/hi";
import Image from 'next/image';
import { akuntan, hotel, hotel2, logo, pplg } from '../image'; // Pastikan path import ini benar
import { uploadModel } from '@/api/model'; // Pastikan path import ini benar

// Import pustaka untuk PDF
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';

type Props = {}

// Definisi pertanyaan
const questions: string[] = [
    "Bayangkan Anda menjadi tuan rumah sebuah acara. Hal yang paling membuat Anda puas adalah melihat semua tamu tersenyum dan menikmati acara tersebut.",
    "Ketika aplikasi atau game di ponsel Anda tiba-tiba error, reaksi pertama Anda adalah penasaran ingin tahu 'mengapa ini bisa terjadi?'.",
    "Saat merencanakan kegiatan bersama teman-teman, Anda adalah orang yang paling mungkin membuat rincian anggaran agar pengeluaran tetap terkendali.",
    "Anda merasa lebih nyaman mengerjakan tugas yang memiliki aturan dan langkah-langkah yang jelas daripada tugas yang membutuhkan banyak improvisasi.",
    "Anda menikmati proses memecahkan teka-teki logika yang rumit atau menyusun strategi untuk menang dalam sebuah game.",
    "Menurut Anda, menciptakan suasana yang nyaman dan bersih di sebuah tempat (seperti kafe atau kamar) sama pentingnya dengan fungsi tempat itu sendiri.",
    "Melihat catatan keuangan atau data yang rapi, seimbang, dan terorganisir memberikan kepuasan tersendiri bagi Anda.",
    "Anda mudah bergaul dan tidak canggung untuk memulai percakapan dengan orang yang baru dikenal.",
    "Jika diberi pilihan, Anda lebih tertarik belajar cara membuat sebuah website interaktif daripada belajar cara menganalisis laporan keuangan suatu perusahaan.",
    "Ketelitian adalah kekuatan Anda; Anda sering menjadi orang pertama yang menyadari jika ada kesalahan kecil pada sebuah tulisan atau perhitungan.",
    "Anda lebih suka menghabiskan waktu luang dengan mencoba software baru di komputer atau meng-oprek pengaturan ponsel.",
    "Saat ada teman yang mengeluh atau memiliki masalah, Anda sabar mendengarkan dan berusaha membantu mencarikan solusi.",
    "Anda tertarik untuk memahami bagaimana sebuah bisnis atau perusahaan bisa mendapatkan keuntungan dan mengelola uangnya.",
    "Anda merasa bersemangat saat merencanakan sebuah acara dari nol, mulai dari konsep, dekorasi, hingga memastikan semua berjalan lancar.",
    "Proses mencari dan memperbaiki sebuah kesalahan (debugging) dalam suatu sistem atau pekerjaan adalah tantangan yang menarik bagi Anda.",
    "Anda sangat peduli dengan penampilan dan cara berkomunikasi yang baik karena percaya itu adalah cerminan diri.",
    "Anda lebih percaya pada data dan angka daripada intuisi atau 'perasaan saja' saat harus membuat keputusan penting.",
    "Dalam sebuah tugas kelompok, Anda senang berdiskusi dan bertukar ide dengan anggota lain untuk mencapai tujuan bersama.",
    "Ide untuk menciptakan sebuah aplikasi atau game sendiri dari awal terdengar sangat keren dan menantang.",
    "Anda tidak keberatan dengan pekerjaan yang sifatnya rutin dan membutuhkan konsentrasi tinggi di depan meja kerja.",
    "Anda suka mempelajari budaya atau bahasa asing yang berbeda, bahkan hanya untuk bersenang-senang.",
    "Ketika melihat sebuah desain visual atau animasi yang keren, Anda penasaran dengan proses dan teknologi di baliknya.",
    "Jika Anda mengelola uang kas kelas, Anda akan memastikan setiap pemasukan dan pengeluaran tercatat dengan sangat rapi hingga rupiah terakhir.",
    "Anda adalah orang yang pandai membuat orang lain merasa nyaman dan diterima dalam sebuah lingkungan baru.",
    "Menghadapi masalah yang belum pernah ditemui sebelumnya adalah sebuah tantangan yang menarik, bukan sesuatu yang harus dihindari.",
    "Anda lebih suka belajar dengan cara langsung praktik dan mencoba-coba (trial and error) daripada hanya membaca teori dari buku.",
    "Anda setuju bahwa mengikuti prosedur adalah cara terbaik untuk menjamin kualitas dan menghindari kesalahan fatal.",
    "Anda merasa lebih berenergi setelah berinteraksi dengan banyak orang daripada saat menghabiskan waktu sendirian.",
    "Anda lebih tertarik pada 'bagaimana sebuah sistem bekerja' (logika di belakang layar) daripada 'bagaimana sebuah sistem terlihat' (tampilan visual).",
    "Kemampuan untuk mengatur dan memprioritaskan tugas adalah salah satu kelebihan Anda.",
    "Menghadapi pelanggan atau tamu yang sedang marah atau kecewa adalah kesempatan untuk menunjukkan kemampuan Anda dalam menyelesaikan masalah.",
    "Anda merasa puas jika berhasil mengotomatiskan tugas yang berulang menggunakan teknologi.",
    "Anda lebih suka pekerjaan dengan hasil yang pasti dan terukur (benar atau salah) daripada pekerjaan yang hasilnya bersifat subjektif.",
    "Anda adalah orang yang akan diingat teman-teman karena keramahan dan kemampuan Anda mencairkan suasana.",
    "Anda tidak mudah menyerah saat menghadapi kode yang tidak berjalan atau masalah teknis yang rumit.",
    "Anda berpikir bahwa laporan keuangan yang baik adalah kunci utama dari kesuksesan sebuah bisnis.",
    "Anda lebih suka lingkungan kerja yang dinamis dan penuh interaksi daripada lingkungan yang tenang dan individual.",
    "Anda sering membongkar barang elektronik atau mainan hanya untuk melihat apa saja komponen di dalamnya.",
    "Saat mengerjakan proyek, Anda memastikan semua detail kecil sudah sempurna sebelum menyerahkannya.",
    "Anda percaya bahwa memberikan pelayanan terbaik dan pengalaman yang tak terlupakan adalah bentuk keahlian yang berharga."
];

// Definisi opsi jawaban
const options = [
    { label: 'Sangat setuju', value: 5 },
    { label: 'Setuju', value: 4 },
    { label: 'Netral', value: 3 },
    { label: 'Tidak setuju', value: 2 },
    { label: 'Sangat tidak setuju', value: 1 },
]

// Interface untuk menyimpan detail jawaban
interface AnswerRecord {
    question: string;
    answerValue: number;
    answerLabel: string;
}

const Page = (props: Props) => {
    // State untuk melacak indeks pertanyaan saat ini
    const [currentIndex, setCurrentIndex] = useState(0)
    // State untuk menyimpan nilai jawaban (angka 1-5) yang akan dikirim ke model
    const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0))
    // State untuk menyimpan nilai opsi yang dipilih pengguna untuk pertanyaan saat ini
    const [selectedValue, setSelectedValue] = useState<number | null>(null)
    // State untuk mengontrol transisi tampilan pertanyaan
    const [showTransition, setShowTransition] = useState(true)
    // State untuk mengontrol tampilan bagian aplikasi (pending, start, end)
    const [conditionValue, setConditionValue] = useState<string>('pending') // Diubah dari 'end' ke 'pending'
    // State untuk menyimpan hasil prediksi dari model
    const [resultPrediction, setresultPrediction] = useState<string>('')
    // State untuk menyimpan detail pertanyaan dan jawaban pengguna untuk PDF
    const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);

    // Ref untuk menggulir ke bagian tes
    const tesSectionRef = useRef<HTMLDivElement>(null)
    // Ref untuk bagian hasil prediksi yang akan diubah menjadi gambar untuk PDF
    const resultContentRef = useRef<HTMLDivElement>(null);

    // Fungsi untuk menangani jawaban pengguna
    const handleAnswer = () => {
        if (selectedValue === null) return;

        const updatedAnswers = [...answers];
        updatedAnswers[currentIndex] = selectedValue;
        setAnswers(updatedAnswers);

        const currentQuestion = questions[currentIndex];
        const selectedOptionLabel = options.find(opt => opt.value === selectedValue)?.label || '';

        setAnswerRecords(prevRecords => [
            ...prevRecords,
            {
                question: currentQuestion,
                answerValue: selectedValue,
                answerLabel: selectedOptionLabel,
            }
        ]);

        if (currentIndex < questions.length - 1) {
            setShowTransition(false);
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
                setSelectedValue(null);
                setShowTransition(true);
            }, 300);
        } else {
            const data = {
                answers: updatedAnswers
            };

            uploadModel(data, async (result: any) => {
                console.log(result);
                setConditionValue('end');
                setresultPrediction(result.predicted_major);

                const userId = localStorage.getItem('id');
                if (!userId) return;

                const userDocRef = doc(db, 'answers', userId);
                const userDocSnap = await getDoc(userDocRef);

                let existingAnswers: string[] = [];

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    existingAnswers = userData.answers || [];
                }

                // Tambahkan hasil baru ke array
                const updatedPredictionArray = [...existingAnswers, result.predicted_major];

                // Simpan kembali ke Firestore (replace dokumen userId)
                await setDoc(userDocRef, {
                    userId: userId,
                    answers: updatedPredictionArray,
                    createdAt: serverTimestamp()
                });

                console.log("Prediksi berhasil ditambahkan ke Firestore");
            });
        }
    };


    // Fungsi untuk memulai tes
    const startTes = () => {
        setConditionValue('start') // Ubah kondisi ke 'start' untuk menampilkan pertanyaan
        setTimeout(() => {
            tesSectionRef.current?.scrollIntoView({ behavior: 'smooth' }) // Gulir ke bagian tes
        }, 100) // Delay kecil untuk memastikan komponen sudah render
    }

    // Fungsi untuk menghasilkan tampilan prediksi berdasarkan hasil model
    const prediction = (item: string) => {
        if (item === 'PPLG') {
            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-4 lg:gap-8 p-4 bg-white rounded-lg shadow-md">
                    <div className="flex justify-center items-center ">
                        <Image className='rounded-lg' src={pplg} alt="PPLG" width={300} height={300} />
                    </div>

                    <div>
                        <div className="mb-5">
                            Berdasarkan jawaban yang Anda berikan, Anda memiliki ketertarikan yang tinggi dalam jurusan <i>Pengembangan Perangkat Lunak dan Gim (PPLG)</i>.
                        </div>
                        <div className="mb-5">
                            Kamu senang bekerja dengan komputer, suka mencoba aplikasi baru, dan sering penasaran bagaimana suatu program bisa bekerja. Kamu memiliki pemikiran logis dan kreatif, serta menikmati tantangan dalam memecahkan masalah secara teknis. Kamu juga tertarik pada dunia digital, senang membuat sesuatu dari ide menjadi kenyataan, terutama dalam bentuk aplikasi, website, atau permainan. Ketertarikanmu mencerminkan minat yang besar dalam teknologi, inovasi, serta kemampuan untuk bekerja mandiri maupun dalam tim pengembang.
                        </div>
                        <div className="mb-5">
                            <b>Prospek ke depan:</b> Dengan perkembangan teknologi yang sangat cepat, lulusan PPLG sangat dibutuhkan. Kamu bisa menjadi programmer, game developer, mobile app developer, UI/UX designer, hingga CTO di startup. Kamu juga bisa bekerja remote untuk perusahaan luar negeri atau membangun software dan bisnis digital sendiri.
                        </div>
                    </div>

                </div>
            )
        } else if (item === 'Perhotelan') {
            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-4 lg:gap-8 p-4 bg-white rounded-lg shadow-md">
                    <div className="flex justify-center items-center ">
                        <Image className='rounded-lg' src={hotel2} alt="Perhotelan" width={300} height={300} />
                    </div>

                    <div className='mb-5'>
                        <div className="mb-5">
                            Berdasarkan jawaban yang Anda berikan, Anda memiliki ketertarikan yang kuat dalam jurusan <i>Perhotelan</i>.
                        </div>
                        <div className="mb-5">
                            Kamu adalah pribadi yang ramah, sabar, dan memiliki kemampuan komunikasi yang baik. Kamu senang berada di lingkungan sosial, menyukai interaksi dengan orang baru, dan merasa puas ketika bisa membantu atau melayani orang lain. Kamu juga memiliki perhatian terhadap detail, bersikap sopan, dan mampu menjaga sikap profesional dalam berbagai situasi. Ketertarikan kamu terlihat pada bagaimana kamu menikmati bekerja secara tim, menyukai suasana kerja yang dinamis, dan mampu menjaga penampilan serta etika kerja.
                        </div>
                        <div className="mb-5">
                            <b>Prospek ke depan:</b> Lulusan perhotelan memiliki peluang besar untuk bekerja di hotel berbintang, kapal pesiar, restoran, maskapai penerbangan, dan berbagai bidang hospitality lainnya. Kamu juga bisa melanjutkan ke bidang manajemen perhotelan, pariwisata, atau membuka bisnis sendiri di sektor jasa pelayanan.
                        </div>
                    </div>
                </div>
            )
        } else { // Akuntansi
            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-4 lg:gap-8 p-4 bg-white rounded-lg shadow-md">
                    <div className="flex justify-center items-center ">
                        <Image className='rounded-lg' src={akuntan} alt="Akuntansi" width={300} height={300} />
                    </div>

                    <div >
                        <div className="mb-5">
                            Berdasarkan jawaban yang Anda berikan, Anda menunjukkan ketertarikan yang mendalam dalam jurusan <i>Akuntansi</i>.
                        </div>
                        <div className="mb-5">
                            Kamu adalah pribadi yang sistematis, teliti, dan bertanggung jawab. Kamu menikmati aktivitas yang berkaitan dengan angka, perhitungan, serta pencatatan keuangan. Kamu cenderung analitis dan suka membuat segala sesuatu terorganisir dengan rapi. Ketertarikanmu terlihat dari kesukaanmu terhadap aktivitas yang membutuhkan konsistensi dan akurasi tinggi, serta kemampuanmu dalam menyusun laporan dan melihat pola dalam data. Kamu juga senang memahami bagaimana uang mengalir dan bagaimana suatu organisasi bisa dikelola secara finansial.
                        </div>
                        <div className="mb-5">
                            <b>Prospek ke depan:</b> Lulusan akuntansi dibutuhkan di hampir setiap jenis organisasi — baik perusahaan, lembaga pemerintah, maupun institusi nirlaba. Kamu bisa menjadi akuntan publik, auditor, analis keuangan, atau konsultan pajak. Profesi ini juga menjadi pondasi yang kuat bila kamu ingin berkarier sebagai manajer keuangan atau pengusaha.
                        </div>
                    </div>
                </div>
            )
        }
    }

    // Fungsi untuk mengunduh hasil ke PDF
    const handleDownloadPdf = async () => {
        const doc = new jsPDF('p', 'mm', 'a4'); // Inisialisasi dokumen PDF (potrait, mm, A4)
        let yOffset = 15; // Offset Y awal untuk konten
        const margin = 10; // Margin kiri dan kanan
        const maxWidth = doc.internal.pageSize.getWidth() - 2 * margin; // Lebar maksimum untuk teks

        // Tambahkan Judul
        doc.setFontSize(15);
        doc.text('Laporan Hasil Tes Minat Bakat', doc.internal.pageSize.getWidth() / 2, yOffset, { align: 'center' });
        yOffset += 15;

        // Tambahkan Hasil Prediksi (diambil dari elemen HTML)
        if (resultContentRef.current) {
            // Render elemen HTML ke canvas
            const canvas = await html2canvas(resultContentRef.current, { scale: 2 }); // Skala 2 untuk kualitas lebih baik
            const imgData = canvas.toDataURL('image/png'); // Dapatkan data gambar base64
            const imgWidth = 180; // Lebar gambar di PDF (mm)
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Hitung tinggi proporsional

            // Pusatkan gambar di halaman
            const imgX = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
            doc.addImage(imgData, 'PNG', imgX, yOffset, imgWidth, imgHeight);
            yOffset += imgHeight + 10; // Tambahkan offset setelah gambar
        }

        // Tambahkan Judul Bagian Pertanyaan dan Jawaban
        doc.setFontSize(10);
        doc.text('Pertanyaan dan Jawaban Anda', margin, yOffset);
        yOffset += 10;

        // Tambahkan setiap pertanyaan dan jawaban
        doc.setFontSize(8); // Ukuran font untuk Q&A
        answerRecords.forEach((record, index) => {
            // Format pertanyaan dengan nomor
            const questionText = `${index + 1}. ${record.question}`;
            // Pecah teks pertanyaan agar sesuai dengan lebar halaman
            const splitQuestion = doc.splitTextToSize(questionText, maxWidth);

            // Estimasi tinggi yang dibutuhkan untuk pertanyaan dan jawaban ini
            const questionHeight = splitQuestion.length * doc.getLineHeight() / doc.internal.scaleFactor;
            const answerHeight = doc.getLineHeight() / doc.internal.scaleFactor; // Untuk 1 baris jawaban
            const totalRecordHeight = questionHeight + answerHeight + 5; // Tambah spasi

            // Periksa apakah perlu halaman baru
            if (yOffset + totalRecordHeight > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage(); // Tambah halaman baru
                yOffset = margin; // Reset offset Y untuk halaman baru
            }

            // Tambahkan pertanyaan yang sudah dipecah
            doc.text(splitQuestion, margin, yOffset);
            yOffset += questionHeight; // Pindahkan offset Y setelah pertanyaan

            // Tambahkan jawaban
            doc.text(`   Jawaban Anda: ${record.answerLabel} (${record.answerValue})`, margin + 5, yOffset);
            yOffset += answerHeight + 5; // Spasi setelah jawaban dan untuk record berikutnya
        });

        // Simpan dokumen PDF
        doc.save('hasil_tes_minat_bakat.pdf');
    };



    // Fungsi untuk mengontrol tampilan berdasarkan kondisi
    const conditions = (value: string) => {
        if (value === 'pending') {
            return (
                <div className="h-[70vh] flex flex-col justify-between p-4">
                    {/* Tengah */}
                    <div className="flex justify-center items-center flex-1">
                        <div className="flex justify-center items-center gap-2 bg-red-200 p-4 rounded">
                            <IoFolderOpenOutline size={25} />
                            <IoIosArrowForward size={25} />
                            <RiRobot2Line size={25} />
                            <IoIosArrowForward size={25} />
                            <FiUserCheck size={25} />
                        </div>
                    </div>

                    {/* Bawah kanan */}
                    <div className="flex justify-end">
                        <button
                            onClick={startTes}
                            className="py-2 px-4 rounded-full bg-black text-white text-sm flex items-center gap-2"
                        >
                            MULAI
                        </button>
                    </div>
                </div>
            )

        } else if (value === 'start') {
            return (
                <div className="max-w-2xl mx-auto px-4 py-10">
                    <div className={`transition-opacity duration-300 ${showTransition ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="mb-5">
                            <h1 className="text-lg font-semibold mb-4">Pertanyaan {currentIndex + 1} dari {questions.length}</h1>
                            <p className="text-gray-700 mb-6">{questions[currentIndex]}</p>
                            <div className="flex gap-3 flex-wrap">
                                {options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setSelectedValue(opt.value)}
                                        className={`px-4 py-2 rounded-xl border transition-colors duration-200
                                            ${selectedValue === opt.value
                                                ? 'bg-black text-white border-blue-600'
                                                : 'bg-slate-200 hover:bg-slate-300 text-black'}
                                            `}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end items-end">
                            <button
                                onClick={handleAnswer}
                                className="py-2 px-4 rounded-full bg-black text-white text-sm mt-7 flex items-center gap-2"
                            >
                                KIRIM JAWABAN <PiPaperPlaneRightLight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )
        } else if (value === 'end') {
            return (
                <div className="relative w-full h-full flex flex-col justify-center items-center p-4">
                    {/* Bagian ini akan diubah menjadi gambar untuk PDF */}
                    <div ref={resultContentRef} >
                        {prediction(resultPrediction)}
                    </div>

                    {/* Tombol fixed di kanan bawah container */}
                    <button
                        onClick={handleDownloadPdf}
                        className='absolute bottom-5 right-5 py-2 px-4 rounded-full bg-black text-white text-sm flex items-center gap-2 shadow-lg'
                    >
                        <span>UNDUH HASIL</span>
                        <HiOutlineDownload size={20} />
                    </button>
                </div>
            )

        }
    }

    const [majors, setMajors] = useState<string[]>([]);

    const fetchData = async () => {
        const userId = localStorage.getItem('id');
        if (!userId) return;

        const userDocRef = doc(db, 'answers', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setMajors(data.answers || []);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleClickRespon = (value: string) => {
        setresultPrediction(value); // Update prediksi
        setConditionValue('end');   // Ganti tampilan ke hasil
    }


    console.log('hahaha', majors);


    return (
        <section className='container mx-auto mt-9' >
            <div className="flex justify-between">
                <div className="flex justify-center items-center gap-2">
                    <Image src={logo} alt="logo" width={170} height={170} />
                </div>
                <button onClick={startTes} className='py-2 px-4 rounded-full bg-black text-white text-sm lg:text-base' > TES MINAT GRATIS</button>
            </div>

            <hr className=' mb-10 mt-5 text-slate-200' />

            <section>
                <h1 className='text-2xl md:text-5xl font-bold' >
                    Lakukan tes minat bakat anda dengan berbagai pilihan pertanyaan
                </h1>
                <h2 className='mt-2' >Anda akan lebih tahu minat bakat serta kemampuan anda untuk masuk ke sekolah yadika</h2>
                <button className='py-2 px-4 rounded-full bg-black text-white text-sm mt-7' onClick={startTes} > LAKUKAN TES</button>
            </section>

            <h1 className='text-lg font-semibold mt-10 mb-3' >Jawaban yang pernah anda test</h1>

            <div className="grid gerid-cols-4 md:grid-cols-8 gap-2">
                {majors.map((major, index) => (
                    <button key={index} onClick={() => handleClickRespon(major)} className="bg-black text-white px-3 py-2 rounded-xl">
                        {major}
                    </button>
                ))}
            </div>
            <div className=" px-2 lg:px-8 h-screen overflow-y-auto" ref={tesSectionRef}>
                <section className='w-full h-fit lg:h-[500px] mt-10 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] shadow-black/25 p-4 overflow-y-auto'>
                    {conditions(conditionValue)}
                </section>
            </div>
        </section>

    )
}

export default Page