"use client";
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppContext } from '@/context/AppContext';
import { updateProfile } from "firebase/auth";

type Inputs = {
    userName: string;
};

const AddProfilePopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { user, userId } = useAppContext();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  // ユーザー情報取得
  useEffect(() => {
    if (isOpen) {
      if (user && user.uid === userId) {
        setValue("userName", user.displayName || "");
      }
    }
  }, [isOpen, userId, setValue]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // スペースを除去
    const trimmedUserName = data.userName.trim();
    if (!trimmedUserName) {
        alert("ユーザー名は空白のみでは登録できません。");
        return;
      }
    try {
        if (user && user.uid === userId) {
          // ユーザーのプロフィール情報を更新
          await updateProfile(user, {
            displayName: data.userName.trim(), // 更新するユーザー名
          });
          alert("ユーザー情報が更新されました。");
          reset();
          onClose();
        } else {
          throw new Error("認証されたユーザーが見つかりません。");
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
        <input
          {...register("userName", {
            required: "ユーザー名は必須です。",
            maxLength: {
              value: 15,
              message: "15文字以内で入力してください。",
            },
          })}
          type="text"
          placeholder="ユーザー名"
          className={`w-full p-2 border rounded mb-4 ${
            errors.userName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.userName && (
          <p className="text-red-500 text-sm mb-4">{errors.userName.message}</p>
        )}
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