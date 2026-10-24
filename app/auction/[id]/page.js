'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

export default function Detail({ params }) {
  const [auction, setAuction] = useState(null)
  const [bids, setBids] = useState([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    supabase.from('auctions').select('*').eq('id', params.id).single().then(({data}) => setAuction(data))
    supabase.from('bids').select('*').eq('auction_id', params.id).order('created_at', {ascending:false}).then(({data}) => setBids(data||[]))
  }, [])

  const placeBid = async () => {
    if (!name || !amount) return alert('Isi nama & bid')
    const { error } = await supabase.from('bids').insert({ auction_id: params.id, bidder_name: name, amount: parseInt(amount) })
    if (error) return alert(error.message)
    await supabase.from('auctions').update({ current_bid: amount }).eq('id', params.id)
    alert('Bid berhasil! Kalau menang, transfer ke BCA 1234567890 a/n DotLabs.id')
    location.reload()
  }

  if (!auction) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="bg-white/5 rounded-[24px] p-4 border border-white/10">
          <img src={auction.image_url} className="w-full h-[400px] object-cover rounded-[16px]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{auction.title}</h1>
          <h2 className="text-4xl font-black mt-4">{Number(auction.current_bid).toLocaleString('id-ID', {style:'currency', currency:'IDR'})}</h2>
          
          <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="font-bold mb-3">Place Bid</h3>
            <input placeholder="Nama Kamu" value={name} onChange={e=>setName(e.target.value)} className="w-full p-3 rounded-full bg-white/10 border border-white/10 mb-3 outline-none" />
            <input placeholder={`Min Rp ${(auction.current_bid+10000).toLocaleString()}`} value={amount} onChange={e=>setAmount(e.target.value)} type="number" className="w-full p-3 rounded-full bg-white/10 border border-white/10 mb-3 outline-none" />
            <button onClick={placeBid} className="w-full py-3 bg-white text-black rounded-full font-bold">BID SEKARANG</button>
            <p className="text-xs text-white/40 mt-3 text-center">Jika menang, transfer manual ke<br/>BCA 1234567890 a/n DotLabs.id<br/>BRI 987654321 a/n DotLabs.id<br/>Lalu WA bukti ke 0812-xxxx-x</p>
          </div>

          <h3 className="mt-8 font-bold">Bid History ({bids.length})</h3>
          <div className="mt-3 space-y-2">
            {bids.map(b => (
              <div key={b.id} className="flex justify-between p-3 bg-white/5 rounded-full text-sm border border-white/5">
                <span><b>{b.bidder_name}</b> - Rp {b.amount.toLocaleString()}</span>
                <span className="text-white/40">{new Date(b.created_at).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
