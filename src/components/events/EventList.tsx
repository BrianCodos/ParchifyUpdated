/** @jsx React.createElement */
/** @jsxFrag React.Fragment */
import React, { useState, useEffect } from 'react';
import type { Event } from '../../types';
import EventGrid from './EventGrid';
import './EventList.scss';

interface EventListProps {
    events: Event[];
    onToggleFavorite: (eventId: string) => void;
    onDeleteEvent: (eventId: string) => void;
    onEditEvent: (event: Event) => void;
    favoriteEvents: string[];
    moods?: string[];
}

const EventList: React.FC<EventListProps> = ({
    events,
    onToggleFavorite,
    onDeleteEvent,
    onEditEvent,
    favoriteEvents,
    moods = []
}) => {
    // States for search and filtering
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
    const [timeFilter, setTimeFilter] = useState('');
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    
    // Cities (could be fetched from API in a real app)
    const cities = ['Cali', 'Bogotá', 'Medellín', 'Barranquilla', 'Cartagena'];
    
    // Filter events based on search term, city, moods, and time
    useEffect(() => {
        let filtered = [...events];
        
        // Apply search filter
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(
                event => 
                    event.place.toLowerCase().includes(lowerCaseSearch) || 
                    event.city.toLowerCase().includes(lowerCaseSearch) ||
                    (event.notes && event.notes.toLowerCase().includes(lowerCaseSearch))
            );
        }
        
        // Apply city filter
        if (selectedCity) {
            filtered = filtered.filter(event => event.city === selectedCity);
        }
        
        // Apply mood filter
        if (selectedMoods.length > 0) {
            filtered = filtered.filter(event => {
                if (!event.mood) return false;
                const eventMoods = event.mood.split(',').map(m => m.trim());
                return selectedMoods.some(mood => eventMoods.includes(mood));
            });
        }
        
        // Apply time filter
        if (timeFilter) {
            filtered = filtered.filter(event => {
                if (!event.startTime) return false;
                
                // Handle different time filters
                const eventTime = new Date(`2000-01-01T${event.startTime}`).getHours();
                
                switch(timeFilter) {
                    case 'morning':
                        return eventTime >= 6 && eventTime < 12;
                    case 'afternoon':
                        return eventTime >= 12 && eventTime < 18;
                    case 'evening':
                        return eventTime >= 18 && eventTime < 22;
                    case 'night':
                        return eventTime >= 22 || eventTime < 6;
                    default:
                        return true;
                }
            });
        }
        
        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setFilteredEvents(filtered);
    }, [events, searchTerm, selectedCity, selectedMoods, timeFilter]);
    
    // Toggle mood selection
    const toggleMoodFilter = (mood: string) => {
        if (selectedMoods.includes(mood)) {
            setSelectedMoods(selectedMoods.filter(m => m !== mood));
        } else {
            setSelectedMoods([...selectedMoods, mood]);
        }
    };
    
    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCity('');
        setSelectedMoods([]);
        setTimeFilter('');
    };

// Sección principal de la lista de eventos
return (
    <section className="event-list-container">
        {/* Sección de encabezado */}
        <header className="event-list-header">
            <h1 className="event-list-title">Despachado? En Parchiify tenemos un plan perfecto para ti</h1>
        </header>
        {/* Search container */}
        <div className="search-container-wrapper">
            <div className="search-container">
                <i className="fas fa-search search-icon"></i>
                <input
                    type="text"
                    placeholder="Buscar eventos por nombre o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                {searchTerm && (
                    <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
                        <i className="fas fa-times"></i>
                    </button>
                )}
                
            </div>
            {/* <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="filter-select"
            >
                <option value="">Todas las ciudades</option>
                {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                ))}
            </select> */}
            <button className="primary-btn">
                Buscame el mejor plan
            </button>
                {/* Buscar por mood */}
                <h1 className='mood-filter-title'>Buscada por mood</h1>
         {/* Sección de filtro por Mood */}
            <div className="mood-filter-container">
                <div className="mood-filter-options">
                    {moods.map(mood => (
                       
                             <button
                            key={mood}
                            className={`mood-filter-btn ${selectedMoods.includes(mood) ? 'active' : ''}`}
                            onClick={() => toggleMoodFilter(mood)}
                            data-mood={mood}
                        >
                            {mood}
                        </button>
                        
                       
                    ))}
                </div>
            </div>
        </div>


           
        
        {/* Sección de resultados */}
        <div className="event-list-content">
            <EventGrid 
                events={filteredEvents}
                onToggleFavorite={onToggleFavorite}
                onDeleteEvent={onDeleteEvent}
                onEditEvent={onEditEvent}
                favoriteEvents={favoriteEvents}
                emptyStateComponent={
                    <div className="event-empty-state">
                        <div className="event-empty-icon">
                            <i className="fas fa-calendar-day"></i>
                        </div>
                        {events.length === 0 ? (
                            <>
                                <p className="event-empty-text">No hay eventos registrados.</p>
                                <p className="event-empty-help">Crea tu primer evento utilizando el botón "Nuevo Evento".</p>
                            </>
                        ) : (
                            <>
                                <p className="event-empty-text">No se encontraron eventos con los filtros actuales.</p>
                                <p className="event-empty-help">
                                    Prueba con otros criterios de búsqueda o{' '}
                                    <button className="reset-search-btn" onClick={clearFilters}>
                                        elimina los filtros
                                    </button>.
                                </p>
                            </>
                        )}
                    </div>
                }
            />
        </div>
    </section>
);
};

export default EventList; 