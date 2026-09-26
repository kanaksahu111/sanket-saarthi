import { useState } from "react";

import {
  ArrowLeft,
  Contrast,
  Languages,
  MessageSquareText,
  Type,
  Volume2,
} from "lucide-react";

import VisualAlert from "../components/communication/VisualAlert";
import AudioGuidance from "../components/communication/AudioGuidance";
import SimpleGuidance from "../components/communication/SimpleGuidance";
import AnnouncementCard from "../components/communication/AnnouncementCard";

import {
  languages,
  translations,
} from "../data/communicationTranslations";

function AccessibleCommunication() {
  const [language, setLanguage] = useState("en");
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [autoRead, setAutoRead] = useState(false);

  const t = translations[language];

  const isRTL = language === "ur";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-screen transition-all ${
        highContrast
          ? "bg-black text-white"
          : "bg-[#F7F7F2] text-[#14251D]"
      } ${largeText ? "text-lg" : ""}`}
    >
      <header
        className={`border-b ${
          highContrast
            ? "border-white/30"
            : "border-[#E1E5DF]"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${
                highContrast
                  ? "bg-yellow-300 text-black"
                  : "bg-[#14251D] text-white"
              }`}
            >
              स
            </div>

            <span className="font-bold">
              Sanket Saarthi
            </span>
          </div>

          <button
            onClick={() => window.history.back()}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
              highContrast
                ? "border-white"
                : "border-[#D9DDD6] bg-white"
            }`}
          >
            <ArrowLeft size={16} />
            {t.back}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <section className="mb-9">
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
              highContrast
                ? "bg-yellow-300 text-black"
                : "bg-[#EAF0EA] text-[#52725F]"
            }`}
          >
            <MessageSquareText size={23} />
          </div>

          <p
            className={`text-xs font-bold uppercase tracking-[0.17em] ${
              highContrast
                ? "text-yellow-300"
                : "text-[#648A73]"
            }`}
          >
            {t.pageLabel}
          </p>

          <h1
            className={`mt-2 max-w-3xl font-bold leading-tight ${
              largeText
                ? "text-5xl md:text-6xl"
                : "text-4xl md:text-5xl"
            }`}
          >
            {t.heading}
          </h1>

          <p
            className={`mt-4 max-w-2xl leading-7 ${
              highContrast
                ? "text-gray-200"
                : "text-[#737D77]"
            }`}
          >
            {t.description}
          </p>
        </section>

        {/* Language selector */}

        <section
          className={`mb-5 rounded-[3xl] border p-5 ${
            highContrast
              ? "border-white/40 bg-[#111]"
              : "border-[#E0E4DD] bg-white"
          }`}
        >
          <div className="mb-4 flex items-center gap-2 font-bold">
            <Languages size={20} />
            {t.chooseLanguage}
          </div>

          <div className="flex flex-wrap gap-2">
            {languages.map((item) => (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  language === item.code
                    ? highContrast
                      ? "bg-yellow-300 text-black"
                      : "bg-[#14251D] text-white"
                    : highContrast
                    ? "border border-white/40"
                    : "border border-[#DDE2DC] bg-[#F7F7F2]"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </section>

        {/* Accessibility controls */}

        <section
          className={`mb-8 rounded-[3xl] border p-5 ${
            highContrast
              ? "border-white/40 bg-[#111]"
              : "border-[#E0E4DD] bg-white"
          }`}
        >
          <p className="mb-4 font-bold">
            {t.accessibility}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setLargeText(!largeText)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2.5 font-semibold ${
                largeText
                  ? "bg-[#648A73] text-white"
                  : ""
              }`}
            >
              <Type size={18} />
              {t.largeText}
            </button>

            <button
              onClick={() =>
                setHighContrast(!highContrast)
              }
              className={`flex items-center gap-2 rounded-full border px-4 py-2.5 font-semibold ${
                highContrast
                  ? "border-yellow-300 bg-yellow-300 text-black"
                  : ""
              }`}
            >
              <Contrast size={18} />
              {t.highContrast}
            </button>

            <button
              onClick={() => setAutoRead(!autoRead)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2.5 font-semibold ${
                autoRead
                  ? highContrast
                    ? "bg-yellow-300 text-black"
                    : "bg-[#648A73] text-white"
                  : ""
              }`}
            >
              <Volume2 size={18} />
              {t.autoRead}
            </button>
          </div>
        </section>

        <div className="space-y-5">
          <VisualAlert
            language={language}
            highContrast={highContrast}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <AudioGuidance
              language={language}
              highContrast={highContrast}
              autoRead={autoRead}
            />

            <SimpleGuidance
              language={language}
              highContrast={highContrast}
            />
          </div>

          <AnnouncementCard
            language={language}
            highContrast={highContrast}
          />
        </div>
      </main>
    </div>
  );
}

export default AccessibleCommunication;