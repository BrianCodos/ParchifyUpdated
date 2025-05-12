import React, { useState, useCallback } from 'react';
import type { Event } from '../../types';
import CalendarEventCard from './CalendarEventCard';
import './CalendarView.scss';

interface CalendarViewProps {
    events: Event[];
    calendarDate: Date;
    setCalendarDate: (date: Date) => void;
    onToggleFavorite: (eventId: string) => void;
    onEditEvent: (event: Event) => void;
    favoriteEvents: string[];
}

const CalendarView: React.FC<CalendarViewProps> = ({
    events,
    calendarDate,
    setCalendarDate,
    onToggleFavorite,
    onEditEvent,
    favoriteEvents
}) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedDayEvents, setSelectedDayEvents] = useState<Event[] | null>(null);

    const handleDaySelect = (dateString: string, dayEvents: Event[]) => {
        setSelectedDate(dateString);
        setSelectedDayEvents(dayEvents.length > 0 ? dayEvents : null);
    };

    const renderCalendarGrid = useCallback(() => {
        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let startingDayOfWeek = firstDayOfMonth.getDay();

        const dayCells = [];
        const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

        dayNames.forEach(name => {
            dayCells.push(
                <div
                    key={`name-${name}`}
                    className="calendar-day-name"
                >
                    {name}
                </div>
            );
        });

        for (let i = 0; i < startingDayOfWeek; i++) {
            const prevMonth = month === 0 ? 11 : month - 1;
            const prevYear = month === 0 ? year - 1 : year;
            const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
            const prevMonthDay = daysInPrevMonth - startingDayOfWeek + i + 1;
            
            dayCells.push(
                <div
                    key={`empty-start-${i}`}
                    className="calendar-day other-month"
                >
                    <span className="calendar-day-number text-gray-600">
                        {prevMonthDay}
                    </span>
                </div>
            );
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDateIter = new Date(year, month, day);
            currentDateIter.setHours(0, 0, 0, 0);
            const isToday = currentDateIter.getTime() === today.getTime();
            const dateStringForComparison = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const eventsOnThisDay = events.filter(event => event.date === dateStringForComparison);
            const isSelectedDate = selectedDate === dateStringForComparison;

            let dayClasses = `calendar-day${isToday ? ' today' : ''}${isSelectedDate ? ' selected' : ''}`;

            dayCells.push(
                <div
                    key={`day-${day}`}
                    className={dayClasses}
                    onClick={() => handleDaySelect(dateStringForComparison, eventsOnThisDay)}
                >
                    <span className={`calendar-day-number${isToday ? ' today' : ''}`}>
                        {day}
                    </span>
                    <div className="calendar-events">
                        {eventsOnThisDay.slice(0, 3).map(event => (
                            <div
                                key={event.id}
                                title={event.place}
                                className="calendar-event"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDaySelect(dateStringForComparison, eventsOnThisDay);
                                }}
                            >
                                {favoriteEvents.includes(event.id) && (
                                    <i className="fas fa-star event-favorite-star"></i>
                                )}
                                <span className="event-name">{event.place}</span>
                            </div>
                        ))}
                        {eventsOnThisDay.length > 3 && (
                            <div className="calendar-event-more">
                                +{eventsOnThisDay.length - 3} más
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        const totalCellsRendered = startingDayOfWeek + daysInMonth;
        const remainingCells = (7 - (totalCellsRendered % 7)) % 7;

        for (let i = 1; i <= remainingCells; i++) {
            dayCells.push(
                <div
                    key={`empty-end-${i}`}
                    className="calendar-day other-month"
                >
                    <span className="calendar-day-number text-gray-600">
                        {i}
                    </span>
                </div>
            );
        }

        return dayCells;
    }, [calendarDate, events, favoriteEvents, selectedDate]);

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Format selected date for display
    const formattedSelectedDate = selectedDate 
        ? new Date(selectedDate + "T00:00:00").toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
        : null;

    return (
        <section className="calendar-container">
            <header className="calendar-header">
                <h1 className="heading-hero text-center">Calendario de Eventos</h1>
                
            </header>
            <div className="calendar-controls">
                    <button
                        onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
                        className="calendar-nav-button"
                    >
                        <i className="fas fa-chevron-left"></i>
                        <span className="hidden-mobile">Mes Anterior</span>
                    </button>
                    <h2 className="calendar-month-label">
                        {`${monthNames[calendarDate.getMonth()]} ${calendarDate.getFullYear()}`}
                    </h2>
                    <button
                        onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
                        className="calendar-nav-button"
                    >
                        <span className="hidden-mobile">Mes Siguiente</span>
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            <div className="calendar-layout">
                
                {/* Main Calendar (2 columns) */}
                <div className="calendar-main-section">
                    <div className="calendar-grid">
                        {renderCalendarGrid()}
                    </div>
                </div>
                
                {/* Events Sidebar (1 column) */}
                <div className="calendar-sidebar">
                    {selectedDate ? (
                        <div className="calendar-day-events">
                            <h3 className="calendar-day-events-header">
                                Eventos del {formattedSelectedDate}:
                            </h3>
                            
                            {selectedDayEvents && selectedDayEvents.length > 0 ? (
                                <div className="calendar-day-events-list">
                                    {selectedDayEvents.map(event => (
                                        <CalendarEventCard
                                            key={event.id}
                                            event={event}
                                            onToggleFavorite={onToggleFavorite}
                                            isFavorited={favoriteEvents.includes(event.id)}
                                            onSelectEvent={onEditEvent}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="calendar-day-events-empty">
                                    <p>No hay eventos para este día.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="calendar-day-events-placeholder">
                            <div className="calendar-placeholder-icon">
                                <i className="fas fa-calendar-day"></i>
                            </div>
                            <p className="calendar-placeholder-text">Selecciona un día para ver sus eventos.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CalendarView; 