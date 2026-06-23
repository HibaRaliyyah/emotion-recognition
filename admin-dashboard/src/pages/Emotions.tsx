import { useEffect, useState } from 'react';
import { fetchEmotions } from '../lib/api';
import { format } from 'date-fns';

export default function Emotions() {
  const [emotions, setEmotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmotions()
      .then((data) => {
        setEmotions(data.emotions || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-muted-foreground">Loading emotions...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Emotions Log</h1>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium text-muted-foreground">User</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Predicted Emotion</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Confidence</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Captured At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {emotions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  No emotion records found.
                </td>
              </tr>
            ) : (
              emotions.map((record) => (
                <tr key={record._id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    {record.userId ? `@${record.userId.username}` : 'Unknown'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium capitalize">
                      {record.dominantEmotion || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{record.confidence ? `${record.confidence.toFixed(1)}%` : '-'}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {record.createdAt ? format(new Date(record.createdAt), 'PPpp') : 'Unknown'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
