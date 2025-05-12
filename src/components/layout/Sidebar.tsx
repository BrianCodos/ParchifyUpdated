import React, { useState, useEffect } from 'react';
import './Sidebar.scss';
import type { ViewType } from '../../types';

interface SidebarProps {
    setCurrentView: (view: ViewType) => void;
    currentView: ViewType;
    setEditingEvent: (event: any) => void;
    onNewEvent?: () => void;
    // Counts for different sections
    counts?: {
        events?: number;
        calendar?: number;
        favorites?: number;
        drafts?: number;
        moods?: number;
    };
}

const Sidebar: React.FC<SidebarProps> = ({
    setCurrentView,
    currentView,
    setEditingEvent,
    onNewEvent,
    counts = {}
}) => {
    // Estado local para controlar si el sidebar está colapsado
    const [isCollapsed, setIsCollapsed] = useState(false);
    // Para pantallas pequeñas, inicializar como colapsado
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            }
        };
        
        // Verificar tamaño inicial
        handleResize();
        
        // Agregar listener para cambios de tamaño
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    
    // URL de imagen aleatoria para el avatar
    const avatarUrl = "https://randomuser.me/api/portraits/men/32.jpg";
    
    const handleViewChange = (view: ViewType) => {
        setCurrentView(view);
        setEditingEvent(null);
    };
    
    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleProfileOptions = () => {
        setShowProfileOptions(!showProfileOptions);
    };

    const handleNewEventClick = () => {
        if (onNewEvent) {
            onNewEvent();
        }
    };

    // Manejador para ir al perfil
    const handleProfileClick = () => {
        setCurrentView('profile' as ViewType);
        setEditingEvent(null);
    };

    // Helper to render count badge if count exists and is greater than 0
    const renderCountBadge = (count?: number) => {
        if (count && count > 0) {
            return <span className="sidebar-item-count">{count}</span>;
        }
        return null;
    };

    // Determinando la clase CSS para el sidebar
    // La clase 'expanded-mobile' se aplica en móvil cuando no está colapsado
    const isMobile = window.innerWidth < 768;
    const sidebarClass = `sidebar ${isCollapsed ? 'collapsed' : isMobile ? 'expanded-mobile' : ''}`;

    return (
        <aside className={sidebarClass}>
            <div className="sidebar-container">
                <div className="sidebar-header">
                    <div className="sidebar-header-content">
                        {/* Botones en la misma fila - controles de la barra lateral */}
                        <button 
                            onClick={toggleCollapse}
                            className="sidebar-collapse-button"
                            aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                            title={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                        >
                            <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
                        </button>
                        
                        <button
                            onClick={handleNewEventClick}
                            className="sidebar-add-button"
                        >
                            <i className="fas fa-plus sidebar-add-icon"></i>
                            <span className="sidebar-label">Nuevo Evento</span>
                        </button>
                    </div>
                </div>

                <div className="sidebar-divider"></div>

                <div className="sidebar-body styled-scrollbar">
                    <nav className="sidebar-nav">
                        {[
                            { view: 'list-cards', label: 'Descubrir Eventos', icon: 'fas fa-clipboard-list' },
                            { view: 'list-table', label: 'Mis Eventos', icon: 'fas fa-table', count: counts.events },
                            { view: 'calendar', label: 'Calendario', icon: 'fas fa-calendar-alt', count: counts.calendar },
                            { view: 'saved', label: 'Favoritos', icon: 'fas fa-star', count: counts.favorites },
                            { view: 'drafts', label: 'Borradores', icon: 'fas fa-file-alt', count: counts.drafts },
                            { view: 'dashboard', label: 'Moods', icon: 'fas fa-chart-bar', count: counts.moods },
                            // Perfil como último elemento del menú
                            { view: 'profile', label: 'Mi Perfil', icon: '', isProfile: true }
                        ].map((item, index) => (
                            <button
                                key={item.view}
                                onClick={() => handleViewChange(item.view as ViewType)}
                                className={`sidebar-nav-item ${currentView === item.view ? 'active' : ''} ${item.isProfile ? 'profile-nav-item' : ''}`}
                                title={item.label}
                            >
                                {item.isProfile ? (
                                    <img src={avatarUrl} alt="Perfil" className="sidebar-nav-avatar" />
                                ) : (
                                    <i className={`${item.icon} sidebar-nav-icon ${currentView === item.view ? 'active' : ''}`}></i>
                                )}
                                <span className="sidebar-label">{item.label}</span>
                                {renderCountBadge(item.count)}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar; 