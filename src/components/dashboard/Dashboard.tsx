import React, { useState } from 'react';
import './Dashboard.scss';

interface DashboardProps {
  moods: string[];
  onAddMood: (moodName: string) => void;
  onDeleteMood: (moodName: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ moods, onAddMood, onDeleteMood }) => {
  const [newMood, setNewMood] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMood.trim()) {
      onAddMood(newMood.trim());
      setNewMood('');
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="heading-hero text-center">Dashboard</h1>
      <p className="text-secondary text-center mb-2xl">
        Administra tus preferencias y visualiza estadísticas
      </p>

      <section className="section">
        <div className="section-header">
          <i className="fas fa-heart section-header-icon"></i>
          <h2 className="section-header-title">Mis Moods</h2>
        </div>
        <p className="text-body mb-xl">
          Los moods te ayudan a encontrar eventos según tu estado de ánimo o ganas. Agrega los que necesites.
        </p>

        <form onSubmit={handleSubmit} className="d-flex gap-sm mb-xl">
          <input
            type="text"
            value={newMood}
            onChange={(e) => setNewMood(e.target.value)}
            placeholder="Agregar nuevo mood..."
            className="form-control"
            aria-label="Nombre del nuevo mood"
          />
          <button type="submit" className="button button-primary">
            <i className="fas fa-plus"></i> Agregar
          </button>
        </form>

        <div className="mood-list">
          {moods.length > 0 ? (
            moods.map((mood, index) => (
              <div key={index} className="card card-compact">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <span className="text-body">{mood}</span>
                  <button
                    onClick={() => onDeleteMood(mood)}
                    className="button button-icon"
                    aria-label={`Eliminar mood ${mood}`}
                  >
                    <i className="fas fa-trash-alt text-color-tertiary"></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="panel text-center p-xl">
              <i className="fas fa-fire-alt fs-2xl mb-md text-color-tertiary"></i>
              <p className="text-secondary">No has agregado ningún mood todavía</p>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <i className="fas fa-chart-line section-header-icon"></i>
          <h2 className="section-header-title">Estadísticas</h2>
        </div>
        <p className="text-body mb-xl">
          Aquí podrás visualizar estadísticas sobre tus eventos y actividad
        </p>

        <div className="panel text-center">
          <i className="fas fa-chart-bar fs-3xl mb-md text-color-tertiary"></i>
          <p className="text-secondary">Las estadísticas estarán disponibles próximamente</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard; 