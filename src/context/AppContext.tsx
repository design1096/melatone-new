"use client";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "../../firebase";
import { useRouter } from 'next/navigation';

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
  isRoomPopupOpen: boolean;
  setIsRoomPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultContextData = {
  user: null,
  userId: null,
  setUser: () => {},
  selectedRoom: null,
  setSelectedRoom: () => {},
  selectedRoomName: null,
  setSelectedRoomName: () => {},
  isRoomPopupOpen: false,
  setIsRoomPopupOpen: () => {},
}

const AppContext = createContext<AppContextType>(defaultContextData);

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedRoomName, setSelectedRoomName] = useState<string | null>(null);
  const [isRoomPopupOpen, setIsRoomPopupOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
      setUserId(newUser ? newUser.uid : null);

      // ユーザ情報が取得できない場合
      if (!newUser) {
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
        isRoomPopupOpen,
        setIsRoomPopupOpen,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}