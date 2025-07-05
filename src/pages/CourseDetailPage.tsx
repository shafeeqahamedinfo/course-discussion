import React, { useState } from 'react';
import CourseHeader from '../components/CourseHeader';
import CourseTabs from '../components/CourseTabs';
import OverviewSection from '../components/sections/OverviewSection';
import SyllabusSection from '../components/sections/SyllabusSection';
import AssignmentsSection from '../components/sections/AssignmentsSection';
import ResourcesSection from '../components/sections/ResourcesSection';
import DiscussionLink from '../components/DiscussionLink';
import ActionButtons from '../components/ActionButtons';
import { mockCourse, mockCourseTeacherView, UserRole } from '../data/mockData';

const CourseDetailPage: React.FC = () => {
  // Mock user role - toggle between 'student' and 'teacher'
  const [userRole, setUserRole] = useState<UserRole>('student');
  const course = userRole === 'student' ? mockCourse : mockCourseTeacherView;

  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Mock action handlers
  const handleDownloadSyllabus = () => {
    alert('Downloading syllabus...');
    // In a real app, trigger file download
  };

  const handleViewClassmates = () => {
    alert('Viewing classmates...');
    // In a real app, navigate to classmates page or show modal
  };

  const handleSubmitAssignment = () => {
    alert('Submitting assignment...');
    // In a real app, open submission form/modal
  };

  const renderSection = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewSection overview={course.overview} />;
      case 'syllabus':
        return <SyllabusSection syllabus={course.syllabus} />;
      case 'assignments':
        return <AssignmentsSection assignments={course.assignments} userRole={userRole} />;
      case 'resources':
        return <ResourcesSection resources={course.resources} />;
      case 'discussion':
        return <DiscussionLink url={course.discussionForumUrl} />;
      default:
        return <OverviewSection overview={course.overview} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-text p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Toggle User Role (for demo purposes) */}
        <div className="mb-6 text-center">
          <span className="mr-4 text-textSecondary">View as:</span>
          <button
            onClick={() => setUserRole('student')}
            className={`px-4 py-2 rounded-l-lg font-semibold transition-colors duration-200 ${userRole === 'student' ? 'bg-primary text-white' : 'bg-surface text-text hover:bg-surface/80'}`}
          >
            Student
          </button>
          <button
            onClick={() => setUserRole('teacher')}
            className={`px-4 py-2 rounded-r-lg font-semibold transition-colors duration-200 ${userRole === 'teacher' ? 'bg-primary text-white' : 'bg-surface text-text hover:bg-surface/80'}`}
          >
            Teacher
          </button>
        </div>

        <CourseHeader course={course} />

        <ActionButtons
          userRole={userRole}
          onDownloadSyllabus={handleDownloadSyllabus}
          onViewClassmates={handleViewClassmates}
          onSubmitAssignment={handleSubmitAssignment}
        />

        <CourseTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="bg-surface p-6 rounded-xl shadow-depth">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
