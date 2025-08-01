"use client";

import { useState, useEffect, useRef } from "react";
import { Heart, ArrowDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function RomanticProposal() {
  const [scrollY, setScrollY] = useState(0);
  const [showMessage1, setShowMessage1] = useState(false);
  const [showMessage2, setShowMessage2] = useState(false);
  const [showMessage3, setShowMessage3] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [celebrationHearts, setCelebrationHearts] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicStarted, setMusicStarted] = useState(false);

  // Global continuous falling hearts - covering entire page
  const [fallingHearts] = useState(() =>
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5, // Sin retraso inicial
      duration: Math.random() * 12 + 8,
      size: Math.random() * 18 + 8,
      opacity: Math.random() * 0.6 + 0.2,
      color: [
        "text-pink-400",
        "text-red-400",
        "text-rose-400",
        "text-purple-400",
        "text-pink-500",
      ][Math.floor(Math.random() * 5)],
    }))
  );

  // More falling hearts for density
  const [fallingHearts2] = useState(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i + 100,
      x: Math.random() * 100,
      delay: Math.random() * 25 + 5, // Sin retraso inicial adicional, solo el offset aleatorio
      duration: Math.random() * 15 + 10,
      size: Math.random() * 15 + 6,
      opacity: Math.random() * 0.5 + 0.1,
      color: [
        "text-pink-300",
        "text-red-300",
        "text-rose-300",
        "text-purple-300",
        "text-pink-600",
      ][Math.floor(Math.random() * 5)],
    }))
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Iniciar música automáticamente
  useEffect(() => {
    const startMusic = async () => {
      if (!musicStarted && audioRef.current) {
        try {
          audioRef.current.currentTime = 30; // Comenzar desde los 30 segundos
          audioRef.current.volume = 0.6; // Volumen al 60%
          await audioRef.current.play();
          setMusicStarted(true);
        } catch (error) {
          console.log(
            "Autoplay bloqueado, se reproducirá con la primera interacción del usuario"
          );
        }
      }
    };

    // Intentar reproducir después de un pequeño delay
    const timer = setTimeout(startMusic, 1000);
    return () => clearTimeout(timer);
  }, [musicStarted]);

  // Iniciar música con la primera interacción del usuario si el autoplay falló
  useEffect(() => {
    const handleFirstInteraction = async () => {
      if (!musicStarted && audioRef.current) {
        try {
          audioRef.current.currentTime = 30;
          audioRef.current.volume = 0.6;
          await audioRef.current.play();
          setMusicStarted(true);
        } catch (error) {
          console.log("Error al reproducir música:", error);
        }
      }
    };

    const events = ["click", "scroll", "keydown", "touchstart"];
    events.forEach((event) => {
      document.addEventListener(event, handleFirstInteraction, { once: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };
  }, [musicStarted]);

  useEffect(() => {
    if (scrollY > 1200) {
      setTimeout(() => setShowMessage1(true), 1500);
    }
    if (scrollY > 2200) {
      setTimeout(() => setShowMessage2(true), 1500);
    }
    if (scrollY > 3200) {
      setTimeout(() => setShowMessage3(true), 1500);
    }
    if (scrollY > 4200) {
      setTimeout(() => setShowLetter(true), 1500);
    }
  }, [scrollY]);

  const handleLetterClick = () => {
    // Crear corazones de celebración
    const newHearts = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));
    setCelebrationHearts(newHearts);
    setShowModal(true);
  };

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-gradient-to-b from-pink-400 via-red-100 to-purple-100">
      {/* Background Music - Local Audio File */}
      <audio
        ref={audioRef}
        autoPlay
        loop
        preload="auto"
        style={{ display: "none" }}
      >
        <source src="/Bésame (Cnt. 1_1).mp3" type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>

      {/* Global falling hearts - Fixed position covering entire viewport */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Continuous falling hearts - Layer 1 */}
        {fallingHearts.map((heart) => (
          <Heart
            key={heart.id}
            className={`absolute ${heart.color} animate-fall-continuous`}
            style={{
              left: `${heart.x}%`,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`,
              fontSize: `${heart.size}px`,
              opacity: heart.opacity,
            }}
            fill="currentColor"
          />
        ))}

        {/* Continuous falling hearts - Layer 2 */}
        {fallingHearts2.map((heart) => (
          <Heart
            key={heart.id}
            className={`absolute ${heart.color} animate-fall-continuous-slow`}
            style={{
              left: `${heart.x}%`,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`,
              fontSize: `${heart.size}px`,
              opacity: heart.opacity,
            }}
            fill="currentColor"
          />
        ))}
      </div>

      {/* Celebration hearts */}
      {celebrationHearts.map((heart) => (
        <Heart
          key={heart.id}
          className="fixed text-red-500 animate-celebration z-50 pointer-events-none"
          style={{
            left: heart.x,
            top: heart.y,
            animationDelay: `${Math.random() * 2}s`,
          }}
          size={32}
          fill="currentColor"
        />
      ))}

      {/* Initial section */}
      <section className="h-screen w-full flex flex-col items-center justify-center text-center px-4 relative z-10 snap-start">
        <div className="relative">
          <h1 className="text-6xl md:text-6xl font-extrabold text-pink-600 mb-8 animate-pulse">
            ¡Hola hermosa! 💕
          </h1>
        </div>
        <p className="text-xl md:text-2xl text-gray-700 mb-8">
          Tengo algo muy especial que decirte...
        </p>
        <div className="flex flex-col items-center animate-bounce">
          <ArrowDown className="text-pink-500 mb-2" size={32} />
          <p className="text-lg text-pink-600 font-semibold">
            Haz scroll hacia abajo 👇
          </p>
        </div>
      </section>

      {/* First heart section */}
      <section className="h-screen w-full flex items-center justify-center relative z-10 snap-start">
        <div className=" ">
          <div className="relative flex items-center justify-center">
            <Heart
              className="text-red-500 scale-150 opacity-100 animate-heartbeat-slow"
              size={200}
              fill="currentColor"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white font-bold text-xl md:text-2xl text-center px-4 animate-fade-in-slow drop-shadow-lg">
                Desde que te conocí...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Second heart section */}
      <section className="h-screen w-full flex items-center justify-center relative z-10 snap-start">
        <div>
          <div className="relative flex items-center justify-center">
            <Heart
              className="text-red-500 scale-200 opacity-100 animate-heartbeat-medium"
              size={250}
              fill="currentColor"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white font-bold text-xl md:text-2xl text-center px-4 animate-fade-in-slow drop-shadow-lg">
                Desde que comenzamos a hablar, no imaginé que llegaría a
                conocerte tan bien, ni que cada día podría sorprenderme más de
                ti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Third heart section */}
      <section className="h-screen w-full flex items-center justify-center relative z-10 snap-start">
        <div className="bg-gradient-to-br from-purple-50/90 to-pink-50/90 rounded-3xl p-8 md:p-12 shadow-2xl border border-purple-200/50">
          <div className="relative flex items-center justify-center">
            <Heart
              className="text-red-500 scale-300 opacity-100 animate-heartbeat-strong"
              size={300}
              fill="currentColor"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white font-bold text-xl md:text-2xl text-center px-4 animate-fade-in-slow drop-shadow-lg">
                Eres la persona
                <br />
                más especial
                <br />
                del mundo 🌟
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Love Letter section */}
      <section className="h-screen w-full flex items-center justify-center relative z-10 py-20 snap-start">
        <div
          className="max-w-4xl mx-4 bg-gradient-to-br from-pink-50/10 to-red-50/10 z-10 rounded-4xl shadow-2xl p-3 md:p-12 cursor-pointer transform hover:scale-105 transition-all duration-300 animate-fade-in-slow"
          onClick={handleLetterClick}
        >
          {/* Letter header */}
          <div className="text-center mb-2">
            <h2 className="text-3xl md:text-4xl font-bold text-pink-600 mb-4 animate-pulse">
              💕 Para la chica que me gusta 💕
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-pink-400 to-red-400 mx-auto rounded-full"></div>
          </div>

          {/* Letter content */}
          <div className="space-y-1 text-gray-700 leading-relaxed">
            <p className="text-lg md:text-xl font-medium text-center text-pink-600">
              Mi amor, mi vida, mi todo...
            </p>

           <div className="text-xs">
             <p className="text-base md:text-lg">
              No sé cómo empezar a expresar lo que siento. Desde que llegaste a
              mi vida, todo ha cambiado de una manera inesperada pero
              increíblemente positiva.
            </p>
            <p className="text-base md:text-lg">
              Tu manera de ver el mundo, tan única, me hace ver las cosas desde
              una perspectiva diferente. Cada vez que hablas, me doy cuenta de
              lo mucho que aprendo de ti, de lo genuino que es todo lo que dices
              y de cómo tus palabras tienen la capacidad de calmar cualquier
              momento de incertidumbre.
            </p>
            <p className="text-base md:text-lg">
              Lo que más me atrae de ti es tu forma de ser, cómo logras
              transmitir esa calma y alegría sin esfuerzo, cómo tu risa tiene un
              efecto contagioso en todo lo que te rodea.
            </p>
            <p className="text-base md:text-lg">
              A veces, solo escuchar tu manera de pensar me hace sentir que todo
              tiene más sentido, y lo más curioso es que haces que hasta los
              momentos más complicados se vuelvan más fáciles solo con tu
              presencia, aunque no siempre estemos en el mismo lugar.
            </p>
            <p className="text-base md:text-lg">
              Eres ese tipo de persona que, sin buscarlo, crea un espacio en el
              que te sientes cómodo, tranquilo y escuchado.
            </p>
            <p className="text-base md:text-lg">
              Me encanta descubrir cada día una nueva faceta de ti, y más aún
              darme cuenta de lo afortunado que me siento al tener la
              oportunidad de conocerte más.
            </p>
           </div>

            <p className="text-lg md:text-xl font-semibold text-center text-pink-600 mt-8">
              Por eso hoy, con todo mi corazón, te pregunto:
            </p>

            <p className="text-2xl md:text-3xl font-bold text-center text-red-600 animate-pulse">
              ¿Quieres estar conmigo?
            </p>

            <p className="text-sm md:text-base text-center text-gray-500 italic mt-6">
              💝 Haz clic en esta carta para responder 💝
            </p>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {/* <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-gradient-to-r from-pink-400 to-red-400 text-white border-none max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              ¡YESSS! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-white text-lg">
              <div className="space-y-4">
                <p className="text-xl font-semibold">
                  ¡Te amo con toda mi alma! 💕
                </p>
                <p>Eres la mejor decisión que he tomado en mi vida</p>
                <p>Gracias por hacerme el hombre más feliz del mundo</p>
                <div className="flex justify-center space-x-2 text-2xl">
                  💖 🌟 💖 🌟 💖
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog> */}

      {/* Final message section */}
      {showModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-pink-200 to-red-200 flex items-center justify-center z-[60] animate-fade-in-slow">
          <div className="text-center px-8 max-w-2xl">
            <div className="mb-8">
              <Heart
                className="text-red-600 mx-auto animate-heartbeat-strong"
                size={120}
                fill="currentColor"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-pulse drop-shadow-lg">
              ¡Te quiero mucho! 💕
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Gracias por hacerme el hombre más feliz del mundo. Eres mi todo,
              mi razón de ser, mi amor eterno.
            </p>
            <p className="text-lg text-white/80 italic">
              Este es solo el comienzo de nuestra hermosa historia de amor... 🌟
            </p>
            <div className="mt-8 flex justify-center space-x-4 text-4xl">
              💖 🌹 💖 🌹 💖
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
