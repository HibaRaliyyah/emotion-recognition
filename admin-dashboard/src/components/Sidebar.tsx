import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Users', path: '/users', icon: Users },
  { name: 'Emotions Log', path: '/emotions', icon: Activity },
  { name: 'Chat Insights', path: '/chats', icon: MessageSquare },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-card border-r border-border h-full p-4 flex flex-col">
      <div className="mb-8 px-4">
        <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-1">InnerGlow</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
