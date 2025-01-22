"use client";
import { collection, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { FiLogOut } from "react-icons/fi";
import { db, storage } from '../../../firebase';
import { useAppContext } from '@/context/AppContext';
import { FaFaceSmile } from "react-icons/fa6";
import AddNewRoomPopup from './AddNewRoomPopup';
import AddProfilePopup from './AddProfilePopup';
import FirstPopup from './FirstPopup';
import Image from 'next/image';
import { getDownloadURL, ref } from 'firebase/storage';
import useLogout from '@/hooks/useLogout';

type Room = {
  id: string;
  name: string;
  createdAt: Timestamp;
}

const Sidebar = () => {
  const { 
    user, 
    userId, 
    setSelectedRoom, 
    setSelectedRoomName, 
    isAddRoomPopupOpen, 
    setIsAddRoomPopupOpen, 
    isProfilePopupOpen, 
    setIsProfilePopupOpen,
    isFirstPopupOpen,
    setIsFirstPopupOpen,
    profileImageUrl,
    setProfileImageUrl,
    isLoggingOut,
  } = useAppContext();

  // ルーム情報管理
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (user) {
      // ルームの取得
      const fetchRooms = async () => {
        const roomCollectionRef = collection(db, "rooms");
        const q = query(
          roomCollectionRef, 
          where("userId", "==", userId), 
          orderBy("createdAt")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newRooms: Room[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            createdAt: doc.data().createdAt,
          }));
          setRooms(newRooms);
          // ルームが0件の場合にポップアップを表示
          if (newRooms.length === 0) {
            setIsFirstPopupOpen(true);
          }
        });
        return () => {
          unsubscribe();
        };
      };
      fetchRooms();

      // アイコン画像取得
      const fetchProfileImage = async () => {
        if (user.photoURL) {
          const profileImageRef = ref(storage, user.photoURL);
          const url = await getDownloadURL(profileImageRef);
          setProfileImageUrl(url);
        } else {
          setProfileImageUrl(null);
        }
      };
      fetchProfileImage();
    }
  }, [setIsFirstPopupOpen, setProfileImageUrl, user, userId]);

  // ルーム選択処理
  const selectRoom = (roomId: string, roomName: string) => {
    setSelectedRoom(roomId);
    setSelectedRoomName(roomName);
  };

  // ログアウト関数
  const handleLogOut = useLogout();

  // ログアウト中は空の状態をレンダリング
  if (isLoggingOut) {
    return null;
  }

  return (
    <div className='h-full bg-main-dark-color over-flow-y-auto px-5 flex flex-col'>
      <div className='flex-grow'>
        {/* ルーム追加 */}
        <div 
          className='cursor-pointer flex justify-evenly items-center border mt-4 rounded-md hover:bg-main-color duration-150'
          onClick={() => setIsAddRoomPopupOpen(true)} // ポップアップを表示
        >
          <div className='text-white py-4 px-4'>
            <span className='text-2xl pr-4 align-middle'>＋</span>
            <span className='text-lg font-semibold align-middle'>新しい部屋</span>
          </div>
        </div>
        {/* ルーム名表示 */}
        <div className='flex-grow overflow-y-auto mt-4 custom-max-height'>
          <ul>
            {rooms.map((room) => (
              <li 
                key={room.id} 
                className='cursor-pointer border-b p-4 mr-1 text-slate-100 hover:bg-main-color duration-150'
                onClick={() => selectRoom(room.id, room.name)}
              >
                {room.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* プロフィール登録・編集 */}
      <div 
        className='cursor-pointer border mt-4 rounded-md hover:bg-main-color duration-150'
        onClick={() => setIsProfilePopupOpen(true)} // ポップアップを表示
      >
        {/* アイコン画像表示 */}
        <div className='text-white flex items-center justify-evenly px-4 pt-4 pb-2'>
          {profileImageUrl && 
            <Image
              src={profileImageUrl}
              alt="アイコン画像"
              className="w-12 h-12 rounded-full mr-2"
              width={80}
              height={80}
              unoptimized
            /> ||
            <FaFaceSmile 
              style={{
                flexShrink: 0, // 親のflexboxの影響を防ぐ
              }}
              className='text-4xl mr-2' 
            />
          }
          <div className='text-xl'>{user?.displayName || "ユーザー"}さん</div>
        </div>
        <div className='text-white flex items-center justify-evenly px-4 pb-4'>
          <div className='text-sm'>プロフィール登録・編集</div>
        </div>
      </div>
      {/* ログアウト */}
      <div 
        className='text-lg rounded-md flex items-center justify-evenly mb-5 cursor-pointer p-4 text-slate-100 hover:bg-main-color duration-150'
        onClick={() => handleLogOut()}
      >
        <FiLogOut
          style={{
            flexShrink: 0,
          }}
          className='text-xl'
        />
        <span>ログアウト</span>
      </div>
      {/* ポップアップのレンダリング */}
      {isAddRoomPopupOpen && (
        <AddNewRoomPopup 
          isOpen={isAddRoomPopupOpen} 
          onClose={() => setIsAddRoomPopupOpen(false)} 
        />
      )}
      {isProfilePopupOpen && (
        <AddProfilePopup 
          isOpen={isProfilePopupOpen} 
          onClose={() => setIsProfilePopupOpen(false)} 
        />
      )}
      {isFirstPopupOpen && (
        <FirstPopup
          isOpen={isFirstPopupOpen}
          onClose={() => setIsFirstPopupOpen(false)}
        />
      )}
    </div>
  )
}

export default Sidebar