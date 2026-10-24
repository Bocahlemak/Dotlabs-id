'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [auctions, setAuctions] = useState([])

  useEffect(() => {
    supabase.from('auctions').select('*').order('created_at', {ascending:false}).then(({data}) => setAuctions(data||[]))
  }, [])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 bg-[#0a0a0a]/80 backdrop-blur z-10">
        <h1 className="text-2xl font-black tracking-tighter">DotLabs<span className="text-white/40">.id</span></h1>
        <button className="px-4 py-2 text-sm bg-white text-black rounded-full font-bold">Live • {auctions.length} Lelang</button>
      </nav>

      <div className="px-6 py-12 max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold leading-tight">Lelang Terpercaya<br/><span className="text-white/40">No.1 di Indonesia.</span></h2>
        <p className="text-white/60 mt-4">Bid real-time, transparan, langsung dari Supabase lu.</p>
      </div>

      <div className="px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
        {auctions.length === 0 && <p className="text-white/40">Belum ada lelang. Tambah di Supabase > auctions</p>}
        {auctions.map((item) => (
          <Link key={item.id} href={`/auction/${item.id}`} className="bg-white/[0.05] border border-white/10 rounded-[24px] p-5 hover:bg-white/[0.08] transition block">
            <div className="h-48 bg-white/[0.05] rounded-[16px] flex items-center justify-center overflow-hidden">
              <img src={item.image_url} className="w-full h-full object-cover" />
            </div>
            <div className="mt-4">
              <h3 className="font-semibold leading-tight">{item.title}</h3>
              <p className="text-2xl font-bold mt-3">Rp {Number(item.current_bid).toLocaleString('id-ID')}</p>
              <p className="text-xs text-white/40 mt-1">{item.status || 'live'} • klik untuk bid</p>
              <div className="w-full mt-4 py-3 bg-white text-black rounded-full font-bold text-center">Lihat Detail</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
