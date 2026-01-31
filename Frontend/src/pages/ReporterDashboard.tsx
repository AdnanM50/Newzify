import React from 'react'

const StatCard: React.FC<{title: string; value: string; meta?: string; accent?: string}> = ({ title, value, meta, accent }) => (
  <div style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))'}} className="rounded-xl p-4 flex-1 min-h-[88px]">
    <div className="text-sm text-gray-300">{title}</div>
    <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    {meta && <div className="mt-1 text-xs text-gray-400">{meta}</div>}
  </div>
)

export default function ReporterDashboard() {
  return (
    <div className="min-h-screen" style={{background: '#0b0f1a', color: '#e6eef8'}}>
      <div className="flex gap-6 p-6 max-w-[1200px] mx-auto">
        {/* Left nav column */}
        <div className="w-16 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">S</div>
          <div className="w-12 h-12 rounded-lg bg-gray-900/40 flex items-center justify-center">🔍</div>
          <div className="w-12 h-12 rounded-lg bg-gray-900/40 flex items-center justify-center">📌</div>
          <div className="mt-auto w-12 h-12 rounded-lg bg-gray-900/40 flex items-center justify-center">⚙️</div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Overview</h1>
            <div className="flex items-center gap-3">
              <input placeholder="Search" className="px-3 py-2 rounded-lg bg-gray-900/30 text-sm text-gray-200 outline-none" />
              <select className="px-3 py-2 rounded-lg bg-gray-900/30 text-sm text-gray-200">
                <option>19.02.2025</option>
              </select>
            </div>
          </div>

          {/* Stat cards */}
          <div className="flex gap-4 mb-6">
            <StatCard title="New threats detected" value="21" meta="+ last week" />
            <StatCard title="New cases filed" value="4" meta="- last week" />
            <StatCard title="Potential threats detected" value="63" meta="+ last week" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Detection map */}
            <div className="col-span-2 bg-gradient-to-b from-[#0f1724] to-[#071223] rounded-2xl p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold text-white">Detection Map</div>
                <div className="text-sm text-gray-400">Show area: <select className="bg-transparent text-gray-300 ml-2"> <option>By Road</option> </select></div>
              </div>

              <div className="w-full h-64 rounded-lg bg-[#071218] relative overflow-hidden" style={{boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)'}}>
                {/* simple visual markers */}
                <svg className="w-full h-full" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="#071218" />
                  {[50,120,220,300,420,500].map((x,i)=> (
                    <g key={i}>
                      <circle cx={x} cy={40 + (i*30)%200} r="6" fill="#ff3b30" />
                      <path d={`M${x-60} ${20 + (i*30)%200} C ${x-30} ${10 + (i*20)%200}, ${x-10} ${30 + (i*40)%200}, ${x} ${40 + (i*30)%200}`} stroke="#6ee7b7" strokeWidth="1" fill="none" opacity="0.6" />
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Activities / right column */}
            <aside className="bg-gradient-to-b from-[#0f1724] to-[#071223] rounded-2xl p-4 border border-gray-800">
              <div className="text-lg font-semibold mb-3">Activities</div>
              <div className="space-y-2">
                {['Crime activity','Cartel activity','Gang activity','Drug activity','Missing persons','Immigration','Hijacking','Law enforcement activity','Smuggling activity'].map((a,i)=> (
                  <label key={i} className="flex items-center justify-between bg-gray-900/20 rounded p-2">
                    <span className="text-sm text-gray-200">{a}</span>
                    <input type="checkbox" defaultChecked={i<4} />
                  </label>
                ))}
              </div>
              <button className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 text-white">Apply</button>

              <div className="mt-6 p-3 rounded-lg bg-gradient-to-br from-purple-700 to-indigo-500 text-white">
                <div className="text-sm">Latest version available now</div>
                <div className="font-bold text-xl mt-1">4.2</div>
                <button className="mt-3 w-full py-2 rounded bg-white text-indigo-700">Update now</button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
