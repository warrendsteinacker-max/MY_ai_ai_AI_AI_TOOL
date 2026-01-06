import { useState, useEffect } from 'react'
import axios from 'axios'

export default function App() {
  const [task, setTask] = useState("College_Book")
  const [folder, setFolder] = useState("Chapter_1")
  const [events, setEvents] = useState([])

  const sync = () => axios.post('http://localhost:8000/config', { task, folder })

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await axios.get('http://localhost:8000/events')
      setEvents(res.data.reverse())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ padding: '30px', background: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h2>🔧 AI Task Trainer</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <select value={task} onChange={e => setTask(e.target.value)} style={{padding: '10px'}}>
          <option value="College_Book">College Book (Scraping)</option>
          <option value="Data_Entry">Data Entry (Forms)</option>
          <option value="Research">Web Research</option>
        </select>
        <input value={folder} onChange={e => setFolder(e.target.value)} placeholder="Subfolder Name" />
        <button onClick={sync} style={{background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px'}}>Sync Config</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#1e293b', padding: '15px', borderRadius: '10px', overflowY: 'auto', maxHeight: '70vh' }}>
          {events.map(e => (
            <div key={e.id} style={{ borderBottom: '1px solid #334155', padding: '10px 0' }}>
              <strong>{e.type.toUpperCase()}</strong>: {e.selector} {e.value && `("${e.value}")`}
              <div style={{fontSize: '11px', color: '#94a3b8'}}>{e.path}</div>
            </div>
          ))}
        </div>
        <div>
          <h3>Live Training Capture</h3>
          {events[0] && <img src={`http://localhost:8000/screenshots/${events[0].screenshot}`} style={{width: '100%', borderRadius: '10px', border: '2px solid #334155'}} />}
        </div>
      </div>
    </div>
  )
}