class VoiceService {
  constructor() {
    this.synth = typeof window !== "undefined" && window.speechSynthesis;
    this.recognition = null;
    this.isListening = false;
    this.voices = [];
    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  speak(text, voiceLang = "en-US") {
    if (!this.synth) return;

    this.synth.cancel(); // Stop current speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLang;

    // Try to find matching voice for target language
    const matchingVoice = this.voices.find(v => v.lang.startsWith(voiceLang.split("-")[0]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  initRecognition(onResult, onError, voiceLang = "en-US") {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onError) onError("NOT_SUPPORTED");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = voiceLang;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };

    recognition.onerror = (event) => {
      if (onError) onError(event.error);
    };

    recognition.onend = () => {
      this.isListening = false;
    };

    return recognition;
  }

  startListening(onResult, onError, voiceLang = "en-US") {
    this.recognition = this.initRecognition(onResult, onError, voiceLang);
    if (this.recognition) {
      try {
        this.recognition.start();
        this.isListening = true;
      } catch (err) {
        if (onError) onError(err);
      }
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

export const voiceService = new VoiceService();
