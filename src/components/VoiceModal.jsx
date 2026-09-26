import { useState, useEffect, useCallback } from "react";
import { Mic, MicOff, Volume2, X, Send, Sparkles } from "lucide-react";
import { voiceService } from "../services/voiceService";
import { getTranslation, LANGUAGES } from "../services/i18n";

function VoiceModal({ isOpen, onClose, currentLang, onCommand }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [inputText, setInputText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [supported, setSupported] = useState(true);

  const voiceLang = LANGUAGES.find((l) => l.code === currentLang)?.voiceLang || "en-US";

  const processCommand = useCallback(
    (text) => {
      const cmd = text.toLowerCase().trim();
      let actionFeedback = `Understood: "${text}". Processing request...`;

      if (
        cmd.includes("station") ||
        cmd.includes("railway") ||
        cmd.includes("स्टेशन") ||
        cmd.includes("रेल्वे")
      ) {
        onCommand("select_place", "railway");
        actionFeedback = "Navigating to Railway Station guidance...";
      } else if (
        cmd.includes("hospital") ||
        cmd.includes("अस्पताल") ||
        cmd.includes("रुग्णालय")
      ) {
        onCommand("select_place", "hospital");
        actionFeedback = "Navigating to Hospital guidance...";
      } else if (
        cmd.includes("help") ||
        cmd.includes("assistance") ||
        cmd.includes("मदद") ||
        cmd.includes("सहायता") ||
        cmd.includes("मदत")
      ) {
        onCommand("request_assistance");
        actionFeedback = "Requested assistance for you!";
      } else if (
        cmd.includes("start") ||
        cmd.includes("journey") ||
        cmd.includes("शुरू") ||
        cmd.includes("सुरू")
      ) {
        onCommand("start_journey");
        actionFeedback = "Starting guided journey...";
      } else if (
        cmd.includes("next") ||
        cmd.includes("ahead") ||
        cmd.includes("अगला") ||
        cmd.includes("पुढील")
      ) {
        onCommand("next_step");
        actionFeedback = "Advanced to next route checkpoint.";
      } else if (cmd.includes("hindi") || cmd.includes("हिंदी")) {
        onCommand("change_lang", "hi");
        actionFeedback = "Switched language to Hindi.";
      } else if (cmd.includes("english")) {
        onCommand("change_lang", "en");
        actionFeedback = "Switched language to English.";
      } else if (cmd.includes("marathi") || cmd.includes("मराठी")) {
        onCommand("change_lang", "mr");
        actionFeedback = "Switched language to Marathi.";
      } else if (
        cmd.includes("staff") ||
        cmd.includes("portal") ||
        cmd.includes("कर्मचारी")
      ) {
        onCommand("go_staff");
        actionFeedback = "Opening Staff Operations Portal...";
      } else {
        onCommand("generic", text);
      }

      setFeedback(actionFeedback);
      voiceService.speak(actionFeedback, voiceLang);
    },
    [onCommand, voiceLang]
  );

  const handleStartListening = useCallback(() => {
    setFeedback("");
    setTranscript("");
    setListening(true);

    voiceService.startListening(
      (text) => {
        setTranscript(text);
        setListening(false);
        processCommand(text);
      },
      (err) => {
        setListening(false);
        if (err === "NOT_SUPPORTED") {
          setSupported(false);
          setFeedback(getTranslation(currentLang, "voiceUnsupported"));
        } else {
          setFeedback(`Voice error: ${err}`);
        }
      },
      voiceLang
    );
  }, [currentLang, processCommand, voiceLang]);

  const handleStopListening = useCallback(() => {
    voiceService.stopListening();
    setListening(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      voiceService.stopListening();
    }
  }, [isOpen]);

  const handleSubmitText = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setTranscript(inputText);
    processCommand(inputText);
    setInputText("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#E0E4DD]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EEF2EC] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#14251D] text-white shadow-md">
              <Sparkles size={20} className="text-[#8EAA95]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#14251D]">
                {getTranslation(currentLang, "voiceAssistant")}
              </h3>
              <p className="text-xs text-[#65716A]">
                {getTranslation(currentLang, "speakCommand")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0F3EE] text-[#14251D] hover:bg-[#E0E5DF] transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mic visualizer / status */}
        <div className="my-8 flex flex-col items-center justify-center text-center">
          <div className="relative flex items-center justify-center">
            {listening && (
              <div className="absolute h-24 w-24 animate-ping rounded-full bg-[#52725F]/20" />
            )}

            <button
              onClick={listening ? handleStopListening : handleStartListening}
              className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full transition shadow-lg cursor-pointer ${
                listening
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-[#14251D] text-white hover:scale-105"
              }`}
            >
              {listening ? <MicOff size={32} /> : <Mic size={32} />}
            </button>
          </div>

          <p className="mt-4 text-sm font-semibold text-[#14251D]">
            {listening
              ? getTranslation(currentLang, "listening")
              : transcript
              ? `"${transcript}"`
              : supported
              ? "Tap mic to speak"
              : getTranslation(currentLang, "voiceUnsupported")}
          </p>

          {feedback && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#EDF3ED] px-4 py-3 text-sm font-medium text-[#52725F]">
              <Volume2 size={18} className="shrink-0" />
              <span>{feedback}</span>
            </div>
          )}
        </div>

        {/* Fallback Text Input */}
        <form onSubmit={handleSubmitText} className="flex gap-2 border-t border-[#EEF2EC] pt-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Or type voice command..."
            className="flex-1 rounded-xl border border-[#D9DDD6] px-4 py-2.5 text-sm focus:border-[#52725F] focus:outline-none text-[#14251D]"
          />
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#14251D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#253D31] transition cursor-pointer"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default VoiceModal;
