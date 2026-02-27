import React from 'react';
import { EgyptianPeriod, HistoricalLocation } from '../data/egyptianPeriods';
import './InteractiveMap.css';

// Update the props to accept the new selection logic from the parent
interface InteractiveMapProps {
  period: EgyptianPeriod;
  onLocationSelect: (location: HistoricalLocation | null) => void;
  selectedLocation: HistoricalLocation | null;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ period, onLocationSelect, selectedLocation }) => {
  return (
    <div className="map-container">
      {period.locations.map(location => {
        // A location is active if its ID matches the selectedLocation from the parent
        const isActive = selectedLocation?.id === location.id;

        return (
          <div
            key={location.id}
            // Add a title attribute for a simple native tooltip on hover
            title={location.name}
            // The 'active' class will now be controlled by the parent's state
            className={`location-marker ${isActive ? 'active' : ''}`}
            style={{ left: `${location.coordinates.x}%`, top: `${location.coordinates.y}%` }}
            // When a marker is clicked, call the function passed from the parent
            // This allows the parent to control the state, e.g., showing the sidebar card
            onClick={() => onLocationSelect(isActive ? null : location)}
          >
            {/* The pop-up card is no longer here. It's now handled by the parent component. */}
          </div>
        );
      })}
    </div>
  );
};

export default InteractiveMap;
