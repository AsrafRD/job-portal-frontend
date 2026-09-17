import { Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../lib/axios';
import JobCard from '../components/JobCard';

export default function Dashboard({ user }: { user: any }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8 border-b border-border pb-4">
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-gray-400">You are logged in as <span className="text-primary font-medium">{user.role}</span></p>
      </div>

      {user.role === 'COMPANY' ? (
        <CompanyDashboard />
      ) : (
        <JobSeekerDashboard />
      )}
    </div>
  );
}

function CompanyDashboard() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', description: '', location: '', salary: '', jobType: 'FULL_TIME' });

  const { data, isLoading } = useQuery({
    queryKey: ['myJobs'],
    queryFn: () => api.get('/jobs').then(res => res.data.data)
  });

  const createMutation = useMutation({
    mutationFn: (job: any) => api.post('/jobs', job),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
      setShowCreate(false);
      setNewJob({ title: '', description: '', location: '', salary: '', jobType: 'FULL_TIME' });
    }
  });

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-primary">My Jobs</h3>
        <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-all font-medium">
          {showCreate ? 'Cancel' : 'Create Job'}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={e => { e.preventDefault(); createMutation.mutate(newJob); }} className="bg-card border border-border p-6 rounded-xl space-y-4">
          <h4 className="font-bold text-lg">Post a New Job</h4>
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Job Title" className="p-2 bg-background border border-border rounded" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
            <input required placeholder="Location" className="p-2 bg-background border border-border rounded" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
            <input required placeholder="Salary (e.g. 5-10 Juta)" className="p-2 bg-background border border-border rounded" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} />
            <select className="p-2 bg-background border border-border rounded" value={newJob.jobType} onChange={e => setNewJob({...newJob, jobType: e.target.value})}>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>
          <textarea required placeholder="Job Description" rows={4} className="w-full p-2 bg-background border border-border rounded" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})}></textarea>
          <button type="submit" disabled={createMutation.isPending} className="px-6 py-2 bg-primary text-white rounded font-bold">Submit</button>
        </form>
      )}
      
      {isLoading ? (
        <p className="text-sm text-gray-400">Loading jobs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((job: any) => (
            <JobCard key={job.id} job={job} isCompany={true} />
          ))}
          {data?.length === 0 && <p className="text-gray-400 col-span-full">No jobs posted yet.</p>}
        </div>
      )}
    </div>
  );
}

function JobSeekerDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['myApplications'],
    queryFn: () => api.get('/applications/me').then(res => res.data)
  });

  return (
    <div className="grid gap-6">
      <h3 className="text-xl font-semibold text-primary">My Applications</h3>
      
      {isLoading ? (
        <p className="text-sm text-gray-400">Loading applications...</p>
      ) : (
        <div className="grid gap-4">
          {data?.map((app: any) => (
            <div key={app.id} className="bg-card border border-border p-4 rounded-xl flex justify-between items-center">
              <div>
                <a href={`/applications/${app.id}`} className="font-bold text-lg hover:text-primary transition block">{app.job.title}</a>
                <p className="text-sm text-gray-400">{app.job.company.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  app.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-500' :
                  app.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                  app.status === 'SHORTLISTED' ? 'bg-purple-500/10 text-purple-500' :
                  app.status === 'REVIEWING' ? 'bg-blue-500/10 text-blue-500' :
                  'bg-gray-500/10 text-gray-400'
                }`}>
                  {app.status}
                </span>
                <a href={`/applications/${app.id}`} className="px-3 py-1 bg-border rounded-md text-xs hover:bg-border/80 transition">Timeline</a>
              </div>
            </div>
          ))}
          {data?.length === 0 && <p className="text-gray-400">You haven't applied to any jobs yet.</p>}
        </div>
      )}
    </div>
  );
}
