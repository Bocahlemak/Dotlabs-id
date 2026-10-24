    export const dynamic = 'force-dynamic'
    export default function RootLayout({ children }) {
      return (
        <html lang="id">
          <body style={{margin:0}}>{children}</body>
        </html>
      )
    }
