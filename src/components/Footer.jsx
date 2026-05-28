const s = {
  footer: {
    padding: '24px 40px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    width: '100%',
  },
  text: { fontSize: '0.8rem', color: '#555d75', fontFamily: "'IBM Plex Sans', sans-serif" },
  link: { display: 'flex', alignItems: 'center', color: '#555d75', textDecoration: 'none', transition: 'color 0.2s' },
}

function IconGlobe() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
}

function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer style={s.footer}>
      <span style={s.text}>Web prototype by Elnathan Hung</span>
      <span style={{ ...s.text, opacity: 0.3 }}>·</span>
      <a
        href="https://elnathanhung.github.io/"
        target="_blank"
        rel="noopener noreferrer"
        style={s.link}
        title="Portfolio"
        onMouseEnter={e => e.currentTarget.style.color = '#9aa3b8'}
        onMouseLeave={e => e.currentTarget.style.color = '#555d75'}
      >
        <IconGlobe />
      </a>
      <a
        href="mailto:hung.chenen@gmail.com"
        style={s.link}
        title="Email"
        onMouseEnter={e => e.currentTarget.style.color = '#9aa3b8'}
        onMouseLeave={e => e.currentTarget.style.color = '#555d75'}
      >
        <IconMail />
      </a>
    </footer>
  )
}
