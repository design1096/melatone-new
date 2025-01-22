import { useRouter } from "next/navigation";
import { auth } from "../../firebase";
import { useAppContext } from "@/context/AppContext";

const useLogout = () => {
  const { setSelectedRoom, setSelectedRoomName, setProfileImageUrl, setIsLoggingOut } = useAppContext();
  const router = useRouter();

  const handleLogOut = async () => {
    if (typeof window === "undefined") {
      return; // サーバーサイドでは実行しない
    }

    setIsLoggingOut(true);
    setSelectedRoom(null);
    setSelectedRoomName(null);
    setProfileImageUrl(null);

    try {
      await auth.signOut();
      router.push("/auth/login");
    } catch {
      alert("ログアウトに失敗しました");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return handleLogOut;
};

export default useLogout;
