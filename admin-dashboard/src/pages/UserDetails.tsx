import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchUserDetails } from '../lib/api';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchUserDetails(id)
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div className="text-muted-foreground">Loading user details...</div>;
  if (!data || !data.user) return <div className="text-red-500">User not found.</div>;

  const { user, emotions, chats } = data;

  // Calculate Average Happiness
  const totalHappy = emotions.reduce((acc: number, curr: any) => acc + (curr.emotions?.happy || 0), 0);
  const avgHappiness = emotions.length > 0 ? (totalHappy / emotions.length).toFixed(1) : 0;

  // Calculate Category breakdown
  const categories: Record<string, number> = {};
  emotions.forEach((record: any) => {
    const emo = record.dominantEmotion || 'Unknown';
    categories[emo] = (categories[emo] || 0) + 1;
  });

  return (
    <div>
      <div className="mb-6 flex items-center space-x-4">
        <Link to="/users" className="p-2 hover:bg-muted/50 rounded-full transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">@{user.username}</h1>
          <p className="text-muted-foreground text-sm">{user.email || 'No email'}</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border p-6 rounded-xl">
          <p className="text-muted-foreground text-sm font-medium">Total Emotions Captured</p>
          <h2 className="text-3xl font-bold mt-2">{emotions.length}</h2>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl">
          <p className="text-muted-foreground text-sm font-medium">Avg. Happiness Score</p>
          <h2 className="text-3xl font-bold mt-2">{avgHappiness}%</h2>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl">
          <p className="text-muted-foreground text-sm font-medium">Total Chat Insights</p>
          <h2 className="text-3xl font-bold mt-2">{chats.length}</h2>
        </div>
      </div>

      {/* Categories Breakdown */}
      <div className="mb-8 bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Emotion Categories</h3>
        {Object.keys(categories).length === 0 ? (
          <p className="text-muted-foreground">No emotions recorded yet.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {Object.entries(categories).map(([emotion, count]) => (
              <div key={emotion} className="bg-muted/30 border border-border rounded-lg p-4 flex-1 min-w-[120px] text-center">
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">{emotion}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Individual Emotions Log */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Individual Emotion Logs</h3>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-muted-foreground">Captured At</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Dominant Emotion</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Mixed Result (AI)</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {emotions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No individual logs found for this user.
                  </td>
                </tr>
              ) : (
                emotions.map((record: any) => (
                  <tr key={record._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {record.createdAt ? format(new Date(record.createdAt), 'PPpp') : 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium capitalize">
                        {record.dominantEmotion || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {record.mixedEmotion ? (
                        <span className="text-sm font-medium">{record.mixedEmotion}</span>
                      ) : (
                        <span className="text-muted-foreground italic text-sm">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {record.confidence ? `${record.confidence.toFixed(1)}%` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
