import React, { useState, useEffect } from 'react';
import '../styles/ToggleButton.css'; 

interface ToggleButtonProps {
  option1Label: string;
  option2Label: string;
  onToggleChange?: (option: string) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ option1Label, option2Label, onToggleChange }) => {
  const [selectedOption, setSelectedOption] = useState(option1Label);

  useEffect(() => {
    setSelectedOption(option1Label);
  }, [option1Label]);

  const handleToggle = (option: string) => {
    setSelectedOption(option);
    if (onToggleChange) {
      onToggleChange(option);
    }
  };

  return (
    <div className="toggle-button-container">
      <button
        className={`toggle-option ${selectedOption === option1Label ? 'selected' : ''}`}
        onClick={() => handleToggle(option1Label)}
      >
        {option1Label}
      </button>
      <button
        className={`toggle-option ${selectedOption === option2Label ? 'selected' : ''}`}
        onClick={() => handleToggle(option2Label)}
      >
        {option2Label}
      </button>
    </div>
  );
};

export default ToggleButton;