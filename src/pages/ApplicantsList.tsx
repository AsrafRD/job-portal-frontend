import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

const statusColors: any = {
  APPLIED: 'bg-gray-500/10 text-gray-400',
  REVIEWING: 'bg-blue-500/10 text-blue-500',
  SHORTLISTED: 'bg-purple-500/10 text-purple-500',
  ACCEPTED: 'bg-green-500/10 text-green-500',
  REJECTED: 'bg-red-500/10 text-red-500',
};

export default function ApplicantsList({ user }: { user: any }) {
  const { id } = useParams();

  const { data: applicants, isLoading } = useQuery({
    queryKey: ['jobApplicants', id],
    queryFn: () => api.get(`/jobs/${id}/applicants`).then(res => res.data)
  });

  if (user?.role !== 'COMPANY') {
    return <div className="p-8">Access denied</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/dashboard" className="px-4 py-2 border border-border rounded-md hover:bg-border transition">← Back</Link>
        <h2 className="text-3xl font-bold">Applicants</h2>
      </div>

      {isLoading ? (
        <p className="text-gray-400">Loading applicants...</p>
      ) : (
        <div className="grid gap-4">
          {applicants?.map((app: any) => (
            <div key={app.id} className="bg-card border border-border p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-primary/30 transition-all">
              <div>
                <h4 className="font-bold text-xl text-primary">{app.applicant.name}</h4>
                <p className="text-sm text-gray-400 mb-2">{app.applicant.email}</p>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[app.status]}`}>
                  {app.status}
                </span>
                <Link to={`/applications/${app.id}`} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition shadow-md hover:shadow-primary/20">
                  Review & Update Status
                </Link>
              </div>
            </div>
          ))}
          {applicants?.length === 0 && (
            <div className="text-center p-12 border border-dashed border-border rounded-xl">
              <p className="text-gray-400">No applicants yet for this job.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
