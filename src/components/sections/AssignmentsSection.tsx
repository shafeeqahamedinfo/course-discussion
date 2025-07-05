import React from 'react';
import { Assignment, UserRole } from '../../data/mockData';
import { FileText, Upload, CheckCircle, XCircle, Clock, Award } from 'lucide-react';

interface AssignmentsSectionProps {
  assignments: Assignment[];
  userRole: UserRole;
}

const AssignmentsSection: React.FC<AssignmentsSectionProps> = ({ assignments, userRole }) => {
  return (
    <div className="space-y-6 text-textSecondary">
      <h2 className="text-2xl font-semibold text-text mb-4">Assignments</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map(assignment => (
          <div key={assignment.id} className="bg-surface p-6 rounded-xl shadow-depth space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium text-text flex items-center">
                <FileText size={20} className="mr-2 text-primary" />
                {assignment.title}
              </h3>
              {userRole === 'student' && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  assignment.status === 'Graded' ? 'bg-success/20 text-success' :
                  assignment.status === 'Submitted' ? 'bg-secondary/20 text-secondary' :
                  'bg-warning/20 text-warning'
                }`}>
                  {assignment.status}
                </span>
              )}
            </div>
            <p className="text-sm">Due Date: {assignment.dueDate}</p>

            {userRole === 'student' && assignment.status === 'Graded' && assignment.grade !== undefined && (
              <p className="text-success flex items-center">
                <Award size={18} className="mr-2" />
                Grade: <span className="font-semibold ml-1">{assignment.grade}%</span>
              </p>
            )}

            {userRole === 'student' && assignment.status === 'Due' && (
              <button className="inline-flex items-center px-4 py-2 bg-accent text-white font-semibold rounded-lg shadow hover:bg-accent/90 transition-colors duration-200 text-sm">
                <Upload size={18} className="mr-2" />
                Submit Assignment
              </button>
            )}

            {userRole === 'teacher' && (
              <div className="mt-4 border-t border-border pt-4">
                <h4 className="text-lg font-medium text-text mb-3">Submissions ({assignment.submissions?.length || 0})</h4>
                {assignment.submissions && assignment.submissions.length > 0 ? (
                  <ul className="space-y-3 text-sm">
                    {assignment.submissions.map(submission => (
                      <li key={submission.id} className="flex items-center justify-between bg-background p-3 rounded">
                        <span>{submission.studentName}</span>
                        <div className="flex items-center space-x-3">
                          <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline flex items-center">
                            <Download size={16} className="mr-1" /> File
                          </a>
                          {submission.grade !== undefined ? (
                             <span className="text-success flex items-center">
                               <Award size={16} className="mr-1" /> {submission.grade}%
                             </span>
                          ) : (
                            <button className="text-primary hover:underline flex items-center">
                               <CheckCircle size={16} className="mr-1" /> Grade
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-textSecondary italic">No submissions yet.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentsSection;
