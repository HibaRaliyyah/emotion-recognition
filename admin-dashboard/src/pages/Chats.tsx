import { useEffect, useState } from 'react';
import { fetchChats } from '../lib/api';
import { format } from 'date-fns';

export default function Chats() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats()
      .then((data) => {
        setChats(data.chats || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-muted-foreground">Loading chats...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Chat Insights</h1>
      <div className="space-y-4">
        {chats.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
            No chat insights found.
          </div>
        ) : (
          chats.map((chat) => (
            <div key={chat._id} className="bg-card border border-border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="font-medium text-lg">
                  {chat.userId ? `@${chat.userId.username}` : 'Unknown User'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {chat.createdAt ? format(new Date(chat.createdAt), 'PPpp') : 'Unknown'}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">User Message</h4>
                  <p className="text-foreground">{chat.userMessage}</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <h4 className="text-xs font-semibold uppercase text-primary mb-2">AI Reply</h4>
                  <p className="text-foreground leading-relaxed">{chat.aiReply}</p>
                </div>
              </div>

              {chat.insightSummary && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Insight Summary</h4>
                  <p className="text-sm text-muted-foreground">{chat.insightSummary}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
