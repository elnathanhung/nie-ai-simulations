import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import notesImg from '../assets/notes-handwriting.jpg'
import Footer from '../components/Footer.jsx'

const SUMMARIES = {
  both: "The student's notes cover key Cold War content adequately, but two concerns were flagged. Handwriting became notably rushed in the final third of the page, suggesting possible anxiety or difficulty keeping pace. Additionally, a gap in note density was detected around the Effects section, indicating the student may have missed or disengaged during that portion of the lesson. Attentiveness appears moderate.",
  handwritingOnly: "Note coverage is structured and mostly complete. However, handwriting irregularity was detected toward the bottom of the page — rushed strokes and inconsistent spacing may reflect time pressure or emotional stress during this part of the lesson. Recommend checking in with this student.",
  gapsOnly: "Handwriting is generally legible and consistent throughout. A gap in recorded content was identified in the middle of the notes, which may point to a missed explanation or a brief lapse in focus. Consider revisiting that section of the lesson with this student.",
  neither: "Notes appear well-structured with consistent handwriting and complete coverage across all five sections. No significant attentiveness or emotional concerns detected. The student appears to have engaged with the lesson effectively.",
}

const ANNOTATIONS = [
  { id: 'pos1',        left: '28%', top: '10%', positive: true,  text: 'Clear section heading detected with underline emphasis. Student demonstrates organised note structure from the start of the lesson.' },
  { id: 'pos2',        left: '60%', top: '22%', positive: true,  text: 'Consistent use of bullet points and parallel phrasing suggests the student is actively processing and condensing information rather than transcribing passively.' },
  { id: 'pos3',        left: '14%', top: '34%', positive: true,  text: 'Timestamps noted alongside content, indicating a high level of attentiveness and awareness of lesson pacing throughout this section.' },
  { id: 'handwriting', left: '22%', top: '78%', positive: false, text: 'Handwriting appears rushed and irregular in this section, which may indicate anxiety, fatigue, or difficulty keeping pace with the lesson.' },
  { id: 'gap',         left: '52%', top: '48%', positive: false, text: 'A notable drop in note density was detected here, suggesting the student may have lost track or struggled to follow this portion of the lesson.' },
  { id: 'incomplete',  left: '38%', top: '88%', positive: false, text: 'An incomplete or trailing sentence was detected — the student may have been unable to finish recording this thought before the lesson moved on.' },
]

export default function NotesInterpreter() {
  const navigate = useNavigate()
  const [chkHandwriting, setChkHandwriting] = useState(true)
  const [chkIncomplete, setChkIncomplete]   = useState(true)
  const [chkGaps, setChkGaps]               = useState(true)
  const [visibleAnns, setVisibleAnns]       = useState([])
  const [summaryText, setSummaryText]       = useState('Generate Analysis to get a summary of the student notes.')
  const [overlayActive, setOverlayActive]   = useState(false)
  const [spinning, setSpinning]             = useState(false)
  const [generating, setGenerating]         = useState(false)
  const [summaryFading, setSummaryFading]   = useState(false)
  const [lightboxOpen, setLightboxOpen]     = useState(false)
  const [openBubble, setOpenBubble]         = useState(null)

  const handleGenerate = () => {
    setVisibleAnns([])
    setSummaryFading(true)
    setSummaryText('')
    setOverlayActive(true)
    setSpinning(true)
    setGenerating(true)

    setTimeout(() => {
      setSpinning(false)

      const shown = ['pos1', 'pos2', 'pos3']
      if (chkHandwriting) shown.push('handwriting')
      if (chkGaps)        shown.push('gap')
      if (chkIncomplete)  shown.push('incomplete')
      setVisibleAnns(shown)

      let key
      if (chkHandwriting && chkGaps)  key = 'both'
      else if (chkHandwriting)         key = 'handwritingOnly'
      else if (chkGaps)                key = 'gapsOnly'
      else                             key = 'neither'

      setSummaryText(SUMMARIES[key])
      setSummaryFading(false)
      setGenerating(false)
    }, 1200)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
        .ni-page { font-family:'IBM Plex Sans',sans-serif; background:linear-gradient(160deg,#0d1321 0%,#1a2744 60%,#0d1321 100%); min-height:100vh; display:flex; flex-direction:column; align-items:center; padding-top:48px; }
        .ni-back { position:fixed; top:0; left:0; right:0; z-index:100; display:flex; align-items:center; width:100%; padding:14px 20px; background:rgba(26,39,68,0.9); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); color:#9aa3b8; font-size:0.8rem; font-weight:600; border:none; cursor:pointer; letter-spacing:0.04em; text-transform:uppercase; transition:color 0.2s; text-align:left; justify-content:center; }
        .ni-back-inner { display:flex; align-items:center; justify-content:space-between; width:100%; max-width:720px; }
        .ni-back:hover { color:#fff; }
        .ni-tag { font-size:0.75rem; font-weight:500; color:#4a6cf7; background:rgba(74,108,247,0.12); border:1px solid rgba(74,108,247,0.25); border-radius:20px; padding:3px 10px; text-transform:none; letter-spacing:0; flex-shrink:0; }
        .ni-frame { width:100%; max-width:720px; display:flex; flex-direction:column; background:#f4f5f8; }
        .ni-header { background:linear-gradient(135deg,#1a2744 0%,#2a3f7e 100%); padding:28px 32px 24px; position:relative; z-index:10; }
        .ni-header h1 { font-size:1.75rem; font-weight:700; color:#fff; letter-spacing:-0.01em; }
        .ni-notes-wrap { position:relative; background:#d8d8d8; overflow:visible; min-height:420px; display:flex; align-items:center; justify-content:center; z-index:20; }
        .ni-notes-img { width:100%; height:auto; display:block; max-height:540px; object-fit:contain; }
        .ni-overlay { display:none; position:absolute; inset:0; background:rgba(26,39,68,0.35); pointer-events:none; }
        .ni-overlay.active { display:block; }
        .ni-spinner-wrap { display:none; position:absolute; inset:0; align-items:center; justify-content:center; pointer-events:none; }
        .ni-spinner-wrap.active { display:flex; }
        .ni-spinner { width:44px; height:44px; border:4px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:ni-spin 0.8s linear infinite; }
        @keyframes ni-spin { to { transform:rotate(360deg); } }
        .ni-expand-btn { background:rgba(255,255,255,0.15); border:none; border-radius:6px; padding:7px 8px; cursor:pointer; color:#fff; display:flex; align-items:center; justify-content:center; transition:background 0.2s; z-index:5; }
        .ni-expand-btn:hover { background:rgba(255,255,255,0.3); }
        .ni-annotation { display:none; position:absolute; z-index:50; }
        .ni-annotation.visible { display:block; }
        .ni-ann-icon { width:26px; height:26px; border-radius:50%; background:#e05252; border:2px solid white; color:white; font-size:0.8rem; font-weight:700; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.25); animation:ni-popIn 0.3s ease; }
        .ni-ann-icon.green { background:#2ebd6b; }
        @keyframes ni-popIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        .ni-ann-bubble { display:none; position:absolute; bottom:calc(100% + 10px); left:50%; transform:translateX(-50%); background:white; color:#1a2744; font-size:0.75rem; line-height:1.55; padding:10px 13px; border-radius:8px; width:220px; box-shadow:0 4px 18px rgba(0,0,0,0.15); text-align:center; pointer-events:none; z-index:60; white-space:normal; }
        .ni-ann-bubble::after { content:''; position:absolute; top:100%; left:50%; transform:translateX(-50%); border:6px solid transparent; border-top-color:white; }
        .ni-annotation.bubble-open .ni-ann-bubble { display:block; }
        .ni-bottom-row { display:grid; grid-template-columns:1fr 1fr; border-top:1px solid #dde1ec; }
        .ni-checks-col { padding:26px 24px 28px; display:flex; flex-direction:column; gap:18px; border-right:1px solid #dde1ec; }
        .ni-check-item { display:flex; align-items:center; gap:12px; cursor:pointer; user-select:none; }
        .ni-check-input { -webkit-appearance:none; appearance:none; width:20px; height:20px; border-radius:5px; border:2px solid #dde1ec; background:white; cursor:pointer; flex-shrink:0; position:relative; transition:background 0.15s,border-color 0.15s; }
        .ni-check-input:checked { background:#5b4fcf; border-color:#5b4fcf; }
        .ni-check-input:checked::after { content:''; position:absolute; width:5px; height:9px; border:2px solid white; border-top:none; border-left:none; transform:rotate(45deg) translate(-1px,-1px); left:5px; top:2px; }
        .ni-check-label { font-size:0.875rem; font-weight:500; color:#1a2744; cursor:pointer; }
        .ni-gen-btn { margin-top:6px; background:#1a2744; color:white; border:none; border-radius:8px; padding:13px 0; font-family:'IBM Plex Sans',sans-serif; font-size:0.9rem; font-weight:700; cursor:pointer; width:100%; transition:background 0.2s,transform 0.1s; letter-spacing:0.01em; }
        .ni-gen-btn:hover { background:#2a3f7e; }
        .ni-gen-btn:active { transform:scale(0.98); }
        .ni-gen-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .ni-summary-col { padding:26px 24px 28px; display:flex; flex-direction:column; gap:12px; }
        .ni-summary-col h2 { font-size:0.9rem; font-weight:700; color:#1a2744; }
        .ni-summary-body { font-size:0.82rem; line-height:1.7; color:#6b7694; transition:opacity 0.3s; }
        .ni-summary-body.loading { opacity:0.3; }
        .ni-lightbox { display:none; position:fixed; inset:0; background:rgba(10,15,30,0.88); z-index:100; align-items:center; justify-content:center; padding:24px; }
        .ni-lightbox.open { display:flex; }
        .ni-lb-inner { position:relative; display:inline-block; }
        .ni-lb-inner img { max-width:100%; max-height:85vh; border-radius:4px; box-shadow:0 8px 40px rgba(0,0,0,0.5); }
        .ni-lb-close { position:fixed; top:20px; right:24px; background:rgba(255,255,255,0.12); border:none; border-radius:6px; color:white; font-size:1.4rem; line-height:1; padding:6px 11px; cursor:pointer; transition:background 0.2s; z-index:101; }
        .ni-lb-close:hover { background:rgba(255,255,255,0.25); }
        .ni-carousel-row { display:flex; align-items:center; justify-content:center; gap:24px; padding:14px 24px; border-bottom:1px solid #dde1ec; }
        .ni-carousel-btn { background:none; border:none; font-size:1.5rem; color:#9aa3b8; cursor:pointer; padding:4px 12px; border-radius:4px; }
        .ni-carousel-btn:hover { background:rgba(0,0,0,0.05); }
      `}</style>

      <div className="ni-page">
        <button className="ni-back" onClick={() => navigate('/')}>
          <div className="ni-back-inner">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Back to Home
            </span>
            <span className="ni-tag">Browser Demo</span>
          </div>
        </button>

        <div className="ni-frame">
          <header className="ni-header">
            <h1>AI Note-taking Interpreter</h1>
          </header>

          <div className="ni-notes-wrap">
            <img
              className="ni-notes-img"
              src={notesImg}
              alt="Student handwritten notes — The Cold War"
            />

            <div className={`ni-overlay${overlayActive ? ' active' : ''}`} />

            <div className={`ni-spinner-wrap${spinning ? ' active' : ''}`}>
              <div className="ni-spinner" />
            </div>

            {ANNOTATIONS.map(ann => (
              <div
                key={ann.id}
                className={`ni-annotation${visibleAnns.includes(ann.id) ? ' visible' : ''}${openBubble === ann.id ? ' bubble-open' : ''}`}
                style={{ left: ann.left, top: ann.top }}
                onClick={() => setOpenBubble(openBubble === ann.id ? null : ann.id)}
              >
                <div className={`ni-ann-icon${ann.positive ? ' green' : ''}`}>+</div>
                <div className="ni-ann-bubble">{ann.text}</div>
              </div>
            ))}

            <div style={{ position: 'absolute', bottom: '14px', right: '14px', display: 'flex', gap: '8px', zIndex: 5 }}>
              <button className="ni-expand-btn" aria-label="Upload image" style={{ cursor: 'default' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
              </button>
              <button className="ni-expand-btn" aria-label="Expand image" onClick={() => setLightboxOpen(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9"/>
                  <polyline points="9 21 3 21 3 15"/>
                  <line x1="21" y1="3" x2="14" y2="10"/>
                  <line x1="3" y1="21" x2="10" y2="14"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="ni-carousel-row">
            <button className="ni-carousel-btn" aria-label="Previous">&#8249;</button>
            <button className="ni-carousel-btn" aria-label="Next">&#8250;</button>
          </div>

          <div className="ni-bottom-row">
            <div className="ni-checks-col">
              <label className="ni-check-item">
                <input
                  type="checkbox"
                  className="ni-check-input"
                  checked={chkHandwriting}
                  onChange={e => setChkHandwriting(e.target.checked)}
                />
                <span className="ni-check-label">Detect fast handwriting</span>
              </label>
              <label className="ni-check-item">
                <input
                  type="checkbox"
                  className="ni-check-input"
                  checked={chkIncomplete}
                  onChange={e => setChkIncomplete(e.target.checked)}
                />
                <span className="ni-check-label">Detect incomplete sentences</span>
              </label>
              <label className="ni-check-item">
                <input
                  type="checkbox"
                  className="ni-check-input"
                  checked={chkGaps}
                  onChange={e => setChkGaps(e.target.checked)}
                />
                <span className="ni-check-label">Detect gaps in lesson</span>
              </label>
              <button
                className="ni-gen-btn"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? 'Analysing…' : 'Generate Analysis'}
              </button>
            </div>

            <div className="ni-summary-col">
              <h2>AI Summary</h2>
              <p className={`ni-summary-body${summaryFading ? ' loading' : ''}`}>
                {summaryText}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <div
        className={`ni-lightbox${lightboxOpen ? ' open' : ''}`}
        onClick={e => { if (e.target.classList.contains('ni-lightbox')) setLightboxOpen(false) }}
      >
        <button className="ni-lb-close" onClick={() => setLightboxOpen(false)}>&#x2715;</button>
        <div className="ni-lb-inner">
          <img src={notesImg} alt="Expanded student notes" />
          {ANNOTATIONS.map(ann => (
            <div
              key={ann.id}
              className={`ni-annotation${visibleAnns.includes(ann.id) ? ' visible' : ''}${openBubble === ann.id ? ' bubble-open' : ''}`}
              style={{ left: ann.left, top: ann.top }}
              onClick={() => setOpenBubble(openBubble === ann.id ? null : ann.id)}
            >
              <div className={`ni-ann-icon${ann.positive ? ' green' : ''}`}>+</div>
              <div className="ni-ann-bubble">{ann.text}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
