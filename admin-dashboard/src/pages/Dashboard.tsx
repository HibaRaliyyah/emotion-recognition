import { useEffect, useState } from 'react';
import { Users, Activity, MessageSquare } from 'lucide-react';
import { fetchUsers, fetchEmotions, fetchChats } from '../lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    emotions: 0,
    chats: 0
  });

  useEffect(() => {
    Promise.all([
      fetchUsers(),
      fetchEmotions(),
      fetchChats()
    ]).then(([usersData, emotionsData, chatsData]) => {
      setStats({
        users: usersData.users?.length || 0,
        emotions: emotionsData.emotions?.length || 0,
        chats: chatsData.chats?.length || 0
      });
    }).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border p-6 rounded-xl flex items-center space-x-4">
          <div className="p-4 bg-primary/10 text-primary rounded-lg">
            <Users size={32} />
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Total Users</p>
            <h2 className="text-3xl font-bold">{stats.users}</h2>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl flex items-center space-x-4">
          <div className="p-4 bg-primary/10 text-primary rounded-lg">
            <Activity size={32} />
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Emotions Recorded</p>
            <h2 className="text-3xl font-bold">{stats.emotions}</h2>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl flex items-center space-x-4">
          <div className="p-4 bg-primary/10 text-primary rounded-lg">
            <MessageSquare size={32} />
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Chat Insights</p>
            <h2 className="text-3xl font-bold">{stats.chats}</h2>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border p-8 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Welcome to Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Use the sidebar to navigate through the detailed tables for users, emotion records, and chat insights. 
          All data is live from your MongoDB cluster.
        </p>
      </div>
    </div>
  );
}
