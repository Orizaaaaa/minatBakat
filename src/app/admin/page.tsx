'use client'
import { db } from '@/lib/firebase/firebaseConfig'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { useEffect, useState } from "react"

// tipe data
type ErrorRecord = {
    id: string;
    name: string;
    error: string;
    createdAt?: { seconds: number; nanoseconds: number };
}

// fungsi format tanggal
const formatDate = (timestamp?: { seconds: number; nanoseconds: number }) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const Page = () => {
    const [errorRecords, setErrorRecords] = useState<ErrorRecord[]>([])

    const fetchErrors = async () => {
        try {
            const q = query(collection(db, "model_errors"), orderBy("createdAt", "desc"))
            const querySnapshot = await getDocs(q)
            const data: ErrorRecord[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ErrorRecord[]
            setErrorRecords(data)
        } catch (err) {
            console.error("Gagal fetch error:", err)
        }
    }

    useEffect(() => {
        fetchErrors()
    }, [])

    return (
        <section>
            <div className="main container mx-auto">
                <h1 className="text-2xl mt-3">Statistik Error</h1>

                <div className="table-login mt-4">
                    <Table aria-label="Daftar Error Model"

                    >
                        <TableHeader >
                            <TableColumn>NAMA</TableColumn>
                            <TableColumn>TANGGAL</TableColumn>
                            <TableColumn>KESALAHAN</TableColumn>
                        </TableHeader>
                        <TableBody
                            emptyContent={"Belum ada error yang ditemukan"}>
                            {errorRecords.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{record.name}</TableCell>
                                    <TableCell>{formatDate(record.createdAt)}</TableCell>
                                    <TableCell>{record.error}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </section>
    )
}

export default Page
