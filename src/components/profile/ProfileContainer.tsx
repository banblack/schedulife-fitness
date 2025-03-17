
import React from "react";

interface ProfileContainerProps {
  children: React.ReactNode;
}

export const ProfileContainer = ({ children }: ProfileContainerProps) => {
  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto animate-fade-in bg-gradient-to-b from-primary/5 to-transparent rounded-lg">
      {children}
    </div>
  );
};
