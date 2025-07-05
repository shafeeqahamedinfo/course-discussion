import React from 'react';
import { Course } from '../../data/mockData';
import { Download } from 'lucide-react';

interface SyllabusSectionProps {
  syllabus: Course['syllabus'];
}

const SyllabusSection: React.FC<SyllabusSectionProps> = ({ syllabus }) => {
  return (
    <div className="space-y-6 text-textSecondary">
      <h2 className="text-2xl font-semibold text-text mb-4">Syllabus</h2>

      <div className="bg-surface p-6 rounded-xl shadow-depth">
        <h3 className="text-xl font-medium text-text mb-4">{syllabus.title}</h3>
        <div className="whitespace-pre-wrap text-sm leading-relaxed mb-6 border border-border rounded p-4 max-h-96 overflow-y-auto">
          {syllabus.content}
        </div>
        <a
          href={syllabus.downloadUrl}
          download
          className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow hover:bg-primary/90 transition-colors duration-200"
        >
          <Download size={20} className="mr-2" />
          Download Syllabus
        </a>
      </div>
    </div>
  );
};

export default SyllabusSection;
