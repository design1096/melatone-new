"use client";
import Sidebar from "./components/Sidebar";
import SidebarMobile from "./components/SidebarMobile";
import Chat from "./components/Chat";
import Chatbar from "./components/Chatbar";
import { useState } from "react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // サイドバーのトグル状態
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="h-full flex flex-col w-full lg:flex-row lg:w-[1280px]">
        {/* サイドバー (デスクトップ表示) */}
        <div
          className={`hidden lg:block relative z-50 top-0 left-0 h-full bg-white border-r shadow-lg lg:w-1/5`}
        >
          <Sidebar />
        </div>

        {/* サイドバーモバイル (スマホ表示) */}
        <div
          className={`absolute lg:hidden md:w-1/3 sm:w-1/2 smx:w-2/3 xs:w-full z-50 top-0 left-0 h-full bg-white border-r shadow-lg transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarMobile toggleSidebar={toggleSidebar} />
        </div>

        {/* 背景のクリックでサイドバーを閉じる (スマホ表示のみ) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* チャットバーとチャット */}
        <div className="flex-1 h-full lg:w-4/5 flex flex-col overflow-hidden">
          <Chatbar toggleSidebar={toggleSidebar} />
          <div className="flex-1 overflow-y-auto">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
}
