import React from 'react';
import { Resource } from '../../data/mockData';
import { FileText, Link, Video } from 'lucide-react';

interface ResourcesSectionProps {
  resources: Resource[];
}

const getIcon = (type: Resource['type']) => {
  switch (type) {
    case 'Document': return FileText;
    case 'Link': return Link;
    case 'Video': return Video;
    default: return FileText;
  }
};

const ResourcesSection: React.FC<ResourcesSectionProps> = ({ resources }) => {
  return (
    <div className="space-y-6 text-textSecondary">
      <h2 className="text-2xl font-semibold text-text mb-4">Resources</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map(resource => {
          const Icon = getIcon(resource.type);
          return (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-surface p-6 rounded-xl shadow-depth hover:bg-surface/80 transition-colors duration-200 group"
            >
              <Icon size={24} className="mr-4 text-primary group-hover:scale-110 transition-transform duration-200" />
              <div>
                <h3 className="text-xl font-medium text-text group-hover:underline">{resource.title}</h3>
                <p className="text-sm text-textSecondary">{resource.type}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default ResourcesSection;
