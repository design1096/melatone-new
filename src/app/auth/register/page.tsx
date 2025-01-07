"use client";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { auth } from '../../../../firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Inputs = {
  email: string;
  password: string;
};

const Register = () => {
  const router = useRouter();
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // Firebaseでユーザー新規登録
    await createUserWithEmailAndPassword(auth, data.email, data.password)
    .then((userCredential) => {
        const user = userCredential.user;
        router.push("/auth/login");
      })
    .catch((error) => {
      if(error.code === "auth/email-already-in-use") {
        alert("このメールアドレスはすでに使用されています。");
      } else {
        alert(error.message);
      }
    });
  };

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      {/* タイトル */}
      <div className='text-white font-Jua tracking-widest text-4xl'>MELATONE</div>
      <div className='text-white text-sm mb-12'>眠れない夜のおしゃべり寝落ちアプリ</div>
        {/* 入力フォーム */}
        <form 
            onSubmit={handleSubmit(onSubmit)} 
            className='bg-yellow-color rounded-lg shadow-md px-8 py-7 xs:w-80 md:w-96'
        >
            <h1 className='mb-4 text-center text-2xl text-main-dark-color font-medium'>新規登録</h1>
            <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-600'>
                  メールアドレス
                </label>
                <input 
                  {...register("email", {
                    required: "メールアドレスは必須です。",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                      message: "不適切なメールアドレスです。", 
                    },
                  })} 
                  type='text' 
                  className='mt-1 border-2 rounded-md w-full p-2' 
                  autoComplete='email'
                />
                {errors.email && (
                  <span className='text-red-600 text-sm'>{errors.email.message}</span>
                )}
            </div>
            <div className='mb-7'>
                <label className='block text-sm font-medium text-gray-600'>
                  パスワード
                </label>
                <input 
                  {...register("password", {
                    required: "パスワードは必須です。",
                    minLength: {
                      value: 6,
                      message: "6文字以上入力してください。",
                    },
                  })} 
                  type='password' 
                  className='mt-1 border-2 rounded-md w-full p-2' 
                  autoComplete='current-password'
                />
                {errors.password && (
                  <span className='text-red-600 text-sm'>{errors.password.message}</span>
                )}
            </div>
            <div className='mt-5'>
              <button
                type='submit'
                className="flex w-full justify-center rounded-md bg-main-dark-color px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-main-color"
              >
                新規登録
              </button>
            </div>
            <div className='mt-5 text-center'>
              <span className='text-gray-600 text-sm'>
                既にアカウントをお持ちですか？
              </span>
              <div>
                <Link 
                  href={"/auth/login"} 
                  className='text-main-dark-color text-sm font-bold ml-1 hover:text-main-color'
                >
                  ログインページへ
                </Link>
              </div>
            </div>
        </form>
    </div>
  )
}

export default Register;