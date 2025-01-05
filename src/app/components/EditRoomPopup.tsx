"use client";
import { doc, updateDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { db } from '../../../firebase';
import { useAppContext } from '@/context/AppContext';

type Inputs = {
  roomName: string;
};

const EditRoomPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { selectedRoom, selectedRoomName, setSelectedRoomName } = useAppContext();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  // ルーム情報取得
  useEffect(() => {
    setValue("roomName", selectedRoomName || "");
  }, [setValue]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // スペースを除去
    const trimmedRoomName = data.roomName.trim();
    if (!trimmedRoomName) {
      alert("部屋名は空白のみでは登録できません。");
      return;
    }
    // selectedRoomがnullの場合の処理
    if (!selectedRoom) {
      alert("部屋が選択されていません。");
      return;
    }
    // Firestoreのルーム名を更新
    try {
      const roomRef = doc(db, "rooms", selectedRoom);
      await updateDoc(roomRef, {
        name: trimmedRoomName,
      });
      setSelectedRoomName(trimmedRoomName);
      reset(); // フォームリセット
      onClose(); // ポップアップを閉じる
    } catch (error) {
      alert(error);
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
          部屋名を変更する
        </h2>
        {/* 部屋名 */}
        <label className='block text-sm font-medium text-gray-600 mb-1 ml-1'>
            部屋名
        </label>
        <input
          {...register("roomName", {
            required: "部屋名は必須です。",
            maxLength: {
              value: 40,
              message: "40文字以内で入力してください。",
            },
          })}
          type="text"
          className={`w-full p-2 border rounded mb-4 ${
            errors.roomName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.roomName && (
          <p className="text-red-500 text-sm mb-4">{errors.roomName.message}</p>
        )}
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
}

export default EditRoomPopup