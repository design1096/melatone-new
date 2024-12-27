"use client";
import { useAppContext } from '@/context/AppContext';
import { collection, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../../firebase';
import { FiLogOut } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FaFaceSmile } from "react-icons/fa6";
import AddNewRoomPopup from './AddNewRoomPopup';

interface SidebarMobileProps {
  toggleSidebar: () => void;
}

type Room = {
id: string;
name: string;
createdAt: Timestamp;
}

const SidebarMobile: React.FC<SidebarMobileProps> = ({ toggleSidebar }) =>  {
  const { user, userId, setSelectedRoom, setSelectedRoomName, isRoomPopupOpen, setIsRoomPopupOpen } = useAppContext();
  const [rooms, setRooms] = useState<Room[]>([]);
  
  // ルーム取得
  useEffect(() => {
    if (user) {
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
        });
        return () => {
          unsubscribe();
        };
      };
      fetchRooms();
    }
  }, [userId]);

  // ルーム選択処理
  const selectRoom = (roomId: string, roomName: string) => {
    setSelectedRoom(roomId);
    setSelectedRoomName(roomName);
    toggleSidebar();
  };

  // ログアウト関数
  const handleLogOut = () => {
    auth.signOut();
  };

  return (
    <div className='h-full bg-main-dark-color over-flow-y-auto px-5 flex flex-col'>
      <div className='flex-grow'>
          {/* クローズボタン */}
          <div className='mt-4 font-semibold text-white'>
              <button onClick={toggleSidebar} className='flex flex-col items-center'>
                  <IoClose className='text-3xl leading-none' />
                  <span className="text-xs leading-tight mt-[-0.1rem]">close</span>
              </button>
          </div>
          {/* ルーム追加 */}
          <div 
              className='cursor-pointer flex justify-evenly items-center border mt-4 rounded-md hover:bg-main-color duration-150'
              onClick={() => setIsRoomPopupOpen(true)} // ポップアップを表示
          >
              <div className='text-white py-4 px-4'>
              <span className='text-2xl pr-4 align-middle'>＋</span>
              <span className='text-lg font-semibold align-middle'>新しい部屋</span>
              </div>
          </div>
          {/* ルーム名表示 */}
          <ul>
              {rooms.map((room) => (
              <li 
                  key={room.id} 
                  className='cursor-pointer border-b p-4 text-slate-100 hover:bg-main-color duration-150'
                  onClick={() => selectRoom(room.id, room.name)}
              >
                  {room.name}
              </li>
              ))}
          </ul>
      </div>
      {/* プロフィール登録・編集 */}
      <div 
        className='cursor-pointer border mt-4 rounded-md hover:bg-main-color duration-150'
      >
        <div className='text-white flex items-center justify-evenly px-4 pt-4 pb-2'>
          <FaFaceSmile 
            style={{
              flexShrink: 0, // 親のflexboxの影響を防ぐ
            }}
            className='text-4xl mr-2' 
          />
          <div className='text-xl'>ユーザーさん</div>
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
      {isRoomPopupOpen && (
        <AddNewRoomPopup 
          isOpen={isRoomPopupOpen} 
          onClose={() => setIsRoomPopupOpen(false)} 
        />
      )}
    </div>
  )
}

export default SidebarMobile