
export interface Course {
  id: string;
  title: string;
  code: string;
  instructor: {
    name: string;
    // Using Pexels URL for instructor image
    imageUrl: string; // Example Pexels URL
  };
  credits: number;
  duration: string; // e.g., "16 Weeks"
  enrollmentStatus: 'Enrolled' | 'Not Enrolled';
  overview: {
    description: string;
    learningOutcomes: string[];
    schedule: string;
  };
  syllabus: {
    title: string;
    downloadUrl: string; // Mock URL
    content: string; // Mock content
  };
  assignments: Assignment[];
  resources: Resource[];
  discussionForumUrl: string;
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: 'Due' | 'Submitted' | 'Graded'; // Student view
  grade?: number; // Student view
  submissions?: Submission[]; // Teacher view
}

export interface Submission {
  id: string;
  studentName: string;
  submittedAt: string;
  fileUrl: string; // Mock URL
  grade?: number;
}

export interface Resource {
  id: string;
  title: string;
  type: 'Document' | 'Link' | 'Video';
  url: string; // Mock URL
}

export type UserRole = 'student' | 'teacher';

// Mock Data
export const mockCourse: Course = {
  id: 'CS101',
  title: 'Introduction to Computer Science',
  code: 'CS101',
  instructor: {
    name: 'Dr. Alan Turing',
    imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Example Pexels URL
  },
  credits: 3,
  duration: '16 Weeks',
  enrollmentStatus: 'Enrolled',
  overview: {
    description: 'This course provides a comprehensive introduction to the fundamental concepts of computer science. Topics include programming basics, data structures, algorithms, and computational thinking. Designed for students with little to no prior programming experience.',
    learningOutcomes: [
      'Understand basic programming constructs (variables, loops, conditionals).',
      'Learn fundamental data structures (arrays, lists, trees).',
      'Analyze the efficiency of simple algorithms.',
      'Develop problem-solving skills using computational approaches.',
      'Write, debug, and test simple programs in a high-level language.',
    ],
    schedule: 'Lectures: Mon, Wed 10:00 AM - 11:30 AM\nLab: Fri 2:00 PM - 3:00 PM',
  },
  syllabus: {
    title: 'CS101 Syllabus',
    downloadUrl: '/mock-syllabus.pdf', // Placeholder
    content: `
      Course Title: Introduction to Computer Science
      Course Code: CS101
      Instructor: Dr. Alan Turing
      Credits: 3
      Duration: 16 Weeks

      Course Description:
      This course provides a comprehensive introduction to the fundamental concepts of computer science...

      Topics:
      Week 1: Introduction to Programming
      Week 2: Variables and Data Types
      Week 3: Control Flow (Conditionals)
      Week 4: Control Flow (Loops)
      Week 5: Functions
      Week 6: Introduction to Data Structures (Arrays)
      Week 7: Lists and Linked Lists
      Week 8: Recursion
      Week 9: Searching Algorithms
      Week 10: Sorting Algorithms
      Week 11: Introduction to Object-Oriented Programming
      Week 12: Classes and Objects
      Week 13: Inheritance and Polymorphism
      Week 14: File I/O
      Week 15: Introduction to Algorithms Analysis
      Week 16: Final Project Presentations

      Grading:
      Assignments: 40%
      Midterm Exam: 20%
      Final Exam: 30%
      Participation: 10%

      Policies:
      - Attendance is highly recommended.
      - Late assignments will be penalized.
      - Academic integrity is strictly enforced.
    `,
  },
  assignments: [
    { id: 'A1', title: 'Assignment 1: Basic Syntax', dueDate: '2025-09-15', status: 'Graded', grade: 95, submissions: [{ id: 'S1', studentName: 'Alice Smith', submittedAt: '2025-09-14', fileUrl: '/mock-submission-alice-a1.zip', grade: 95 }] },
    { id: 'A2', title: 'Assignment 2: Control Flow', dueDate: '2025-09-29', status: 'Submitted', submissions: [{ id: 'S2', studentName: 'Alice Smith', submittedAt: '2025-09-28', fileUrl: '/mock-submission-alice-a2.zip' }] },
    { id: 'A3', title: 'Assignment 3: Functions', dueDate: '2025-10-13', status: 'Due' },
    { id: 'A4', title: 'Assignment 4: Arrays', dueDate: '2025-10-27', status: 'Due' },
    { id: 'A5', title: 'Assignment 5: Linked Lists', dueDate: '2025-11-10', status: 'Due' },
    { id: 'A6', title: 'Assignment 6: Recursion', dueDate: '2025-11-24', status: 'Due' },
    { id: 'A7', title: 'Assignment 7: Sorting', dueDate: '2025-12-08', status: 'Due' },
  ],
  resources: [
    { id: 'R1', title: 'Recommended Textbook', type: 'Link', url: 'https://example.com/textbook' },
    { id: 'R2', title: 'Lecture Slides Week 1', type: 'Document', url: '/mock-slides-week1.pdf' },
    { id: 'R3', title: 'Lab 1 Instructions', type: 'Document', url: '/mock-lab1-instructions.pdf' },
    { id: 'R4', title: 'External Sorting Visualizer', type: 'Link', url: 'https://example.com/sorting-visualizer' },
    { id: 'R5', title: 'Introduction to Python Video', type: 'Video', url: 'https://www.youtube.com/watch?v=example' },
  ],
  discussionForumUrl: 'https://recyclezone.neocities.org/duscission/',
};

// Mock data for teacher view (more detailed submissions)
export const mockCourseTeacherView: Course = {
  ...mockCourse,
  assignments: mockCourse.assignments.map(assignment => ({
    ...assignment,
    // Add more mock submissions for teacher view
    submissions: assignment.submissions || [
      { id: `S-${assignment.id}-Alice`, studentName: 'Alice Smith', submittedAt: '2025-09-14', fileUrl: `/mock-submission-alice-${assignment.id}.zip`, grade: assignment.id === 'A1' ? 95 : undefined },
      { id: `S-${assignment.id}-Bob`, studentName: 'Bob Johnson', submittedAt: assignment.id === 'A1' ? '2025-09-15' : '2025-09-29', fileUrl: `/mock-submission-bob-${assignment.id}.zip`, grade: assignment.id === 'A1' ? 88 : undefined },
      { id: `S-${assignment.id}-Charlie`, studentName: 'Charlie Brown', submittedAt: assignment.id === 'A1' ? '2025-09-16' : '2025-09-30', fileUrl: `/mock-submission-charlie-${assignment.id}.zip`, grade: assignment.id === 'A1' ? 76 : undefined },
    ].filter(sub => assignment.status !== 'Due' || sub.studentName === 'Alice Smith'), // Only show Alice's submission if status is not 'Due'
  })),
};
