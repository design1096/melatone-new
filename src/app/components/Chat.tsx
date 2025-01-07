"use client";
import React, { useEffect, useRef, useState } from 'react'
import { IoSend } from "react-icons/io5";
import { db, storage } from '../../../firebase';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAppContext } from '@/context/AppContext';
import OpenAI from 'openai';
import LoadingIcons from 'react-loading-icons';
import { getDownloadURL, ref } from 'firebase/storage';
import { FaCirclePlay, FaCirclePause, FaVolumeOff, FaVolumeHigh } from "react-icons/fa6";
import { activeColor, inactiveColor, audioFilePath } from './constants';
import { FaMicrophone } from "react-icons/fa";

type Message = {
  id: string;
  text: string;
  sender: string;
  createdAt: Timestamp;
};

const Chat = () => {
  // OpenAIインスタンス
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });
  // コンテキスト
  const { selectedRoom, user } = useAppContext();
  // ユーザーの名前を取得
  const userName = user?.displayName || 'ユーザー';
  // 入力メッセージ
  const [inputMessage, setInputMessage] = useState<string>("");
  // 取得メッセージ
  const [messages, setMessages] = useState<Message[]>([]);
  // ローディング状態
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // スクロールDiv
  const scrollDiv = useRef<HTMLDivElement>(null);
  // BGMのURL
  const [audioUrl, setAudioUrl] = useState<string>("");
  // スライダーの値
  const [value, setValue] = useState<number>(0.5);
  // 音声認識
  const [isRecording, setIsRecording] = useState<boolean>(false);

  useEffect(() => {
    if (selectedRoom) {
      // 各Roomにおけるメッセージを取得
      const fetchMessages = async () => {
        const roomDocRef = doc(db, "rooms", selectedRoom);
        const messagesCollectionRef = collection(roomDocRef, "messages");
        const q = query(messagesCollectionRef, orderBy("createdAt"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newMessages = snapshot.docs.map((doc) => ({
            id: doc.id, // ドキュメントID
            ...(doc.data() as Omit<Message, 'id'>), // 型アサーション
          })) as Message[];
          setMessages(newMessages);
        });
        return () => {
          unsubscribe();
        };
      };
      fetchMessages();

      // StorageからBGMのURLを取得
      const fetchAudio = async () => {
        const audioRef = ref(storage, audioFilePath);
        const url = await getDownloadURL(audioRef);
        setAudioUrl(url);
      };
      fetchAudio();
    }
  }, [selectedRoom]);

  // BGM・ボリュームスライダー設定
  useEffect(() => {
    const audio = document.getElementById("bgm-audio") as HTMLAudioElement;
    if (audio) {
      // 初期音量をスライダーの値と同期
      audio.volume = value;
    }
  }, [value]);

  // スクロールDiv取得
  useEffect(() => {
    if (scrollDiv.current) {
      const element = scrollDiv.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "instant",
      });
    }
  }, [messages]);

  // メッセージ送信処理
  const sendMessage = async () => {
    // 未入力の場合
    if(!inputMessage.trim()) return;
    const messageData = {
      text: inputMessage,
      sender: "user",
      createdAt: serverTimestamp(),
    };

    // メッセージをFirestoreに保存
    const roomDocRef = doc(db, "rooms", selectedRoom!);
    const messageCollectionRef = collection(roomDocRef, "messages");
    await addDoc(messageCollectionRef, messageData);

    // ローディング開始
    setIsLoading(true);

    // メラトンのキャラクター設定
    const systemMessage = {
      role: "system",
      content: `
        あなたは「メラトン」というフクロウをモチーフにしたキャラクターです。
        色は紫色をしており、メラトンという名前は、メラトニン（Melatonin）という睡眠や覚醒のリズムを調節するホルモンに由来しています。
        また、眠れない子羊たち（ユーザー）が集う仮想世界に生息していて、その世界の案内人のような役割を担っています。
        メラトンは、親切で知識が豊富なフクロウの姿をしており、ユーザーの質問に答えつつ、自然に睡眠を促すようなメッセージを送ります。
        ユーザーが夜更かししないように優しく声をかけながら、落ち着いた雰囲気を保つのが得意です。
        会話中は、時々フクロウの特徴（翼を広げる、ふくふくした羽毛、静かな声など）を織り交ぜてください。
        また、ユーザーの名前は「${userName}」さんです。
        必要であれば、ユーザーの名前を呼び掛けながら、睡眠に役立つアドバイスを優しく提供してください。
        また、この世界で流れているBGM（音楽）についてユーザーから聞かれた際は、
        「おやすみ、夢の中」という曲名であることと、
        「フリーBGM DOVA-SYNDROME」というサイト（https://dova-s.jp/bgm/play17718.html）で楽曲のダウンロードが出来ることを教えてあげてください。
      `,
    } as any;

    // ユーザーの設定
    const userMessage = {
      role: 'user',
      content: inputMessage,
    } as any;

    // OpenAIからの返信
    const gpt3Response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, userMessage],
    });

    // 入力メッセージを空にする
    setInputMessage("");

    // ローディング終了
    setIsLoading(false);

    // レスポンスを取得
    const botResponse = gpt3Response.choices[0].message.content;
    await addDoc(messageCollectionRef, {
      text: botResponse,
      sender: "bot",
      createdAt: serverTimestamp(),
    });
  };

  // BGM再生関数
  const playAudio = async() => {
    const audio = document.getElementById('bgm-audio') as HTMLAudioElement;
    if (audio.paused) {
      audio.play();
    }
  };

  // BGM停止関数
  const pauseAudio = async() => {
    const audio = document.getElementById('bgm-audio') as HTMLAudioElement;
    if (audio.played) {
      audio.pause();
    }
  };

  // BGM音量調整関数
  const adjustVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = document.getElementById("bgm-audio") as HTMLAudioElement;
    const newValue = parseFloat(event.target.value);
    if (audio) {
      audio.volume = parseFloat(event.target.value);
    }
    setValue(newValue); // スライダーの値を更新
  };

  // ボリュームスライダー背景色変更
  const getBackgroundStyle = () => {
    const ratio = value * 100; // 0～1を0～100に変換
    return `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;
  };

  // Web Speech API
  const handleSpeechToText = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('このブラウザは音声認識をサポートしていません。Google Chromeを使用してください。');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // 日本語に設定
    recognition.lang = 'ja-JP';
    // 確定した結果のみ取得
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsRecording(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      // インプットフィールドに追加
      setInputMessage((prev) => `${prev} ${transcript}`);
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error('音声認識エラー:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      // 音声認識終了時にフラグをリセット
      setIsRecording(false);
    };
  };

  return (
    <div className='bg-blue-color h-full px-4 pb-5 flex flex-col'>
      <div className='flex-grow overflow-y-auto pr-2 pt-2 mb-4' ref={scrollDiv}>
        {messages.map((message) => (
          <div key={message.id} className={message.sender === "user" ? "text-right" : "text-left"}>
            <div className={message.sender === "user" 
              ? "bg-yellow-color inline-block rounded-lg px-4 py-2 mb-4" 
              : "bg-main-color inline-block rounded-lg px-4 py-2 mb-4"}
            >
              <p className={message.sender === "user" ? "" : "text-white"} style={{ whiteSpace: "pre-wrap" }}>{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <LoadingIcons.TailSpin />
        )}
      </div>
      {/* テキスト入力 */}
      <div className="relative w-full">
        <input 
          type="text" 
          placeholder="メラトンに話しかけてみよう" 
          className="border-2 rounded w-full pr-20 pl-3 focus:outline-none p-3" 
          onChange={(e) => setInputMessage(e.target.value)}
          value={inputMessage}
        />
        {/* マイクボタン */}
        <button
          className={`absolute inset-y-0 right-14 flex items-center justify-center ${ isRecording ? 'text-red-500' : 'text-main-color'} `}
          onClick={handleSpeechToText}
        >
          <FaMicrophone className="text-2xl" />
        </button>
        {/* 送信ボタン */}
        <button
          className="absolute inset-y-0 right-3 flex items-center justify-center text-main-color"
          onClick={() => sendMessage()}
        >
          <IoSend className="text-2xl" />
        </button>
      </div>

      {/* BGM再生エリア */}
      {audioUrl && (
        <div className='custom-audio mt-4'>
          <div className='flex justify-center items-center gap-4'>
            {/* 再生ボタン */}
            <FaCirclePlay 
              className='text-main-dark-color text-4xl bg-white rounded-full cursor-pointer'
              onClick={playAudio}
            />
            {/* 停止ボタン */}
            <FaCirclePause 
              className='text-main-dark-color text-4xl bg-white rounded-full cursor-pointer' 
              onClick={pauseAudio}
            />
            {/* ボリュームスライダー */}
            <div className='flex justify-center items-center gap-1.5'>
              <FaVolumeOff className='text-main-dark-color text-xl' />
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={value}
                className='inputRange'
                onChange={adjustVolume}
                style={{background: getBackgroundStyle()}}
              />
              <FaVolumeHigh className='text-main-dark-color text-2xl' />
            </div>
          </div>
          <audio id="bgm-audio" loop>
            <source src={audioUrl} type="audio/mpeg" />
          </audio>
      </div>
      )}
    </div>
  )
}

export default Chat