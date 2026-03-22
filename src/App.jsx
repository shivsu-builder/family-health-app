import { useState } from 'react'
import { Home, Heart, Stethoscope, Flower2, Baby, MessageCircle, Menu, Activity, ClipboardList, Settings } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import MomHealth from './pages/MomHealth'
import DadHealth from './pages/DadHealth'
import DaughterHealth from './pages/DaughterHealth'
import SonHealth from './pages/SonHealth'
import DailyLog from './pages/DailyLog'
import AIChat from './components/AIChat'
import ApiSettings from './components/ApiSettings'

const navItems = [
  { id: 'dashboard', label: 'Dashboard',       icon: Home },
  { id: 'mom',       label: "Mom's Health",     icon: Heart,        color: 'text-pink-500' },
  { id: 'dad',       label: "Dad's Health",      icon: Stethoscope,  color: 'text-blue-500' },
  { id: 'daughter',  label: "Daughter's Health", icon: Flower2,      color: 'text-purple-500' },
  { id: 'son',       label: "Son's Health",       icon: Baby,         color: 'text-green-500' },
  { id: 'log',       label: 'Daily Log',          icon: ClipboardList,color: 'text-teal-500' },
]

export default function App() {
  const [activePage,   setActivePage]   = useState('dashboard')
  const [chatOpen,     setChatOpen]     = useState(false)
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const renderPage = () => {
    switch (activePage) {
      case 'mom':      return <MomHealth />
      case 'dad':      return <DadHealth />
      case 'daughter': return <DaughterHealth />
      case 'son':      return <SonHealth />
      case 'log':      return <DailyLog />
      default:         return <Dashboard onNavigate={setActivePage} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-56 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800 leading-none">Family Health</p>
            <p className="text-[10px] text-gray-400">Wellness Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id}
              onClick={() => { setActivePage(item.id); setSidebarOpen(false) }}
              className={`nav-link w-full text-sm py-2 ${activePage === item.id ? 'active' : ''}`}>
              <item.icon className={`w-4 h-4 shrink-0 ${activePage === item.id ? 'text-indigo-600' : item.color || 'text-gray-400'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-gray-100 shrink-0 space-y-1.5">
          <button onClick={() => setChatOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium">
            <MessageCircle className="w-4 h-4" />AI Health Chat
          </button>
          <button onClick={() => setSettingsOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-500 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all text-xs font-medium">
            <Settings className="w-3.5 h-3.5" />API Settings
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="lg:hidden flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-gray-800 text-sm">Family Health</span>
          </div>
          <button onClick={() => setChatOpen(true)} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <MessageCircle className="w-4 h-4 text-indigo-600" />
          </button>
        </div>
        <div className="flex-1 min-h-0 p-3">{renderPage()}</div>
      </div>

      {chatOpen     && <AIChat       onClose={() => setChatOpen(false)} />}
      {settingsOpen && <ApiSettings  onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}
