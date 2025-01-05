"use client";
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { db } from '../../../firebase';
import { useAppContext } from '@/context/AppContext';

const DeleteRoomPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { selectedRoom, setSelectedRoom, selectedRoomName, setSelectedRoomName } = useAppContext();
  const {
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit: SubmitHandler<any> = async () => {
    // selectedRoomがnullの場合の処理
    if (!selectedRoom) {
      alert("部屋が選択されていません。");
      return;
    }
    // Firestoreのルームを削除
    try {
      const roomRef = doc(db, "rooms", selectedRoom);
      const messagesRef = collection(roomRef, "messages");

      // メッセージ削除処理
      const messagesSnapshot = await getDocs(messagesRef); // 全メッセージ取得
      const deletePromises = messagesSnapshot.docs.map((messageDoc) =>
        deleteDoc(messageDoc.ref) // 各メッセージを削除
      );
      await Promise.all(deletePromises); // すべての削除を待機

      // ルーム削除処理
      await deleteDoc(roomRef);
      setSelectedRoom(null);
      setSelectedRoomName(null);
      reset(); // フォームリセット
      onClose(); // ポップアップを閉じる
      alert("削除しました。");
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
        <h2 className="text-lg font-medium text-slate-700 mb-3">
          「{selectedRoomName}」を削除してよろしいですか？
        </h2>
        <div className='text-sm text-slate-500 mb-4'>
            ※「{selectedRoomName}」内の会話もすべて削除されます。
        </div>
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
            className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-400"
          >
            削除する
          </button>
        </div>
      </form>
    </div>,
    // ReactDOM.createPortalを使用し、ポップアップをdocument.bodyに直接レンダリング
    document.body
  );
}

export default DeleteRoomPopup