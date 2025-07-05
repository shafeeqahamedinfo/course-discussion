import React from 'react';
import { MessageSquare } from 'lucide-react';

interface DiscussionLinkProps {
  url: string;
}

const DiscussionLink: React.FC<DiscussionLinkProps> = ({ url }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-6 py-3 bg-secondary text-white font-semibold rounded-lg shadow hover:bg-secondary/90 transition-colors duration-200"
    >
      <MessageSquare size={20} className="mr-2" />
      Join Discussion Forum
    </a>
  );
};

export default DiscussionLink;
