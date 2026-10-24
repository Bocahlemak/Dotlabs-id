'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [auctions, setAuctions] = useState([])
  useEffect(() => {
    supabase.from('auctions').select('*').then(({data}) => setAuctions(data))
  }, [])
  return (
    <div style={{padding:20, fontFamily:'sans-serif'}}>
      <h1>DotLabs.id - Auction</h1>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20}}>
        {auctions.map(a => (
          <Link key={a.id} href={`/auction/${a.id}`} style={{border:'1px solid #ddd', padding:10, textDecoration:'none', color:'black'}}>
            <img src={a.image_url} style={{width:'100%', height:200, objectFit:'cover'}} />
            <h3>{a.title}</h3>
            <p>Current: Rp {a.current_bid.toLocaleString()}</p>
            <p style={{color:'red'}}>Ends: {new Date(a.end_time).toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
