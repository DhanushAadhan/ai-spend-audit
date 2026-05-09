'use client'

import Link from 'next/link'
import { ArrowRight, Zap, TrendingDown, Shield, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <main style={{background:'#09090b',minHeight:'100vh',fontFamily:'system-ui,sans-serif',color:'#fafafa'}}>

      {/* NAV */}
      <nav style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 32px',maxWidth:'1100px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'32px',height:'32px',background:'#6366f1',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Zap size={16} color="white" fill="white" />
          </div>
          <span style={{fontWeight:700,fontSize:'1.1rem'}}>AuditAI</span>
        </div>
        <Link href="/audit" style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 18px',borderRadius:'10px',background:'rgba(99,102,241,0.15)',color:'#818cf8',border:'1px solid rgba(99,102,241,0.3)',textDecoration:'none',fontSize:'0.875rem',fontWeight:500}}>
          Start audit <ArrowRight size={14} />
        </Link>
      </nav>

      {/* HERO */}
      <section style={{textAlign:'center',padding:'80px 24px',maxWidth:'900px',margin:'0 auto'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'6px 16px',borderRadius:'999px',background:'rgba(34,197,94,0.1)',color:'#22c55e',border:'1px solid rgba(34,197,94,0.2)',fontSize:'0.75rem',marginBottom:'32px'}}>
          <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#22c55e',display:'inline-block'}}/>
          Free forever · No login required
        </div>

        <h1 style={{fontSize:'clamp(2.5rem,6vw,4.5rem)',fontWeight:800,lineHeight:1.1,letterSpacing:'-0.03em',marginBottom:'24px'}}>
          Your team is wasting<br/>
          <span style={{color:'#818cf8'}}>money on AI tools</span>
        </h1>

        <p style={{fontSize:'1.1rem',color:'#a1a1aa',maxWidth:'600px',margin:'0 auto 40px',lineHeight:1.7}}>
          AuditAI analyzes your AI subscriptions — Cursor, Claude, Copilot, ChatGPT and more — and tells you exactly where to cut, switch, or optimize.{' '}
          <strong style={{color:'#fafafa'}}>Takes 2 minutes.</strong>
        </p>

        <Link href="/audit" style={{display:'inline-flex',alignItems:'center',gap:'12px',padding:'16px 32px',borderRadius:'14px',background:'#6366f1',color:'white',textDecoration:'none',fontWeight:600,fontSize:'1rem',boxShadow:'0 0 40px rgba(99,102,241,0.35)'}}>
          Audit my AI spend <ArrowRight size={18} />
        </Link>
        <p style={{marginTop:'16px',color:'#52525b',fontSize:'0.875rem'}}>No signup · No credit card</p>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'32px',marginTop:'64px',paddingTop:'40px',borderTop:'1px solid #27272a',maxWidth:'480px',margin:'64px auto 0'}}>
          {[{value:'$3,200',label:'avg annual savings'},{value:'8',label:'AI tools analyzed'},{value:'2 min',label:'to complete audit'}].map(s=>(
            <div key={s.label} style={{textAlign:'center'}}>
              <div style={{fontSize:'2rem',fontWeight:700,marginBottom:'4px'}}>{s.value}</div>
              <div style={{fontSize:'0.75rem',color:'#52525b'}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{maxWidth:'1100px',margin:'0 auto',padding:'60px 24px'}}>
        <h2 style={{fontSize:'2rem',fontWeight:700,textAlign:'center',marginBottom:'12px'}}>How it works</h2>
        <p style={{color:'#a1a1aa',textAlign:'center',marginBottom:'48px'}}>Three steps to a smarter AI stack</p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'20px'}}>
          {[
            {step:'01',icon:<Users size={20}/>,title:'Enter your tools',desc:'Tell us which AI tools your team pays for, which plan, monthly spend, and how many seats.'},
            {step:'02',icon:<TrendingDown size={20}/>,title:'Get your audit',desc:'Our engine calculates exact savings opportunities per tool using verified pricing data.'},
            {step:'03',icon:<Shield size={20}/>,title:'Share the results',desc:'Get a unique shareable link to send to your team, manager, or co-founder.'},
          ].map(item=>(
            <div key={item.step} style={{padding:'28px',borderRadius:'16px',background:'#111113',border:'1px solid #27272a'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}}>
                <span style={{fontSize:'0.75rem',fontWeight:700,color:'#52525b'}}>{item.step}</span>
                <div style={{padding:'8px',borderRadius:'8px',background:'rgba(99,102,241,0.12)',color:'#818cf8'}}>{item.icon}</div>
              </div>
              <h3 style={{fontSize:'1.1rem',fontWeight:600,marginBottom:'8px'}}>{item.title}</h3>
              <p style={{fontSize:'0.9rem',color:'#a1a1aa',lineHeight:1.6}}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{textAlign:'center',padding:'80px 24px',borderTop:'1px solid #27272a'}}>
        <h2 style={{fontSize:'2.5rem',fontWeight:700,marginBottom:'16px'}}>Stop guessing. Start saving.</h2>
        <p style={{color:'#a1a1aa',marginBottom:'32px'}}>Your audit takes 2 minutes and costs nothing.</p>
        <Link href="/audit" style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'14px 28px',borderRadius:'12px',background:'#6366f1',color:'white',textDecoration:'none',fontWeight:600}}>
          Run my free audit <ArrowRight size={16} />
        </Link>
        <p style={{marginTop:'32px',fontSize:'0.75rem',color:'#52525b'}}>AuditAI · Built for Credex · 2026</p>
      </section>

    </main>
  )
}