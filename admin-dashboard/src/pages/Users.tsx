import { useEffect, useState } from 'react';
import { fetchUsers } from '../lib/api';
import { format } from 'date-fns';

import { Link } from 'react-router-dom';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers()
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-muted-foreground">Loading users...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Registered Users</h1>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium text-muted-foreground">Username</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Full Name</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Joined At</th>
              <th className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">@{user.username}</td>
                  <td className="px-6 py-4">{user.name || '-'}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {user.createdAt ? format(new Date(user.createdAt), 'PPpp') : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/users/${user._id}`}
                      className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors inline-block"
                    >
                      View Log
                    </Link>
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
