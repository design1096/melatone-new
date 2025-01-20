interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
}

interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
}
  
interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
}
  
interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
    length: number;
}
  
interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: "aborted" | "audio-capture" | "network" | "not-allowed" | "service-not-allowed" | "bad-grammar" | "language-not-supported";
    message?: string;
}