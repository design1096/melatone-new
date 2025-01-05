"use client";
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useRef, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditRoomPopup from "./EditRoomPopup";
import DeleteRoomPopup from "./DeleteRoomPopup";

interface ChatbarProps {
  toggleSidebar: () => void;
}

const Chatbar: React.FC<ChatbarProps> = ({ toggleSidebar }) => {
  // 選択したルーム
  const { selectedRoom, selectedRoomName, isEditRoomPopupOpen, setIsEditRoomPopupOpen, isDeleteRoomPopupOpen, setIsDeleteRoomPopupOpen } = useAppContext();
  // 選択したルームの状態を管理
  const [isRoomSelected, setIsRoomSelected] = useState(false);
  // メニューの表示状態を管理
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // メニューのDOM参照
  const menuRef = useRef<HTMLDivElement>(null);

  // ルームの状態を取得
  useEffect(() => {
    if (selectedRoom != null)  {
      setIsRoomSelected(true);
    } else {
      setIsRoomSelected(false);
    }
  }, [selectedRoom]);

  //ドットメニュー外のクリックを検知して閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ドットメニューの表示/非表示を切り替える関数
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // ドットメニューのクリックイベントを処理する
  const handleMenuClick = (action: "edit" | "delete") => {
    if (action === "edit") {
      setIsEditRoomPopupOpen(true);
    } else if (action === "delete") {
      setIsDeleteRoomPopupOpen(true);
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="flex items-center justify-between bg-blue-color text-main-dark-color font-semibold pl-4 pr-4 pt-4 pb-4">
      {/* ハンバーガーメニュー (スマホ表示時のみ) */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        <div className="flex flex-col items-center mr-3">
          <IoMenu className="text-3xl" />
          <span className="text-xs leading-[0.5rem]">menu</span>
        </div>
      </button>
      {/* 選択されたルーム名 */}
      <span className="text-lg sm:text-xl lg:text-2xl">
        {selectedRoomName}
      </span>
      {/* ドットメニュー */}
      {isRoomSelected && (
        <div className="relative" ref={menuRef}>
          <HiOutlineDotsHorizontal
            className="cursor-pointer text-xl"
            onClick={toggleMenu}
          />
          {isMenuOpen &&(
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-10">
              <div className="text-sm text-gray-700">
                {/* 編集 */}
                <div className="p-3 flex items-center rounded-md hover:bg-gray-100 cursor-pointer text-gray-500 text-sm">
                <FaEdit className="mr-2" />
                  <div onClick={() => handleMenuClick("edit")}>
                    部屋名を変更
                  </div>
                </div>
                {/* 削除 */}
                <div className="p-3 flex items-center rounded-md hover:bg-gray-100 cursor-pointer text-red-400 text-sm">
                  <RiDeleteBin6Line className="mr-2" />
                  <div onClick={() => handleMenuClick("delete")}>
                    部屋を削除
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* ポップアップのレンダリング */}
      {isEditRoomPopupOpen && (
        <EditRoomPopup 
          isOpen={isEditRoomPopupOpen} 
          onClose={() => setIsEditRoomPopupOpen(false)} 
        />
      )}
      {isDeleteRoomPopupOpen && (
        <DeleteRoomPopup 
          isOpen={isDeleteRoomPopupOpen} 
          onClose={() => setIsDeleteRoomPopupOpen(false)} 
        />
      )}
    </div>
  )
}

export default Chatbar