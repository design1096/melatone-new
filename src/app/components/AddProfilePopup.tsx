"use client";
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppContext } from '@/context/AppContext';
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../firebase';
import Image from 'next/image';

type Inputs = {
  userName: string;
  userPhoto: string;
};

const AddProfilePopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { user, userId, profileImageUrl, setProfileImageUrl } = useAppContext();
  // 選択された画像ファイルを保持
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  // userPhotoの値を監視
  const userPhoto: string = watch("userPhoto") || "";

  // ユーザー情報取得
  useEffect(() => {
    if (isOpen) {
      if (user && user.uid === userId) {
        setValue("userName", user.displayName || ""); // ユーザー名
        setValue("userPhoto", profileImageUrl || ""); // 画像URL
      }
    }
  }, [isOpen, user, userId, profileImageUrl, setValue]);

  // 画像ファイル取込処理
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Submit処理
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // スペースを除去
    const trimmedUserName = data.userName.trim();
    if (!trimmedUserName) {
        alert("ユーザー名は空白のみでは登録できません。");
        return;
    }
    try {
      if (user && user.uid === userId) {
        // 画像をStorageにアップロード
        const storageRef = ref(storage, `user_icons/${userId}`);
        if (selectedFile) {
          await uploadBytes(storageRef, selectedFile);
          const downloadURL = await getDownloadURL(storageRef);
          // ユーザーのプロフィール情報を更新
          await updateProfile(user, {
            displayName: data.userName.trim(), // ユーザー名
            photoURL: downloadURL, // 画像URL
          });
          setProfileImageUrl(downloadURL);
        } else {
          // 選択された画像ファイルがない場合
          await updateProfile(user, {
            displayName: data.userName.trim(), // ユーザー名
          });
        }
        reset();
        onClose();
        alert("ユーザー情報が更新されました。");
      }
    } catch (error) {
      console.error("ユーザー情報の更新中にエラーが発生しました:", error);
      alert("ユーザー情報の更新に失敗しました。");
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        className="bg-white p-6 rounded-md shadow-md xs:w-80 md:w-96"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-lg font-medium text-main-dark-color text-center mb-4">
          プロフィール登録・編集
        </h2>
        {/* アイコン画像表示 */}
        {userPhoto && (
          <div className="mb-4">
            <Image
              src={userPhoto}
              alt="アイコン画像"
              className="object-cover rounded-full mx-auto"
              width={80}
              height={80}
              unoptimized
            />
          </div>
        )}
        {/* ユーザー名入力 */}
        <label className='block text-sm font-medium text-gray-600 mb-1 ml-1'>
            ユーザー名
        </label>
        <input
          {...register("userName", {
            required: "ユーザー名は必須です。",
            maxLength: {
              value: 15,
              message: "15文字以内で入力してください。",
            },
          })}
          type="text"
          className={`w-full p-2 border rounded mb-4 ${
            errors.userName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.userName && (
          <p className="text-red-500 text-sm mb-4">{errors.userName.message}</p>
        )}
        {/* アイコン画像取込 */}
        <label className='block text-sm font-medium text-gray-600 mb-1 ml-1'>
          アイコン画像
        </label>
        <input
          type="file"
          accept="image/*"
          className="mb-4 w-full p-2 border rounded"
          onChange={handleFileChange}
        />
        {/* ボタンエリア */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              reset(); // フォームリセット
              onClose(); // ポップアップを閉じる
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400 mr-2"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-main-dark-color text-white text-sm font-semibold rounded-md hover:bg-main-color"
          >
            登録
          </button>
        </div>
      </form>
    </div>,
    // ReactDOM.createPortalを使用し、ポップアップをdocument.bodyに直接レンダリング
    document.body
  );
};

export default AddProfilePopup;