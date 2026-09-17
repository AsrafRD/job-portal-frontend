import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { useState } from 'react';

const statusColors: any = {
  APPLIED: 'bg-gray-500/10 text-gray-400',
  REVIEWING: 'bg-blue-500/10 text-blue-500',
  SHORTLISTED: 'bg-purple-500/10 text-purple-500',
  ACCEPTED: 'bg-green-500/10 text-green-500',
  REJECTED: 'bg-red-500/10 text-red-500',
};

export default function ApplicationDetail({ user }: { user: any }) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState('');

  const { data: history, isLoading } = useQuery({
    queryKey: ['applicationHistory', id],
    queryFn: () => api.get(`/applications/${id}/history`).then(res => res.data)
  });

  const updateMutation = useMutation({
    mutationFn: (status: string) => api.patch(`/applications/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicationHistory', id] });
    }
  });

  if (isLoading) return <div className="p-8">Loading history...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-8">Application Timeline</h2>
      
      {user?.role === 'COMPANY' && (
        <div className="mb-8 p-6 bg-card border border-border rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Update Status</h3>
          <div className="flex gap-4">
            <select 
              value={newStatus} 
              onChange={e => setNewStatus(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg"
            >
              <option value="">Select status...</option>
              <option value="REVIEWING">REVIEWING</option>
              <option value="SHORTLISTED">SHORTLISTED</option>
              <option value="ACCEPTED">ACCEPTED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <button 
              onClick={() => updateMutation.mutate(newStatus)}
              disabled={!newStatus || updateMutation.isPending}
              className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
            >
              Update
            </button>
          </div>
        </div>
      )}

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {history?.map((event: any, index: number) => (
          <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-bold text-primary">
                  {new Date(event.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {event.fromStatus && (
                  <>
                    <span className={`px-2 py-1 text-xs rounded-full font-bold ${statusColors[event.fromStatus]}`}>
                      {event.fromStatus}
                    </span>
                    <span className="text-gray-500">→</span>
                  </>
                )}
                <span className={`px-2 py-1 text-xs rounded-full font-bold ${statusColors[event.toStatus]}`}>
                  {event.toStatus}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Changed by: {event.changedBy?.name} ({event.changedBy?.role})
              </p>
            </div>
          </div>
        ))}
        {history?.length === 0 && <p className="text-gray-400 text-center">No history found.</p>}
      </div>
    </div>
  );
}
