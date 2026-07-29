import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer.jsx'

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(160deg, #0d1321 0%, #1a2744 60%, #0d1321 100%)',
    fontFamily: "'IBM Plex Sans', sans-serif",
    color: '#e8eaf0',
  },
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 40px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(13,19,33,0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  navDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#4a6cf7',
  },
  navTitle: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#9aa3b8',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  navTag: {
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#4a6cf7',
    background: 'rgba(74,108,247,0.12)',
    border: '1px solid rgba(74,108,247,0.25)',
    borderRadius: '20px',
    padding: '3px 10px',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 24px',
    paddingTop: '120px',
    textAlign: 'center',
  },
  eyebrow: {
    fontSize: '0.78rem',
    fontWeight: '600',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#4a6cf7',
    marginBottom: '20px',
  },
  heading: {
    fontSize: 'clamp(2rem, 5vw, 3.25rem)',
    fontWeight: '700',
    lineHeight: '1.15',
    letterSpacing: '-0.02em',
    color: '#ffffff',
    maxWidth: '680px',
    marginBottom: '20px',
  },
  headingAccent: {
    background: 'linear-gradient(90deg, #4a6cf7, #7c9fff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtext: {
    fontSize: '1.05rem',
    lineHeight: '1.7',
    color: '#9aa3b8',
    maxWidth: '520px',
    marginBottom: '52px',
  },
  cards: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '680px',
  },
  card: {
    flex: '1 1 260px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '28px 24px',
    cursor: 'pointer',
    transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  cardIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
  },
  cardTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: '1.3',
  },
  cardDesc: {
    fontSize: '0.82rem',
    lineHeight: '1.6',
    color: '#9aa3b8',
    flex: 1,
  },
  cardCta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.82rem',
    fontWeight: '600',
    marginTop: '4px',
  },
}

function IconMarker() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  )
}

function IconNotes() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
    </svg>
  )
}

function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}


export default function Home() {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState(null)

  const cardHoverStyle = (id) => hoveredCard === id ? {
    background: 'rgba(255,255,255,0.07)',
    borderColor: 'rgba(74,108,247,0.4)',
    transform: 'translateY(-2px)',
  } : {}

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <div style={styles.navDot} />
          <span style={styles.navTitle}>Edu Vision Lab</span>
        </div>
        <span style={styles.navTag}>Browser Demo</span>
      </nav>

      <main style={styles.main}>
        <p style={styles.eyebrow}>Interactive Simulations For Educators</p>

        <h1 style={styles.heading}>
          Teaching{' '}
          <span style={styles.headingAccent}>How Computers See</span>
          <br />
          in Education
        </h1>

        <p style={styles.subtext}>
          Explore browser-based simulations that reveal how AI and Computer Vision interprets student work;
          from handwriting recognition to note-taking analysis, and what it can detect
          beyond the limits of human observation.
        </p>

        <div style={styles.cards}>
          <button
            style={{ ...styles.card, ...cardHoverStyle('automarker'), border: '1px solid ' + (hoveredCard === 'automarker' ? 'rgba(74,108,247,0.4)' : 'rgba(255,255,255,0.1)') }}
            onMouseEnter={() => setHoveredCard('automarker')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate('/automarker')}
          >
            <div style={{ ...styles.cardIcon, background: 'rgba(62,207,106,0.12)', color: '#3ecf6a' }}>
              <IconMarker />
            </div>
            <div style={styles.cardTitle}>AI Auto-marker</div>
            <div style={styles.cardDesc}>
              See how an AI marking system reads handwritten student essays.
              Explore how image quality, resolution, and training diversity affect
              its accuracy and confidence.
            </div>
            <div style={{ ...styles.cardCta, color: '#3ecf6a' }}>
              Launch simulation <IconArrow />
            </div>
          </button>

          <button
            style={{ ...styles.card, ...cardHoverStyle('notes'), border: '1px solid ' + (hoveredCard === 'notes' ? 'rgba(74,108,247,0.4)' : 'rgba(255,255,255,0.1)') }}
            onMouseEnter={() => setHoveredCard('notes')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate('/notes-interpreter')}
          >
            <div style={{ ...styles.cardIcon, background: 'rgba(91,79,207,0.15)', color: '#7c6fff' }}>
              <IconNotes />
            </div>
            <div style={styles.cardTitle}>AI Notes Interpreter</div>
            <div style={styles.cardDesc}>
              Discover how AI analyses a student's handwritten class notes.
              Detect gaps in attention, handwriting irregularities, and
              signs of engagement throughout the lesson.
            </div>
            <div style={{ ...styles.cardCta, color: '#7c6fff' }}>
              Launch simulation <IconArrow />
            </div>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
