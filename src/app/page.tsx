'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import InputForm from '@/components/elements/input/InputForm';
import ButtonPrimary from '@/components/elements/buttonPrimary';
import { FaEyeSlash } from 'react-icons/fa6';
import { IoEye } from 'react-icons/io5';
import { Spinner } from '@nextui-org/react';
import Link from 'next/link';
import { logo } from './image';
import { loginUser } from '@/lib/firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';


const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(true);
  const [errorLogin, setErrorLogin] = useState('');
  const [typePassword, setTypePassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState({
    email: '',
    password: ''
  })
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
    setTypePassword(showPassword ? "text" : "password");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let isValid = true;
    let errors = { email: '', password: '' };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      errors.email = '*Email tidak boleh kosong';
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      errors.email = '*Email tidak sesuai format';
      isValid = false;
    }

    if (!form.password) {
      errors.password = '*Password tidak boleh kosong';
      isValid = false;
    } else if (form.password.length < 8) {
      errors.password = '*Password harus lebih dari 8 karakter';
      isValid = false;
    }

    if (!isValid) {
      setErrorMsg(errors);
      setLoading(false);
      return;
    }

    setErrorMsg({ email: '', password: '' });

    try {
      const user = await loginUser(form.email, form.password);
      const token = user.accessToken;
      const uid = user.uid;

      // Ambil data user dari Firestore berdasarkan UID
      const userDocRef = doc(db, "users", uid);
      const userSnapshot = await getDoc(userDocRef);

      let name = '';
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        name = userData.name || '';
      }

      // Simpan ke localStorage
      document.cookie = `token=${token}; path=/`;
      localStorage.setItem('token', token);
      localStorage.setItem('email', user.email || '');
      localStorage.setItem('id', uid || '');
      localStorage.setItem('name', name); // ← Simpan nama dari Firestore

      setErrorLogin('');
      setLoading(false);
      router.push('/main');
    } catch (error) {
      setErrorLogin('*Email atau password salah');
      console.error(error);
      setLoading(false);
    }
  };




  return (
    <div className="login">
      <div className="container mx-auto flex justify-center items-center w-[100vw] h-[100vh] ">
        <form className='p-6 bg-[#e9e9e9] rounded-lg w-96 m-3 lg:m-0' onSubmit={handleLogin}>
          <div className="logo flex justify-center my-5">
            <Image src={logo} alt="logo" width={150} height={170} />
          </div>

          <InputForm
            placeholder='Masukkan Email'
            type='email'
            htmlFor='email'
            value={form.email}
            onChange={handleChange}
          />
          {errorMsg.email && <p className="text-red text-sm mt-1">{errorMsg.email}</p>}

          <div className="relative">
            <button
              onClick={togglePassword}
              type="button"
              className="icon-password h-full bg-transparent flex absolute right-0 justify-center items-center pe-4"
            >
              {showPassword ? <FaEyeSlash size={20} color="#636363" /> : <IoEye size={20} color="#636363" />}
            </button>
            <InputForm
              className="form-input-login"
              htmlFor="password"
              onChange={handleChange}
              type={typePassword}
              value={form.password}
              placeholder="Masukkan Kata Sandi"
            />
          </div>
          {errorMsg.password && <p className="text-red text-sm my-1">{errorMsg.password}</p>}
          <ButtonPrimary typeButon={"submit"} className={`rounded-lg w-full mb-3 font-medium py-2 `}>
            {loading ? <Spinner className={`w-5 h-5 `} size="sm" color="white" /> : 'Login'}
          </ButtonPrimary>
          {errorLogin && <p className="text-red text-sm my-1">{errorLogin}</p>}
          <p className='text-sm'>Belum punya akun ? <Link className='text-primary font-medium ' href={'/register'} > Daftar</Link></p>
        </form>

      </div>
    </div>
  )
}

export default Login