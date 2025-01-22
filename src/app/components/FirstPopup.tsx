import React from 'react';
import ReactDOM from 'react-dom';
import { IoClose } from "react-icons/io5";
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const FirstPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  // コンテキスト
  const { iconUrl } = useAppContext();

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-md xs:w-80 md:w-96 animate-unfoldIn">
            {/* クローズボタン */}
            <div className="absolute top-3 right-3">
                <button onClick={onClose}>
                    <IoClose className="text-3xl font-semibold text-gray-500" />
                </button>
            </div>
            {/* メラトンアイコン表示 */}
            <div>
                {iconUrl && (
                    <Image
                        src={iconUrl}
                        alt="メラトン"
                        className=""
                        width={400}
                        height={400}
                        unoptimized
                    />
                )}
            </div>
            {/* メラトン自己紹介 */}
            <div className='text-center text-sm text-main-dark-color leading-6'>
                <p>わたしの名前はメラトン</p>
                <p>あなたの眠りをサポートします</p>
                <p>お部屋を作って話しかけてみてくださいね</p> 
            </div>
        </div>
    </div>,
    // ReactDOM.createPortalを使用し、ポップアップをdocument.bodyに直接レンダリング
    document.body
);
};

export default FirstPopup;