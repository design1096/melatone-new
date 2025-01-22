"use client";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth, storage } from "../../firebase";
import { usePathname, useRouter } from 'next/navigation';
import { getDownloadURL, ref } from "firebase/storage";
import { iconFilePath } from "@/app/components/constants";

type AppProviderProps = {
  children: ReactNode;
};

type AppContextType = {
  user: User | null;
  userId: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  selectedRoom: string | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
  selectedRoomName: string | null;
  setSelectedRoomName: React.Dispatch<React.SetStateAction<string | null>>;
  isAddRoomPopupOpen: boolean;
  setIsAddRoomPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isProfilePopupOpen: boolean;
  setIsProfilePopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditRoomPopupOpen: boolean;
  setIsEditRoomPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteRoomPopupOpen: boolean;
  setIsDeleteRoomPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFirstPopupOpen: boolean;
  setIsFirstPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  iconUrl: string | null;
  setIconUrl: React.Dispatch<React.SetStateAction<string | null>>;
  profileImageUrl: string | null;
  setProfileImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
  isLoggingOut: boolean;
  setIsLoggingOut: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultContextData = {
  user: null,
  userId: null,
  setUser: () => {},
  selectedRoom: null,
  setSelectedRoom: () => {},
  selectedRoomName: null,
  setSelectedRoomName: () => {},
  isAddRoomPopupOpen: false,
  setIsAddRoomPopupOpen: () => {},
  isProfilePopupOpen: false,
  setIsProfilePopupOpen: () => {},
  isEditRoomPopupOpen: false,
  setIsEditRoomPopupOpen: () => {},
  isDeleteRoomPopupOpen: false,
  setIsDeleteRoomPopupOpen: () => {},
  isFirstPopupOpen: false,
  setIsFirstPopupOpen: () => {},
  iconUrl: null,
  setIconUrl: () => {},
  profileImageUrl: null,
  setProfileImageUrl: () => {},
  isLoggingOut: false,
  setIsLoggingOut: () => {},
}

const AppContext = createContext<AppContextType>(defaultContextData);

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedRoomName, setSelectedRoomName] = useState<string | null>(null);
  const [isAddRoomPopupOpen, setIsAddRoomPopupOpen] = useState<boolean>(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState<boolean>(false);
  const [isEditRoomPopupOpen, setIsEditRoomPopupOpen] = useState<boolean>(false);
  const [isDeleteRoomPopupOpen, setIsDeleteRoomPopupOpen] = useState<boolean>(false);
  const [isFirstPopupOpen, setIsFirstPopupOpen] = useState<boolean>(false);
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  // 認証状態の読み込み状態を管理
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
      setUserId(newUser ? newUser.uid : null);
      setIsAuthLoading(false); // 読み込み完了

      if (!newUser) {
        // ログインしていない場合、特定の認証ページ以外はログイン画面にリダイレクト
        if (pathname !== "/auth/login" && pathname !== "/auth/register") {
          router.push("/auth/login");
        }
      } else {
        // ログイン済みの場合、認証ページではホーム画面にリダイレクト
        if (pathname === "/auth/login" || pathname === "/auth/register") {
          router.push("/");
        }
      }
    }
  );

    // StorageからアイコンのURLを取得
    const fetchIcon = async () => {
      const iconRef = ref(storage, iconFilePath);
      const url = await getDownloadURL(iconRef);
      setIconUrl(url);
    };
    fetchIcon();

    return () => {
      unsubscribe();
    };
  }, [pathname, router]);

  // 認証状態の読み込み中は空の状態をレンダリング
  if (isAuthLoading) {
    return null;
  }

  return (
    <AppContext.Provider 
      value={{ 
        user, 
        userId, 
        setUser, 
        selectedRoom, 
        setSelectedRoom, 
        selectedRoomName, 
        setSelectedRoomName,
        isAddRoomPopupOpen,
        setIsAddRoomPopupOpen,
        isProfilePopupOpen,
        setIsProfilePopupOpen,
        isEditRoomPopupOpen,
        setIsEditRoomPopupOpen,
        isDeleteRoomPopupOpen,
        setIsDeleteRoomPopupOpen,
        isFirstPopupOpen,
        setIsFirstPopupOpen,
        iconUrl,
        setIconUrl,
        profileImageUrl,
        setProfileImageUrl,
        isLoggingOut,
        setIsLoggingOut,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}