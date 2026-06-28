import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Bell } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="bg-slate-900 text-white w-full">
      <div className="flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 text-white text-xs font-bold w-8 h-8 flex items-center justify-center rounded">
              IPT
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-sm">IPT PowerTech</div>
              <div className="text-xs text-red-400">Preventative Maintenance</div>
            </div>
          </div>
          <nav className="flex items-center gap-1 ml-4">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-1.5 text-sm rounded transition-colors ${
                  isActive ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/inspections"
              className={({ isActive }) =>
                `px-3 py-1.5 text-sm rounded transition-colors ${
                  isActive ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`
              }
            >
              PM
            </NavLink>
            <NavLink
              to="/sites"
              className={({ isActive }) =>
                `px-3 py-1.5 text-sm rounded transition-colors ${
                  isActive ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`
              }
            >
              Sites
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-1.5 text-slate-400 hover:text-white transition-colors">
            <Bell size={18} />
          </button>
          <span className="text-sm text-slate-300">{user?.email}</span>
          <button
            onClick={handleSignOut}
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
