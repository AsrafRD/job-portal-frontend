import { Link } from 'react-router-dom';

export default function JobCard({ job, onApply, isCompany }: any) {
  return (
    <div className="bg-card border border-border p-6 rounded-xl hover:border-primary/50 transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-foreground">{job.title}</h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            job.status === 'OPEN' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {job.status}
          </span>
        </div>
        <div className="space-y-2 mb-6">
          <p className="text-sm text-gray-400">🏢 {job.company?.name || 'Unknown Company'}</p>
          <p className="text-sm text-gray-400">📍 {job.location}</p>
          <p className="text-sm text-gray-400">💼 {job.jobType}</p>
          <p className="text-sm text-gray-400">💰 {job.salary}</p>
        </div>
        <p className="text-sm text-gray-300 line-clamp-3 mb-6">{job.description}</p>
      </div>

      <div className="flex gap-2">
        {isCompany ? (
          <Link to={`/jobs/${job.id}/applicants`} className="flex-1 text-center py-2 bg-border hover:bg-border/80 text-white rounded-lg transition-colors font-medium">
            View Applicants
          </Link>
        ) : (
          <button 
            onClick={() => onApply && onApply(job.id)}
            disabled={job.status !== 'OPEN'}
            className="flex-1 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-lg hover:shadow-primary/20"
          >
            {job.status === 'OPEN' ? 'Apply Now' : 'Closed'}
          </button>
        )}
      </div>
    </div>
  );
}
