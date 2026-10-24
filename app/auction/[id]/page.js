'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function Detail({ params }) {
  const [auction, setAuction] = useState(null)
  const [bids, setBids] = useState([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    supabase.from('auctions').select('*').eq('id', params.id).single().then(({data}) => setAuction(data))
    supabase.from('bids').select('*').eq('auction_id', params.id).order('created_at', {ascending:false}).then(({data}) => setBids(data))
  }, [])

  const placeBid = async () => {
    if (!name || !amount) return alert('Isi nama & bid')
    const { error } = await supabase.from('bids').insert({ auction_id: params.id, bidder_name: name, amount: parseInt(amount) })
    if (!error) {
      await supabase.from('auctions').update({ current_bid: amount }).eq('id', params.id)
      alert('Bid berhasil! Kalau menang, transfer ke: BCA 1234567890 a/n DotLabs.id')
      location.reload()
    }
  }

  if (!auction) return <p>Loading...</p>
  return (
    <div style={{padding:20, maxWidth:600, margin:'auto'}}>
      <h1>{auction.title}</h1>
      <img src={auction.image_url} style={{width:'100%'}} />
      <h2>Rp {auction.current_bid.toLocaleString()}</h2>
      
      <div style={{border:'1px solid #000', padding:15, margin:'20px 0'}}>
        <h3>Place Bid</h3>
        <input placeholder="Nama Kamu" value={name} onChange={e=>setName(e.target.value)} style={{width:'100%', padding:8, marginBottom:10}} />
        <input placeholder={`Min Rp ${auction.current_bid+10000}`} value={amount} onChange={e=>setAmount(e.target.value)} type="number" style={{width:'100%', padding:8}} />
        <button onClick={placeBid} style={{width:'100%', padding:10, background:'blue', color:'white', marginTop:10}}>BID SEKARANG</button>
        <p style={{fontSize:12, marginTop:10}}>Jika menang, transfer manual ke:<br/><b>BCA 1234567890 a/n DotLabs.id<br/>BRI 987654321 a/n DotLabs.id</b><br/>Lalu WA bukti ke 0812-xxxx</p>
      </div>

      <h3>Bid History</h3>
      {bids.map(b => <div key={b.id} style={{borderBottom:'1px solid #eee', padding:5}}><b>{b.bidder_name}</b> - Rp {b.amount.toLocaleString()} - {new Date(b.created_at).toLocaleString()}</div>)}
    </div>
  )
}
