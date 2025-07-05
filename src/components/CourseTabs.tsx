import React from 'react';
import { Book, FileText, Folder, Users, MessageSquare } from 'lucide-react';

interface CourseTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: Book },
  { id: 'syllabus', label: 'Syllabus', icon: FileText },
  { id: 'assignments', label: 'Assignments', icon: Folder },
  { id: 'resources', label: 'Resources', icon: Users }, // Using Users icon for resources, could be different
  { id: 'discussion', label: 'Discussion', icon: MessageSquare },
];

const CourseTabs: React.FC<CourseTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-8 border-b border-border">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              isActive
                ? 'text-primary border-b-2 border-primary'
                : 'text-textSecondary hover:text-text hover:border-b-2 hover:border-textSecondary'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon size={18} className="mr-2" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default CourseTabs;
