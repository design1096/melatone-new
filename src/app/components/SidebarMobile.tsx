"use client";
import { useAppContext } from '@/context/AppContext';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, Timestamp, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../../firebase';
import { FiLogOut } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

interface SidebarMobileProps {
  toggleSidebar: () => void;
}

type Room = {
id: string;
name: string;
createdAt: Timestamp;
}

const SidebarMobile: React.FC<SidebarMobileProps> = ({ toggleSidebar }) =>  {
  const { user, userId, setSelectedRoom, setSelectedRoomName } = useAppContext();
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

  // 新規ルーム作成処理
  const addNewRoom = async () => {
    const roomName = prompt("ルーム名を入力してください。");
    if (roomName) {
        const newRoomRef = collection(db, "rooms");
        await addDoc(newRoomRef, {
        name: roomName,
        userId: userId,
        createdAt: serverTimestamp(),
        });
    }
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
              onClick={addNewRoom}
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
      {/* ユーザ情報 */}
      {/* {user && <div className='mb-2 p-4 text-slate-100 text-lg font-medium'>{user.email}</div>} */}
      {/* ログアウト */}
      <div 
          className='text-lg rounded-md flex items-center justify-evenly mb-5 cursor-pointer p-4 text-slate-100 hover:bg-main-color duration-150'
          onClick={() => handleLogOut()}
      >
          <FiLogOut
              style={{
              flexShrink: 0, // 親のflexboxの影響を防ぐ
              }}
              className='text-xl'
          />
          <span>ログアウト</span>
      </div>
    </div>
  )
}

export default SidebarMobile