import React from 'react';
import { Book, Clock, CreditCard, User } from 'lucide-react';
import { Course } from '../data/mockData';

interface CourseHeaderProps {
  course: Course;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ course }) => {
  return (
    <div className="bg-surface p-6 rounded-xl shadow-depth mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">{course.title}</h1>
          <p className="text-xl text-textSecondary mb-4">{course.code}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
          course.enrollmentStatus === 'Enrolled'
            ? 'bg-success/20 text-success'
            : 'bg-warning/20 text-warning'
        }`}>
          {course.enrollmentStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-textSecondary">
        <div className="flex items-center">
          <User size={20} className="mr-2 text-primary" />
          <span>Instructor: <span className="text-text font-medium">{course.instructor.name}</span></span>
        </div>
        <div className="flex items-center">
          <CreditCard size={20} className="mr-2 text-primary" />
          <span>Credits: <span className="text-text font-medium">{course.credits}</span></span>
        </div>
        <div className="flex items-center">
          <Clock size={20} className="mr-2 text-primary" />
          <span>Duration: <span className="text-text font-medium">{course.duration}</span></span>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
