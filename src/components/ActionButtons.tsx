import React from 'react';
import { Download, Users, Upload } from 'lucide-react';
import { UserRole } from '../data/mockData';

interface ActionButtonsProps {
  userRole: UserRole;
  onDownloadSyllabus: () => void;
  onViewClassmates: () => void;
  onSubmitAssignment: () => void; // Student only
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  userRole,
  onDownloadSyllabus,
  onViewClassmates,
  onSubmitAssignment,
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <button
        onClick={onDownloadSyllabus}
        className="inline-flex items-center px-6 py-3 bg-surface text-text font-semibold rounded-lg shadow hover:bg-surface/80 transition-colors duration-200 border border-border"
      >
        <Download size={20} className="mr-2 text-primary" />
        Download Syllabus
      </button>

      <button
        onClick={onViewClassmates}
        className="inline-flex items-center px-6 py-3 bg-surface text-text font-semibold rounded-lg shadow hover:bg-surface/80 transition-colors duration-200 border border-border"
      >
        <Users size={20} className="mr-2 text-primary" />
        View Classmates
      </button>

      {userRole === 'student' && (
        <button
          onClick={onSubmitAssignment}
          className="inline-flex items-center px-6 py-3 bg-accent text-white font-semibold rounded-lg shadow hover:bg-accent/90 transition-colors duration-200"
        >
          <Upload size={20} className="mr-2" />
          Submit Assignment
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
