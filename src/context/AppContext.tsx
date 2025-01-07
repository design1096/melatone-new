"use client";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "../../firebase";
import { usePathname, useRouter } from 'next/navigation';

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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
      setUserId(newUser ? newUser.uid : null);

      // ユーザーが取得できないかつ現在のページが "/auth/register" でない場合
      if (!newUser && pathname !== "/auth/register") {
        router.push("/auth/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}