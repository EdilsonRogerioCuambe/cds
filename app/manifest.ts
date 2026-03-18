import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Connect Digital School',
    short_name: 'CDS',
    description: 'Transforme seu futuro com o melhor do inglês digital.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A1A31',
    theme_color: '#10D79E',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
