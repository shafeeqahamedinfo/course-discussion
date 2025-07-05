import React from 'react';
import { Course } from '../../data/mockData';
import { ListChecks, CalendarDays } from 'lucide-react';

interface OverviewSectionProps {
  overview: Course['overview'];
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ overview }) => {
  return (
    <div className="space-y-6 text-textSecondary">
      <div>
        <h2 className="text-2xl font-semibold text-text mb-3">Course Description</h2>
        <p>{overview.description}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-text mb-3 flex items-center">
          <ListChecks size={24} className="mr-2 text-primary" />
          Learning Outcomes
        </h2>
        <ul className="list-disc list-inside space-y-2">
          {overview.learningOutcomes.map((outcome, index) => (
            <li key={index}>{outcome}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-text mb-3 flex items-center">
          <CalendarDays size={24} className="mr-2 text-primary" />
          Schedule
        </h2>
        <p className="whitespace-pre-wrap">{overview.schedule}</p>
      </div>
    </div>
  );
};

export default OverviewSection;
