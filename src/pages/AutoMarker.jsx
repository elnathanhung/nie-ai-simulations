import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import automarkerImg from '../assets/automarker-paper.jpg'
import Footer from '../components/Footer.jsx'

const ESSAY_PARAGRAPHS = [
  "The Conference of 1960 was held in an attempt to bring about independence for the African colonies. However, it failed. Both sources explain some reasons for this failure, but they do not explain everything.",
  "Source A explains that one reason for the failure was the disagreement among the African leaders themselves. It says that the leaders could not agree on how independence should be achieved. Some wanted peaceful negotiations while others wanted immediate independence through protest or even violence. Because of this, the Conference could not form a united plan. This is a convincing reason because if the leaders are not united, it will be difficult to pressure the colonial powers.",
  "Source B, on the other hand, focuses on the attitude of the colonial powers. It says that the colonial governments were not willing to give up power and used their control to weaken the Conference. They did not take the demands seriously and some even refused to attend the meeting. This shows that the colonial powers were not ready for independence yet, and were the main obstacle. This is also a strong reason for the failure.",
  "However, both sources do not mention other important factors. There were differences in language, culture and interests among the African colonies. Some were under French rule, others under British rule, and they had different experiences and priorities. Also, the Cold War at that time may have affected the Conference because the colonial powers were supported by superpowers who did not want their influence to decrease.",
  "In conclusion, Sources A and B explain important reasons such as disagreements among African leaders and the uncooperative attitude of colonial powers. However, other factors such as colonial differences and Cold War politics are also relevant.",
]

const FEEDBACK_HIGH = [
  "Response successfully references both Source A and B. Disagreement among African leaders and colonial resistance identified as key failure factors. Counter-argument and conclusion detected. Recommended score: 8/10.",
  "Source-based reasoning present. Student identifies internal African divisions and colonial unwillingness as causes. Evaluation language ('convincing reason', 'strong reason') detected. Evidence of beyond-source analysis noted.",
  "Both sources analysed with supporting explanation. Student attempts own knowledge paragraph referencing Cold War and colonial differences. Structure consistent with mark scheme expectations.",
]
const FEEDBACK_MID = [
  "Partial source reference detected. Possible mention of African leaders and colonial powers, but argument structure unclear. Evaluation language uncertain. Score estimate unreliable — recommend teacher review.",
  "Some keywords extracted: 'independence', 'Conference', 'colonial'. Unable to confirm whether student evaluated sources or merely described them. Rubric criteria partially met.",
  "Response length suggests adequate development, but critical terms ('united', 'negotiate', 'obstacle') were misread. Cannot confirm presence of counter-argument paragraph. Confidence: low.",
]
const FEEDBACK_LOW = [
  "Insufficient text extracted to apply mark scheme. Keywords not recoverable. A score has been generated based on structural heuristics only. This result may not reflect student ability.",
  "Recognition failure across multiple paragraphs. Unable to locate source references or evaluative statements. Pass/Fail determined by word-count estimate alone — not content.",
  "Character extraction below usable threshold. The system has returned a result, but no rubric criteria could be verified. Student work may have been graded incorrectly.",
]

const GLITCH_CHARS = ['#','@','8','0','l','1','rn','m','cl','d','nn','ri','ii','lt']

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function garbleWord(word, severity) {
  if (severity === 0 || word.length <= 2) return word
  if (severity === 1) {
    if (Math.random() > 0.65) return word
    const i = Math.floor(Math.random() * (word.length - 1)) + 1
    return word.slice(0, i) + pick(GLITCH_CHARS) + word.slice(i + 1)
  }
  if (severity === 2) {
    if (Math.random() > 0.45) {
      const i = Math.floor(Math.random() * word.length)
      return word.slice(0, i) + word.slice(i + 1)
    }
    const i = Math.floor(Math.random() * (word.length - 1)) + 1
    return word.slice(0, i) + pick(GLITCH_CHARS) + word.slice(i + 1)
  }
  const roll = Math.random()
  if (roll < 0.3) return word.slice(0, Math.max(1, Math.floor(word.length / 2))) + '...'
  if (roll < 0.55) return '???'
  if (roll < 0.7) return ''
  let w = word
  for (let k = 0; k < 2; k++) {
    const i = Math.floor(Math.random() * w.length)
    w = w.slice(0, i) + pick(GLITCH_CHARS) + w.slice(i + 1)
  }
  return w
}

function corruptText(text, severity) {
  if (severity === 0) return text
  const words = text.split(' ')
  const result = []
  for (let i = 0; i < words.length; i++) {
    let w = words[i]
    if (severity === 3 && Math.random() < 0.25) {
      if (Math.random() < 0.5) continue
      if (i + 1 < words.length) {
        result.push(garbleWord(w + words[i + 1], severity))
        i++
        continue
      }
    }
    result.push(garbleWord(w, severity))
  }
  let out = result.filter(w => w !== '').join(' ')
  if (severity >= 2 && Math.random() < 0.4) {
    const cutAt = Math.floor(out.length * (0.4 + Math.random() * 0.4))
    out = out.slice(0, cutAt) + '—'
  }
  return out
}

function getScore(t, r, d) {
  const minVal = Math.min(t, r, d)
  const avg = (t + r + d) / 3
  return Math.round(avg * 0.5 + minVal * 0.5)
}

function scoreToSeverity(score) {
  if (score >= 70) return 0
  if (score >= 50) return 1
  if (score >= 30) return 2
  return 3
}

export default function AutoMarker() {
  const navigate = useNavigate()
  const [threshold, setThreshold] = useState(50)
  const [resolution, setResolution] = useState(50)
  const [diversity, setDiversity] = useState(50)
  const [paraIndex, setParaIndex] = useState(0)
  const [interpText, setInterpText] = useState('Adjust the sliders below to see how AI confidence parameters affect the system\'s reading of this handwritten response.')
  const [feedbackText, setFeedbackText] = useState('Move the sliders to generate AI feedback.')
  const [verdictText, setVerdictText] = useState('—')
  const [verdictClass, setVerdictClass] = useState('')
  const [fading, setFading] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const initialised = useRef(false)

  const compute = useCallback((t, r, d, pIdx, fullUpdate) => {
    const score = getScore(t, r, d)
    const severity = scoreToSeverity(score)
    const isPass = score >= 50

    setFading(true)
    setTimeout(() => {
      setInterpText(corruptText(ESSAY_PARAGRAPHS[pIdx], severity))
      if (fullUpdate) {
        if (score >= 65) setFeedbackText(pick(FEEDBACK_HIGH))
        else if (score >= 35) setFeedbackText(pick(FEEDBACK_MID))
        else setFeedbackText(pick(FEEDBACK_LOW))
        setVerdictText(isPass ? 'PASS' : 'FAIL')
        setVerdictClass(isPass ? 'pass' : 'fail')
      }
      setFading(false)
    }, 200)
  }, [])

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true
      compute(threshold, resolution, diversity, paraIndex, true)
    }
  }, [])

  const handleSlider = (setter, val, which) => {
    setter(val)
    const t = which === 'threshold' ? val : threshold
    const r = which === 'resolution' ? val : resolution
    const d = which === 'diversity' ? val : diversity
    compute(t, r, d, paraIndex, true)
  }

  const handleNav = (dir) => {
    const next = (paraIndex + dir + ESSAY_PARAGRAPHS.length) % ESSAY_PARAGRAPHS.length
    setParaIndex(next)
    compute(threshold, resolution, diversity, next, false)
  }

  const sliderPct = (val) => `${val}%`

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
        .am-page { font-family: 'IBM Plex Sans', sans-serif; background: linear-gradient(160deg, #0d1321 0%, #1a2744 60%, #0d1321 100%); min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding-top: 48px; }
        .am-back { position:fixed; top:0; left:0; right:0; z-index:100; display:flex; align-items:center; gap:8px; width:100%; padding:14px 20px; background:rgba(26,39,68,0.9); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); color:#9aa3b8; font-size:0.8rem; font-weight:600; border:none; cursor:pointer; letter-spacing:0.04em; text-transform:uppercase; transition:color 0.2s; text-align:left; justify-content:center; }
        .am-back-inner { display:flex; align-items:center; justify-content:space-between; width:100%; max-width:720px; }
        .am-back:hover { color:#fff; }
        .am-tag { font-size:0.75rem; font-weight:500; color:#4a6cf7; background:rgba(74,108,247,0.12); border:1px solid rgba(74,108,247,0.25); border-radius:20px; padding:3px 10px; text-transform:none; letter-spacing:0; flex-shrink:0; }
        .am-frame { width:100%; max-width:720px; background:#f4f5f8; display:flex; flex-direction:column; }
        .am-header { background:linear-gradient(135deg,#1a2744 0%,#2a3f7e 100%); padding:28px 32px 24px; }
        .am-header h1 { font-size:1.75rem; font-weight:700; color:#fff; letter-spacing:-0.01em; line-height:1.2; }
        .am-panel { display:grid; grid-template-columns:1fr 1fr; min-height:480px; background:#f0f0f0; }
        @media (max-width: 600px) {
          .am-panel { grid-template-columns:1fr; }
          .am-img-col { min-height:280px; }
        }
        .am-img-col { background:#d8d8d8; position:relative; display:flex; align-items:center; justify-content:center; min-height:460px; }
        .am-img-col img { width:82%; height:84%; object-fit:contain; border-radius:2px; }
        .am-upload-btn { position:absolute; bottom:18px; right:18px; background:rgba(255,255,255,0.18); border:none; border-radius:6px; padding:8px 10px; cursor:pointer; color:#1a2744; display:flex; align-items:center; justify-content:center; transition:background 0.2s; }
        .am-upload-btn:hover { background:rgba(255,255,255,0.38); }
        .am-expand-btn { position:absolute; bottom:18px; right:62px; background:rgba(255,255,255,0.18); border:none; border-radius:6px; padding:8px 10px; cursor:pointer; color:#1a2744; display:flex; align-items:center; justify-content:center; }
        .am-expand-btn:hover { background:rgba(255,255,255,0.38); }
        .am-ai-col { background:#1a2744; display:flex; flex-direction:column; }
        .am-interp-area { flex:1; padding:24px 22px 16px; display:flex; flex-direction:column; }
        .am-interp-area h2 { font-size:0.9rem; font-weight:700; color:#fff; margin-bottom:14px; letter-spacing:0.01em; }
        .am-interp-text { font-size:0.82rem; line-height:1.7; color:#e8eaf0; flex:1; transition:opacity 0.3s; }
        .am-interp-text.fading { opacity:0.4; }
        .am-carousel-nav { display:flex; gap:12px; justify-content:center; padding:14px 0 10px; }
        .am-nav-btn { background:none; border:none; color:#9aa3b8; font-size:1.1rem; cursor:pointer; padding:4px 10px; border-radius:4px; transition:color 0.2s,background 0.2s; }
        .am-nav-btn:hover { color:#fff; background:rgba(255,255,255,0.08); }
        .am-feedback-row { display:grid; grid-template-columns:1fr 1fr; border-top:1px solid rgba(255,255,255,0.07); }
        .am-feedback-cell { padding:16px 18px; font-size:0.78rem; color:#e8eaf0; line-height:1.55; }
        .am-feedback-cell:first-child { border-right:1px solid rgba(255,255,255,0.07); }
        .am-feedback-cell .label { font-weight:700; color:#fff; }
        .am-passfail-cell { padding:16px 18px; display:flex; flex-direction:column; align-items:flex-start; gap:4px; }
        .am-passfail-cell .label { font-size:0.78rem; font-weight:700; color:#fff; }
        .am-verdict { font-size:1.35rem; font-weight:700; letter-spacing:0.05em; transition:color 0.35s,opacity 0.3s; }
        .am-verdict.pass { color:#3ecf6a; }
        .am-verdict.fail { color:#e05252; }
        .am-verdict.fading { opacity:0.4; }
        .am-controls { padding:28px 32px 40px; display:flex; flex-direction:column; align-items:center; gap:0; }
        .am-controls-desc { font-size:0.875rem; color:#555d75; text-align:center; max-width:480px; line-height:1.6; margin-bottom:28px; }
        .am-sliders-wrap { width:100%; max-width:400px; display:flex; flex-direction:column; gap:22px; }
        .am-slider-group { display:flex; flex-direction:column; gap:8px; }
        .am-slider-label-row { display:flex; align-items:center; gap:7px; }
        .am-slider-label-row span { font-size:0.9rem; font-weight:600; color:#1a2744; }
        .am-tooltip-wrap { position:relative; display:inline-flex; align-items:center; }
        .am-tooltip-icon { width:18px; height:18px; border-radius:50%; border:1.5px solid #9aa3b8; color:#9aa3b8; font-size:0.65rem; font-weight:700; display:flex; align-items:center; justify-content:center; cursor:default; user-select:none; transition:border-color 0.2s,color 0.2s; line-height:1; }
        .am-tooltip-wrap:hover .am-tooltip-icon { border-color:#1a2744; color:#1a2744; }
        .am-tooltip-bubble { display:none; position:absolute; bottom:calc(100% + 10px); left:50%; transform:translateX(-50%); background:white; color:#1a2744; font-size:0.75rem; line-height:1.55; padding:10px 13px; border-radius:8px; width:210px; box-shadow:0 4px 18px rgba(0,0,0,0.13); z-index:10; pointer-events:none; text-align:center; }
        .am-tooltip-bubble::after { content:''; position:absolute; top:100%; left:50%; transform:translateX(-50%); border:6px solid transparent; border-top-color:white; }
        .am-tooltip-wrap:hover .am-tooltip-bubble { display:block; }
        .am-range { -webkit-appearance:none; appearance:none; width:100%; height:5px; border-radius:3px; outline:none; cursor:pointer; transition:background 0.1s; }
        .am-range::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#1a2744; border:2px solid white; box-shadow:0 1px 4px rgba(0,0,0,0.2); cursor:pointer; transition:transform 0.15s; }
        .am-range:hover::-webkit-slider-thumb { transform:scale(1.15); }
        .am-lightbox { display:none; position:fixed; inset:0; background:rgba(10,14,25,0.92); z-index:999; align-items:center; justify-content:center; padding:48px; }
        .am-lightbox.open { display:flex; }
        .am-lightbox img { max-width:95vw; max-height:92vh; object-fit:contain; background:white; border-radius:4px; }
        .am-lightbox-close { position:fixed; top:18px; right:24px; background:none; border:none; color:white; font-size:2rem; cursor:pointer; }
      `}</style>

      <div className="am-page">
        <button className="am-back" onClick={() => navigate('/')}>
          <div className="am-back-inner">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Back to Home
            </span>
            <span className="am-tag">Browser Demo</span>
          </div>
        </button>

        <div className="am-frame">
          <header className="am-header">
            <h1>AI Auto-marking Simulator</h1>
          </header>

          <div className="am-panel">
            <div className="am-img-col">
              <img src={automarkerImg} alt="Student handwritten essay" />
              <button className="am-upload-btn" title="Upload image" aria-label="Upload student paper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
              </button>
              <button className="am-expand-btn" title="Expand image" onClick={() => setLightboxOpen(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                  <path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>
                </svg>
              </button>
            </div>

            <div className="am-ai-col">
              <div className="am-interp-area">
                <h2>AI Interpretation</h2>
                <p className={`am-interp-text${fading ? ' fading' : ''}`}>{interpText}</p>
              </div>

              <div className="am-carousel-nav">
                <button className="am-nav-btn" onClick={() => handleNav(-1)}>&#8249;</button>
                <button className="am-nav-btn" onClick={() => handleNav(1)}>&#8250;</button>
              </div>

              <div className="am-feedback-row">
                <div className="am-feedback-cell">
                  <span className="label">Feedback: </span>
                  <span className={fading ? 'fading' : ''}>{feedbackText}</span>
                </div>
                <div className="am-passfail-cell">
                  <span className="label">Pass/Fail:</span>
                  <span className={`am-verdict${verdictClass ? ' ' + verdictClass : ''}${fading ? ' fading' : ''}`}>
                    {verdictText}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="am-controls">
            <p className="am-controls-desc">
              Interact with the controllers and see how AI can change its interpretation.
            </p>

            <div className="am-sliders-wrap">
              {[
                { id: 'threshold', label: 'Threshold', val: threshold, set: (v) => handleSlider(setThreshold, v, 'threshold'), tip: 'The minimum confidence score the AI requires before accepting a character recognition result. Lower thresholds accept more guesses.' },
                { id: 'resolution', label: 'Resolution', val: resolution, set: (v) => handleSlider(setResolution, v, 'resolution'), tip: 'How finely the AI samples the image. Low resolution causes the model to miss detail in dense or small handwriting.' },
                { id: 'diversity', label: 'Diversity',  val: diversity,  set: (v) => handleSlider(setDiversity, v, 'diversity'),  tip: 'How well the training data represents diverse handwriting styles. Low diversity means the model struggles with non-standard or non-Western scripts.' },
              ].map(({ id, label, val, set, tip }) => (
                <div className="am-slider-group" key={id}>
                  <div className="am-slider-label-row">
                    <span>{label}</span>
                    <div className="am-tooltip-wrap">
                      <div className="am-tooltip-icon">i</div>
                      <div className="am-tooltip-bubble">{tip}</div>
                    </div>
                  </div>
                  <input
                    type="range"
                    className="am-range"
                    min="0" max="100"
                    value={val}
                    onChange={e => set(Number(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #1e2e50 0%, #1e2e50 ${sliderPct(val)}, #d0d4de ${sliderPct(val)}, #d0d4de 100%)`
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <div className={`am-lightbox${lightboxOpen ? ' open' : ''}`} onClick={e => { if (e.target.classList.contains('am-lightbox')) setLightboxOpen(false) }}>
        <button className="am-lightbox-close" onClick={() => setLightboxOpen(false)}>×</button>
        <img src={automarkerImg} alt="Expanded student paper" />
      </div>
    </>
  )
}
