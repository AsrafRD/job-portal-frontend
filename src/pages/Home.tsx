import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import JobCard from '../components/JobCard';
import { useState } from 'react';

export default function Home({ user }: { user: any }) {
  const [search, setSearch] = useState('');
  
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['publicJobs', search],
    queryFn: () => api.get(`/jobs?status=OPEN&search=${search}`).then(res => res.data.data)
  });

  const handleApply = async (jobId: string) => {
    try {
      await api.post(`/jobs/${jobId}/apply`);
      alert('Applied successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to apply');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {!user && (
        <div className="text-center space-y-4 mb-16 p-8 bg-card border border-border rounded-2xl shadow-lg">
          <h2 className="text-5xl font-bold tracking-tight">Find Your <span className="text-primary">Dream Job</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Search and apply to the best opportunities in Indonesia. Built with modern stack.
          </p>
          <div className="pt-4">
            <Link to="/register" className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition shadow-xl shadow-primary/30 text-lg">Get Started</Link>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Latest Openings</h3>
        <input 
          type="text" 
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {isLoading ? (
        <p className="text-gray-400">Loading jobs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.map((job: any) => (
            <JobCard 
              key={job.id} 
              job={job} 
              isCompany={user?.role === 'COMPANY'} 
              onApply={user?.role === 'JOB_SEEKER' ? handleApply : undefined}
            />
          ))}
          {jobs?.length === 0 && <p className="text-gray-400">No open jobs found.</p>}
        </div>
      )}
    </div>
  );
}
