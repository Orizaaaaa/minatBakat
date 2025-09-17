'use client'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import React from 'react'

type Props = {}

const page = (props: Props) => {
    return (
        <section>
            <div className="main container mx-auto">
                <h1 className='text-2xl mt-3' >Analisis kesalahan admin</h1>

                <div className="table-login mt-4">
                    <Table aria-label="Example static collection table">
                        <TableHeader>
                            <TableColumn>NAMA</TableColumn>
                            <TableColumn>TANGGAL</TableColumn>
                            <TableColumn>KESALAHAN</TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow key="1">
                                <TableCell>Tony Reichert</TableCell>
                                <TableCell>CEO</TableCell>
                                <TableCell>Active</TableCell>
                            </TableRow>
                            <TableRow key="2">
                                <TableCell>Zoey Lang</TableCell>
                                <TableCell>Technical Lead</TableCell>
                                <TableCell>Paused</TableCell>
                            </TableRow>
                            <TableRow key="3">
                                <TableCell>Jane Fisher</TableCell>
                                <TableCell>Senior Developer</TableCell>
                                <TableCell>Active</TableCell>
                            </TableRow>
                            <TableRow key="4">
                                <TableCell>William Howard</TableCell>
                                <TableCell>Community Manager</TableCell>
                                <TableCell>Vacation</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

            </div>
        </section>
    )
}

export default page