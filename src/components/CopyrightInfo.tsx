import React from 'react';

const CopyrightInfo: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="ml-4">
      <p className="text-sm text-gray-600">
        © Made with <span  className="text-xl font-bold text-red-500">♥️</span> by <span  className="text-xl font-bold">DarekRepos</span>. Bike route {currentYear}. All rights reserved.
      </p>
    </div>
  );
};

export default CopyrightInfo;
