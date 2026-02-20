'use client'

import { LottieComponentProps } from 'lottie-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false }) as React.ComponentType<LottieComponentProps>;

// Brand Colors
// Navy: #132747 (Main Text)
// Turquoise: #10D79E (Accent - only for 'o' and specific highlights)
// White: #FFFFFF (Background)

const premiumAnimation = {
  "v": "5.7.4",
  "fr": 60,
  "ip": 0,
  "op": 180,
  "w": 500,
  "h": 500,
  "nm": "Connect Digital School Premium",
  "ddd": 0,
  "assets": [],
  "layers": [
    // Outer glow ring - Navy
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Glow Ring",
      "sr": 1,
      "ks": {
        "o": {
          "a": 1,
          "k": [
             { "t": 0, "s": [0] },
             { "t": 30, "s": [20] },
             { "t": 150, "s": [20] },
             { "t": 180, "s": [0] }
          ]
        },
        "r": {
          "a": 1,
          "k": [
            { "t": 0, "s": [0] },
            { "t": 180, "s": [360] }
          ]
        },
        "p": { "a": 0, "k": [250, 250, 0] },
        "s": {
          "a": 1,
          "k": [
            { "t": 0, "s": [0, 0, 100] },
            { "t": 30, "s": [110, 110, 100] },
            { "t": 150, "s": [110, 110, 100] },
            { "t": 180, "s": [0, 0, 100] }
          ]
        }
      },
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "el",
              "s": { "a": 0, "k": [200, 200] },
              "p": { "a": 0, "k": [0, 0] }
            },
            {
              "ty": "st",
              "c": { "a": 0, "k": [0.075, 0.153, 0.278, 1] }, // Navy #132747
              "o": { "a": 0, "k": 100 },
              "w": { "a": 0, "k": 2 },
              "lc": 2
            },
            {
              "ty": "tr",
              "o": { "a": 0, "k": 100 }
            }
          ]
        }
      ]
    },
    // Main rotating circle - Navy
    {
      "ddd": 0,
      "ind": 2,
      "ty": 4,
      "nm": "Main Circle",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100 },
        "r": {
          "a": 1,
          "k": [
            { "t": 0, "s": [0] },
            { "t": 180, "s": [720] }
          ]
        },
        "p": { "a": 0, "k": [250, 250, 0] },
        "s": {
          "a": 1,
          "k": [
            { "t": 0, "s": [0, 0, 100] },
            { "t": 20, "s": [100, 100, 100] },
            { "t": 160, "s": [100, 100, 100] },
            { "t": 180, "s": [0, 0, 100] }
          ]
        }
      },
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "el",
              "s": { "a": 0, "k": [160, 160] }
            },
            {
              "ty": "st",
              "c": {
                "a": 1,
                "k": [
                    { "t": 0, "s": [0.075, 0.153, 0.278, 1] }, // Navy
                    { "t": 60, "s": [0.063, 0.843, 0.620, 1] }, // Turquoise Accents
                    { "t": 120, "s": [0.075, 0.153, 0.278, 1] }, // Navy
                    { "t": 180, "s": [0.075, 0.153, 0.278, 1] }
                ]
              },
              "o": { "a": 0, "k": 100 },
              "w": { "a": 0, "k": 8 },
              "lc": 2
            },
            {
              "ty": "tr",
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        {
          "ty": "tm",
          "s": { "a": 0, "k": 0 },
          "e": {
            "a": 1,
            "k": [
              { "t": 0, "s": [0] },
              { "t": 40, "s": [100] },
              { "t": 140, "s": [100] },
              { "t": 180, "s": [0] }
            ]
          },
          "o": { "a": 0, "k": 0 },
          "m": 1
        }
      ]
    },
    // Particle effect - Navy & Turquoise
    {
      "ddd": 0,
      "ind": 3,
      "ty": 4,
      "nm": "Particles",
      "sr": 1,
      "ks": {
        "o": {
          "a": 1,
          "k": [
            { "t": 30, "s": [0] },
            { "t": 50, "s": [100] },
            { "t": 130, "s": [100] },
            { "t": 150, "s": [0] }
          ]
        },
        "r": {
          "a": 1,
          "k": [
            { "t": 0, "s": [0] },
            { "t": 180, "s": [-180] }
          ]
        },
        "p": { "a": 0, "k": [250, 250, 0] }
      },
      "shapes": [
        // Multiple particle dots
        ...Array.from({ length: 8 }, (_, i) => ({
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "s": { "a": 0, "k": [8, 8] },
              "p": {
                "a": 1,
                "k": [
                  {
                    "t": 0,
                    "s": [0, -80],
                    "e": [0, -100]
                  },
                  { "t": 180, "s": [0, -80] }
                ]
              }
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": i % 3 === 0 ? [0.063, 0.843, 0.620, 1] : [0.075, 0.153, 0.278, 1] }, // Mostly Navy, some Turquoise
              "o": {
                "a": 1,
                "k": [
                  { "t": 0, "s": [0] },
                  { "t": 30, "s": [100] },
                  { "t": 150, "s": [100] },
                  { "t": 180, "s": [0] }
                ]
              }
            },
            {
              "ty": "tr",
              "r": { "a": 0, "k": i * 45 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        }))
      ]
    },
    // Center logo/icon
    {
      "ddd": 0,
      "ind": 4,
      "ty": 4,
      "nm": "Center Icon",
      "sr": 1,
      "ks": {
        "o": {
          "a": 1,
          "k": [
            { "t": 20, "s": [0] },
            { "t": 40, "s": [100] },
            { "t": 140, "s": [100] },
            { "t": 160, "s": [0] }
          ]
        },
        "p": { "a": 0, "k": [250, 250, 0] },
        "s": {
          "a": 1,
          "k": [
            { "t": 20, "s": [0, 0, 100] },
            { "t": 40, "s": [110, 110, 100] },
            { "t": 50, "s": [100, 100, 100] },
            { "t": 130, "s": [100, 100, 100] },
            { "t": 140, "s": [110, 110, 100] },
            { "t": 160, "s": [0, 0, 100] }
          ]
        }
      },
      "shapes": [
        // Graduation cap - Navy
        {
          "ty": "gr",
          "it": [
            {
              "ty": "sh",
              "ks": {
                "a": 0,
                "k": {
                  "i": [[0, 0], [0, 0], [0, 0], [0, 0]],
                  "o": [[0, 0], [0, 0], [0, 0], [0, 0]],
                  "v": [[0, -30], [40, -20], [0, -10], [-40, -20]],
                  "c": true
                }
              }
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [0.075, 0.153, 0.278, 1] }, // Navy
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        // Cap base
        {
          "ty": "gr",
          "it": [
            {
              "ty": "rc",
              "s": { "a": 0, "k": [60, 8] },
              "p": { "a": 0, "k": [0, -5] },
              "r": { "a": 0, "k": 2 }
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [0.075, 0.153, 0.278, 1] }, // Navy
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        // Tassel - Turquoise
        {
          "ty": "gr",
          "it": [
            {
              "ty": "sh",
              "ks": {
                "a": 0,
                "k": {
                  "i": [[0, 0], [0, 0]],
                  "o": [[0, 0], [0, 0]],
                  "v": [[30, -20], [30, 10]],
                  "c": false
                }
              }
            },
            {
              "ty": "st",
              "c": { "a": 0, "k": [0.063, 0.843, 0.620, 1] }, // Turquoise
              "w": { "a": 0, "k": 3 },
              "lc": 2
            },
            {
              "ty": "tr",
              "o": { "a": 0, "k": 100 }
            }
          ]
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "s": { "a": 0, "k": [10, 10] },
              "p": { "a": 0, "k": [30, 15] }
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [0.063, 0.843, 0.620, 1] }, // Turquoise
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "o": { "a": 0, "k": 100 }
            }
          ]
        }
      ]
    },
    // Pulsing background - Faint Navy
    {
      "ddd": 0,
      "ind": 5,
      "ty": 4,
      "nm": "Pulse",
      "sr": 1,
      "ks": {
        "o": {
          "a": 1,
          "k": [
            { "t": 0, "s": [0] },
            { "t": 30, "s": [10] },
            { "t": 60, "s": [0] },
            { "t": 90, "s": [10] },
            { "t": 120, "s": [0] },
            { "t": 150, "s": [10] },
            { "t": 180, "s": [0] }
          ]
        },
        "p": { "a": 0, "k": [250, 250, 0] },
        "s": {
          "a": 1,
          "k": [
            { "t": 0, "s": [80, 80, 100] },
            { "t": 30, "s": [120, 120, 100] },
            { "t": 60, "s": [80, 80, 100] },
            { "t": 90, "s": [120, 120, 100] },
            { "t": 120, "s": [80, 80, 100] },
            { "t": 150, "s": [120, 120, 100] },
            { "t": 180, "s": [80, 80, 100] }
          ]
        }
      },
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "s": { "a": 0, "k": [180, 180] }
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [0.075, 0.153, 0.278, 1] }, // Navy
              "o": { "a": 0, "k": 100 }
            },
            {
              "ty": "tr",
              "o": { "a": 0, "k": 100 }
            }
          ]
        }
      ]
    }
  ]
}

interface PremiumSplashScreenProps {
  onComplete?: () => void
  minDuration?: number
  showProgress?: boolean
  brandColor?: string
  loadingText?: string
}

export default function PremiumSplashScreen({
  onComplete,
  minDuration = 3000,
  showProgress = true,
  brandColor = "bg-white", // Background White
  loadingText: loadingTextProp
}: PremiumSplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [internalLoadingText, setInternalLoadingText] = useState(loadingTextProp || "Inicializando...")

  const loadingTexts = [
    "Inicializando...",
    "Carregando recursos...",
    "Preparando sua jornada...",
    "Quase lá..."
  ]

  useEffect(() => {
    if (loadingTextProp) {
        setInternalLoadingText(loadingTextProp)
        return
    }

    // Simular progresso
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 10, 100)

        // Atualizar texto baseado no progresso
        if (newProgress < 25) setInternalLoadingText(loadingTexts[0])
        else if (newProgress < 50) setInternalLoadingText(loadingTexts[1])
        else if (newProgress < 75) setInternalLoadingText(loadingTexts[2])
        else setInternalLoadingText(loadingTexts[3])

        return newProgress
      })
    }, 150)

    // Timer mínimo
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onComplete?.()
      }, 600)
    }, minDuration)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [minDuration, onComplete])

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-all duration-600 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      {/* Background - White */}
      <div className={`absolute inset-0 ${brandColor}`}>
         {/* Subtle radial sheen */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(19,39,71,0.03),_transparent_70%)]" />
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(#132747 1px, transparent 1px),
              linear-gradient(90deg, #132747 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4">
        {/* Lottie Animation */}
        <div className="relative w-80 h-80 md:w-96 md:h-96 mb-8">
          <Lottie
            {...{ animationData: premiumAnimation, loop: true, autoplay: true }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Brand */}
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-5xl md:text-6xl font-black text-[#132747] tracking-tight">
            C<span className="text-[#10D79E]">o</span>nnect
            <span className="block text-2xl md:text-3xl font-bold tracking-widest uppercase mt-2">
              Digital School
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[#132747]/60 font-medium">
            Inglês Sem Limites
          </p>
        </div>

        {/* Progress section */}
        {showProgress && (
          <div className="w-full max-w-md space-y-4">
            {/* Progress bar */}
            <div className="relative h-2 bg-[#132747]/10 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-[#132747] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer" />
              </div>
            </div>

            {/* Loading text */}
            <div className="flex items-center justify-center space-x-2">
               <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-[#132747] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-[#132747] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-[#132747] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-[#132747]/80 text-sm font-medium tracking-wide">
                {internalLoadingText}
              </p>
            </div>

            {/* Percentage */}
            <p className="text-center text-[#132747]/40 text-xs font-mono">
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
