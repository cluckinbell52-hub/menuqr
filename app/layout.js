import './globals.css'

export const metadata = {
  title: 'MenuQR',
  description: 'Food truck ordering system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}