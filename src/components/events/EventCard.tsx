import React, { useState } from 'react';
import type { Event } from '../../types';
import './EventCard.scss';
import EventDetailView from './EventDetailView';

interface EventCardProps {
    event: Event;
    onToggleFavorite: (eventId: string) => void;
    onDeleteEvent: (eventId: string) => void;
    onEditEvent: (event: Event) => void;
    isFavorited?: boolean;
    isDraftCard?: boolean;
    allEvents?: Event[];
    currentIndex?: number;
    favoritedEventIds?: string[];
}

const EventCard: React.FC<EventCardProps> = ({
    event,
    onToggleFavorite,
    onDeleteEvent,
    onEditEvent,
    isFavorited = false,
    isDraftCard = false,
    allEvents = [],
    currentIndex = -1,
    favoritedEventIds = []
}) => {
    const [showDetailView, setShowDetailView] = useState(false);
    const [currentEventIndex, setCurrentEventIndex] = useState<number>(currentIndex);
    const [currentEvent, setCurrentEvent] = useState<Event>(event);

    const handleLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleCardClick = () => {
        setShowDetailView(true);
        // If we have an index, use it; otherwise, try to find the event in allEvents
        if (currentIndex >= 0) {
            setCurrentEventIndex(currentIndex);
        } else if (allEvents.length > 0) {
            const index = allEvents.findIndex(e => e.id === event.id);
            setCurrentEventIndex(index >= 0 ? index : 0);
        }
        setCurrentEvent(event);
    };

    const handleCloseDetailView = () => {
        setShowDetailView(false);
        // Reset current event to the original event when closing the modal
        setCurrentEvent(event);
        // Reset index if needed
        if (currentIndex >= 0) {
            setCurrentEventIndex(currentIndex);
        }
    };

    const handleNavigateNext = () => {
        if (allEvents.length > 0 && currentEventIndex < allEvents.length - 1) {
            const nextIndex = currentEventIndex + 1;
            setCurrentEventIndex(nextIndex);
            setCurrentEvent(allEvents[nextIndex]);
        }
    };

    const handleNavigatePrev = () => {
        if (allEvents.length > 0 && currentEventIndex > 0) {
            const prevIndex = currentEventIndex - 1;
            setCurrentEventIndex(prevIndex);
            setCurrentEvent(allEvents[prevIndex]);
        }
    };

    // Format date
    const formattedDate = new Date(event.date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Split mood tags if present
    const moodTags = event.mood ? event.mood.split(',') : [];

    // Check if we can navigate
    const canNavigateNext = allEvents.length > 0 && currentEventIndex < allEvents.length - 1;
    const canNavigatePrev = allEvents.length > 0 && currentEventIndex > 0;

    // Check if current event is favorited
    const isCurrentEventFavorited = currentEvent.id === event.id 
        ? isFavorited 
        : favoritedEventIds.includes(currentEvent.id);

    return (
        <>
            <div 
                className={`event-card ${isDraftCard ? 'draft-card' : ''}`}
                onClick={handleCardClick}
            >
                {/* Image Container (16:9 ratio) with overlays */}
                <div className="event-card-image-wrapper">
                    <div className="event-card-image-container">
                        {event.imageUrl ? (
                            <img 
                                src={event.imageUrl} 
                                alt={event.place} 
                                className="event-card-image" 
                            />
                        ) : (
                            <div className="event-card-no-image">
                                <i className="fas fa-image"></i>
                            </div>
                        )}
                        
                        {/* Action buttons overlay */}
                        <div className="event-card-overlay-actions">
                            {/* Favorite Button */}
                            {!isDraftCard && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(event.id); }}
                                    className={`event-card-action-btn favorite ${isFavorited ? 'favorited' : ''}`}
                                    aria-label={isFavorited ? "Quitar de favoritos" : "Agregar a favoritos"}
                                >
                                    <i className="fas fa-star"></i>
                                </button>
                            )}
                            
                            {/* Edit Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); onEditEvent(event); }}
                                className="event-card-action-btn edit"
                                aria-label="Editar evento"
                            >
                                <i className="fas fa-edit"></i>
                            </button>
                            
                            {/* Delete Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeleteEvent(event.id); }}
                                className="event-card-action-btn delete"
                                aria-label="Eliminar evento"
                            >
                                <i className="fas fa-trash-alt"></i>
                            </button>
                        </div>
                        
                        {/* Title overlay - Nuevo posicionamiento del título */}
                        <div className="event-card-overlay-title">
                            <h3 className="event-card-title">{event.place}</h3>
                        </div>
                        
                       
                        
                        {/* Draft Badge if needed */}
                        {isDraftCard && (
                            <span className="event-card-draft-badge">Borrador</span>
                        )}
                    </div>
                </div>
                    
                {/* Event Content Section (below image) */}
                <div className="event-card-content">
                     {/* Mood Tags overlay */}
                     {moodTags.length > 0 && (
                            <div className="event-card-overlay-moods">
                                {moodTags.map((mood, index) => (
                                    <span key={index} className="event-card-mood-tag">
                                        {mood.trim()}
                                    </span>
                                ))}
                            </div>
                        )}
                    <div className="event-card-info">
                        <div className="event-info-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{event.city}</span>
                        </div>
                        <div className="event-info-item">
                            <i className="fas fa-calendar-alt"></i>
                            <span>{formattedDate}</span>
                        </div>
                        
                        {/* Entry Fee Information */}
                        <div className="event-info-item">
                            <i className="fas fa-ticket-alt"></i>
                            {(event as any).entryType === 'free' ? (
                                <span className="event-free-entry">Entrada gratuita</span>
                            ) : (event as any).coverFee ? (
                                <span className="event-cover-fee">Cover: {(event as any).coverFee}</span>
                            ) : (
                                <span>Precio no especificado</span>
                            )}
                        </div>
                        
                        {/* Link to event if available */}
                        {event.link && (
                            <a
                                href={event.link.startsWith('http') ? event.link : `http://${event.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleLinkClick}
                                className="event-card-link"
                            >
                                <i className="fas fa-external-link-alt"></i>
                                <span>Ver enlace</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Detailed Event View Modal */}
            {showDetailView && (
                <EventDetailView 
                    event={currentEvent}
                    onClose={handleCloseDetailView}
                    onToggleFavorite={onToggleFavorite}
                    isFavorited={isCurrentEventFavorited}
                    onNavigateNext={canNavigateNext ? handleNavigateNext : undefined}
                    onNavigatePrev={canNavigatePrev ? handleNavigatePrev : undefined}
                />
            )}
        </>
    );
};

export default EventCard; 