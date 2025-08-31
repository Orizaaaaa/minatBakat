'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import InputForm from '@/components/elements/input/InputForm'
import ButtonPrimary from '@/components/elements/buttonPrimary'
import { FaEyeSlash } from 'react-icons/fa6'
import { IoEye } from 'react-icons/io5'
import { Spinner } from '@nextui-org/react'
import Link from 'next/link'

import { registerUser } from '@/lib/firebase/firestore'
import { logo } from '../image'

const Register = () => {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(true)
    const [typePassword, setTypePassword] = useState('password')
    const [loading, setLoading] = useState(false)
    const [errorRegister, setErrorRegister] = useState('')

    const [form, setForm] = useState({
        nik: '',
        name: '',
        email: '',
        password: ''
    })

    const [errorMsg, setErrorMsg] = useState({
        name: '',
        nik: '',
        email: '',
        password: ''
    })

    const togglePassword = () => {
        setShowPassword(!showPassword)
        setTypePassword(showPassword ? 'text' : 'password')
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        // Validasi khusus untuk NIK
        if (name === 'nik') {
            if (!/^\d*$/.test(value)) {
                setErrorMsg(prev => ({ ...prev, nik: '*NIK hanya boleh berisi angka' }))
                return
            }

            if (value.length > 16) {
                return // Jangan update state kalau lebih dari 16 karakter
            }

            // Validasi panjang
            if (value.length !== 16) {
                setErrorMsg(prev => ({ ...prev, nik: '*NIK harus 16 digit' }))
            } else {
                setErrorMsg(prev => ({ ...prev, nik: '' }))
            }

            setForm(prev => ({ ...prev, nik: value }))
            return
        }

        // Validasi untuk email
        if (name === 'email') {
            setForm(prev => ({ ...prev, [name]: value }))
            setErrorMsg(prev => ({
                ...prev,
                email: value ? '' : '*Email tidak boleh kosong'
            }))
            return
        }

        // Validasi untuk password
        if (name === 'password') {
            setForm(prev => ({ ...prev, [name]: value }))
            setErrorMsg(prev => ({
                ...prev,
                password: value.length < 8 ? '*Password minimal 8 karakter' : ''
            }))
            return
        }
        if (name === 'name') {
            setForm(prev => ({ ...prev, [name]: value }))
            setErrorMsg(prev => ({
                ...prev,
                name: value.length < 1 ? '*Nama tidak boleh kosong' : ''
            }))
            return
        }
    }


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const isValid =
            form.nik.length === 16 &&
            /^\d+$/.test(form.nik) &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
            form.password.length >= 8

        if (!isValid) {
            setErrorRegister('*Periksa kembali form yang diisi')
            setLoading(false)
            return
        }

        try {
            const user = await registerUser(form.email, form.password, form.name, form.nik) // ← kirim name ke sini
            console.log("Registrasi berhasil", user)
            setErrorRegister('')
            router.push('/')
        } catch (error) {
            console.error(error)
            setErrorRegister('*Gagal mendaftar. Email mungkin sudah digunakan.')
        } finally {
            setLoading(false)
        }
    }


    console.log(form);

    return (
        <div className="register">
            <div className="container mx-auto flex justify-center items-center w-[100vw] h-[100vh] ">
                <form className='p-6 bg-[#e9e9e9] rounded-lg w-96 m-3' onSubmit={handleRegister}>
                    <div className="logo flex justify-center my-5">
                        <Image src={logo} alt="logo" width={180} height={190} />
                    </div>

                    <InputForm
                        placeholder='Masukkan Nama'
                        type='text'
                        htmlFor='name'
                        value={form.name}
                        onChange={handleChange}
                    />
                    <p className="text-red text-sm mb-2">{errorMsg.name}</p>
                    <InputForm
                        placeholder='Masukkan NIK'
                        type='text'
                        htmlFor='nik'
                        value={form.nik}
                        onChange={handleChange}
                    />
                    <p className="text-red text-sm mb-2">{errorMsg.nik}</p>

                    <InputForm
                        placeholder='Masukkan Email'
                        type='email'
                        htmlFor='email'

                        value={form.email}
                        onChange={handleChange}
                    />
                    <p className="text-red text-sm mb-2">{errorMsg.email}</p>

                    <div className="relative">
                        <button
                            onClick={togglePassword}
                            type='button'
                            className='icon-password h-full bg-transparent flex absolute right-0 justify-center items-center pe-4'
                        >
                            {showPassword ? <FaEyeSlash size={20} color='#636363' /> : <IoEye size={20} color='#636363' />}
                        </button>
                        <InputForm
                            className='form-input-login'
                            htmlFor='password'

                            type={typePassword}
                            value={form.password}
                            onChange={handleChange}
                            placeholder='Masukkan Kata Sandi'
                        />
                    </div>
                    <p className="text-red text-sm mb-2">{errorMsg.password}</p>

                    <p className='text-red my-3 text-sm'>{errorRegister}</p>

                    <ButtonPrimary typeButon='submit' className='rounded-lg w-full mb-3 font-medium py-2'>
                        {loading ? <Spinner className='w-5 h-5' size='sm' color='white' /> : 'Daftar'}
                    </ButtonPrimary>

                    <p className='text-sm'>
                        Sudah punya akun? <Link className='text-primary font-medium' href='/'>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register
