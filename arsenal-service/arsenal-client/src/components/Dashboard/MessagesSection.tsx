import React from 'react';

interface MessagesSectionProps {
  onUnreadCountChange: (count: number) => void;
}

export const MessagesSection: React.FC<MessagesSectionProps> = ({ onUnreadCountChange }) => {
  return (
    <div>
      <h2>Сообщения</h2>
      <p>Раздел в разработке...</p>
    </div>
  );
}; 