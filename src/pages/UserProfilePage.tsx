import React, { useState, useEffect } from 'react';
import './UserProfilePage.scss';

// Tipo de datos para el perfil de usuario
interface UserProfile {
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: string;
  ciudad: string;
  gustos: {
    tiposPlanes: string[];
    generosMusicales: string[];
    noMeInteresa: string[];
  };
  acercaDeMi: string;
  fotoPerfil: string;
}

// Valores por defecto/iniciales del perfil
const defaultProfile: UserProfile = {
  nombre: '',
  apellidos: '',
  fechaNacimiento: '',
  genero: '',
  ciudad: '',
  gustos: {
    tiposPlanes: [],
    generosMusicales: [],
    noMeInteresa: []
  },
  acercaDeMi: '',
  fotoPerfil: 'https://randomuser.me/api/portraits/men/32.jpg' // Imagen por defecto
};

// Opciones predefinidas para los campos de selección múltiple
const opcionesTiposPlanes = ['Comer', 'Bailar', 'Conocer nuevos lugares', 'Deportes', 'Cine', 'Conciertos'];
const opcionesGenerosMusicales = ['Rock', 'Pop', 'Reggaeton', 'Electrónica', 'Jazz', 'Hip Hop', 'Salsa', 'Bachata'];

const UserProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    // Intentar cargar el perfil desde localStorage
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);
  const [newPlanType, setNewPlanType] = useState('');
  const [newMusicGenre, setNewMusicGenre] = useState('');
  const [newDisinterest, setNewDisinterest] = useState('');

  // Guardar cambios en localStorage cuando el perfil cambia
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  // Manejador para cambios en campos de texto
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejador para la carga de la foto de perfil
  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfile(prev => ({
          ...prev,
          fotoPerfil: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejadores para campos de tipo array (gustos)
  const handleAddItem = (category: 'tiposPlanes' | 'generosMusicales' | 'noMeInteresa', item: string) => {
    if (item && !tempProfile.gustos[category].includes(item)) {
      setTempProfile(prev => ({
        ...prev,
        gustos: {
          ...prev.gustos,
          [category]: [...prev.gustos[category], item]
        }
      }));
    }

    // Limpiar el campo después de añadir
    if (category === 'tiposPlanes') setNewPlanType('');
    else if (category === 'generosMusicales') setNewMusicGenre('');
    else setNewDisinterest('');
  };

  const handleRemoveItem = (category: 'tiposPlanes' | 'generosMusicales' | 'noMeInteresa', item: string) => {
    setTempProfile(prev => ({
      ...prev,
      gustos: {
        ...prev.gustos,
        [category]: prev.gustos[category].filter(i => i !== item)
      }
    }));
  };

  // Guardar cambios del perfil
  const handleSaveProfile = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  // Cancelar cambios
  const handleCancelEdit = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  // Iniciar edición
  const handleStartEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  return (
    <div className="user-profile-page">
      <div className="profile-container glass-effect">
        <div className="profile-header">
          <h1 className="heading-page">Perfil de Usuario</h1>
          {!isEditing ? (
            <button className="button button-primary" onClick={handleStartEdit}>
              <i className="fas fa-edit"></i> Editar Perfil
            </button>
          ) : (
            <div className="d-flex gap-md">
              <button className="button button-secondary" onClick={handleCancelEdit}>
                <i className="fas fa-times"></i> Cancelar
              </button>
              <button className="button button-primary" onClick={handleSaveProfile}>
                <i className="fas fa-save"></i> Guardar
              </button>
            </div>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-main">
            {/* Foto de perfil */}
            <div className="profile-photo-section">
              <div className="profile-photo-container">
                <img src={isEditing ? tempProfile.fotoPerfil : profile.fotoPerfil} alt="Foto de perfil" className="profile-photo" />
              </div>
              {isEditing && (
                <div className="profile-photo-upload">
                  <label htmlFor="profile-photo-input" className="button button-secondary">
                    <i className="fas fa-camera"></i> Cambiar foto
                  </label>
                  <input 
                    type="file" 
                    id="profile-photo-input" 
                    accept="image/*" 
                    onChange={handleProfilePhotoUpload} 
                    className="profile-photo-input hidden"
                  />
                </div>
              )}
            </div>

            {/* Información básica */}
            <div className="profile-info-section">
              <div className="profile-field-group">
                <div className="form-group">
                  <label className="form-label">Nombre</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="nombre" 
                      value={tempProfile.nombre} 
                      onChange={handleInputChange} 
                      placeholder="Tu nombre"
                      className="form-control"
                    />
                  ) : (
                    <p className="text-body">{profile.nombre || 'No especificado'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Apellidos</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="apellidos" 
                      value={tempProfile.apellidos} 
                      onChange={handleInputChange} 
                      placeholder="Tus apellidos"
                      className="form-control"
                    />
                  ) : (
                    <p className="text-body">{profile.apellidos || 'No especificado'}</p>
                  )}
                </div>
              </div>

              <div className="profile-field-group">
                <div className="form-group">
                  <label className="form-label">Fecha de Nacimiento</label>
                  {isEditing ? (
                    <input 
                      type="date" 
                      name="fechaNacimiento" 
                      value={tempProfile.fechaNacimiento} 
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    <p className="text-body">{profile.fechaNacimiento || 'No especificado'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Género</label>
                  {isEditing ? (
                    <select 
                      name="genero" 
                      value={tempProfile.genero} 
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="">Selecciona...</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="No binario">No binario</option>
                      <option value="Prefiero no decir">Prefiero no decir</option>
                    </select>
                  ) : (
                    <p className="text-body">{profile.genero || 'No especificado'}</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Ciudad</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="ciudad" 
                    value={tempProfile.ciudad} 
                    onChange={handleInputChange} 
                    placeholder="Tu ciudad"
                    className="form-control"
                  />
                ) : (
                  <p className="text-body">{profile.ciudad || 'No especificado'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sección "Acerca de mí" */}
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Acerca de mí</h2>
            </div>
            <div className="panel-body">
              {isEditing ? (
                <textarea 
                  name="acercaDeMi" 
                  value={tempProfile.acercaDeMi} 
                  onChange={handleInputChange} 
                  placeholder="Cuéntanos sobre ti..."
                  className="form-control"
                ></textarea>
              ) : (
                <div className="profile-about-text">
                  {profile.acercaDeMi || 'No hay información disponible.'}
                </div>
              )}
            </div>
          </div>

          {/* Sección "Mis gustos" */}
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Mis gustos</h2>
            </div>
            <div className="panel-body">
              <div className="profile-preference-category mb-xl">
                <h3 className="heading-category">Tipos de planes</h3>
                <div className="profile-tags-container">
                  {(isEditing ? tempProfile : profile).gustos.tiposPlanes.map((plan, index) => (
                    <div key={index} className="tag">
                      <span>{plan}</span>
                      {isEditing && (
                        <button onClick={() => handleRemoveItem('tiposPlanes', plan)} className="tag-remove">
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {isEditing && (
                    <div className="profile-tag-add">
                      <select 
                        value={newPlanType} 
                        onChange={(e) => setNewPlanType(e.target.value)}
                        className="form-control"
                      >
                        <option value="">Seleccionar...</option>
                        {opcionesTiposPlanes.filter(
                          option => !tempProfile.gustos.tiposPlanes.includes(option)
                        ).map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => handleAddItem('tiposPlanes', newPlanType)}
                        disabled={!newPlanType}
                        className="button button-primary button-sm"
                      >
                        <i className="fas fa-plus"></i> Añadir
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="profile-preference-category mb-xl">
                <h3 className="heading-category">Géneros musicales</h3>
                <div className="profile-tags-container">
                  {(isEditing ? tempProfile : profile).gustos.generosMusicales.map((genero, index) => (
                    <div key={index} className="tag">
                      <span>{genero}</span>
                      {isEditing && (
                        <button onClick={() => handleRemoveItem('generosMusicales', genero)} className="tag-remove">
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {isEditing && (
                    <div className="profile-tag-add">
                      <select 
                        value={newMusicGenre} 
                        onChange={(e) => setNewMusicGenre(e.target.value)}
                        className="form-control"
                      >
                        <option value="">Seleccionar...</option>
                        {opcionesGenerosMusicales.filter(
                          option => !tempProfile.gustos.generosMusicales.includes(option)
                        ).map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => handleAddItem('generosMusicales', newMusicGenre)}
                        disabled={!newMusicGenre}
                        className="button button-primary button-sm"
                      >
                        <i className="fas fa-plus"></i> Añadir
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="profile-preference-category">
                <h3 className="heading-category">No me interesa</h3>
                <div className="profile-tags-container">
                  {(isEditing ? tempProfile : profile).gustos.noMeInteresa.map((item, index) => (
                    <div key={index} className="tag tag-danger">
                      <span>{item}</span>
                      {isEditing && (
                        <button onClick={() => handleRemoveItem('noMeInteresa', item)} className="tag-remove">
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {isEditing && (
                    <div className="profile-tag-add">
                      <input 
                        type="text" 
                        value={newDisinterest} 
                        onChange={(e) => setNewDisinterest(e.target.value)}
                        placeholder="Añadir..."
                        className="form-control"
                      />
                      <button 
                        onClick={() => handleAddItem('noMeInteresa', newDisinterest)}
                        disabled={!newDisinterest}
                        className="button button-primary button-sm"
                      >
                        <i className="fas fa-plus"></i> Añadir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage; 