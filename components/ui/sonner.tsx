'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-[#132747] group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:shadow-primary/20 group-[.toaster]:backdrop-blur-xl group-[.toaster]:rounded-2xl aria-[current=true]:bg-[#132747]',
          description: 'group-[.toast]:text-gray-300 font-medium',
          actionButton:
            'group-[.toast]:bg-[#10D79E] group-[.toast]:text-[#132747] font-bold rounded-xl',
          cancelButton:
            'group-[.toast]:bg-white/10 group-[.toast]:text-white group-[.toast]:hover:bg-white/20 rounded-xl',
          error: 'group-[.toaster]:border-red-500/50 group-[.toaster]:bg-red-950/90',
          success: 'group-[.toaster]:border-[#10D79E]/50 group-[.toaster]:bg-[#132747]/95',
          warning: 'group-[.toaster]:border-yellow-500/50 group-[.toaster]:bg-yellow-950/90',
          info: 'group-[.toaster]:border-blue-500/50 group-[.toaster]:bg-blue-950/90',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
