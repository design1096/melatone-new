"use client";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import { IoMenu } from "react-icons/io5";

interface ChatbarProps {
  toggleSidebar: () => void;
}

const Chatbar: React.FC<ChatbarProps> = ({ toggleSidebar }) => {
  // 選択したルーム
  const { selectedRoomName } = useAppContext();

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
    </div>
  )
}

export default Chatbar