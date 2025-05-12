import React, { useState, useEffect, useRef } from 'react';
import type { Event, EventFormData } from '../../types';
import './EventForm.scss';

interface EventFormProps {
    onAddEvent: (event: Event) => void;
    onSaveDraft: (draft: Event) => void;
    onCancel: () => void;
    allMoods: string[];
    initialData?: Event;
}

const EventForm: React.FC<EventFormProps> = ({
    onAddEvent,
    onSaveDraft,
    onCancel,
    allMoods,
    initialData
}) => {
    const [formData, setFormData] = useState<EventFormData>(() => {
        const defaults: EventFormData = {
            place: '',
            city: '',
            date: '',
            startTime: '',
            endTime: '',
            isFree: true,
            link: '',
            mood: '',
            notes: '',
            imageUrl: '',
            entryType: 'Gratuito',
            coverFee: '',
            selectedMoods: [],
            notifications: []
        };
        return initialData ? { 
            ...defaults, 
            ...initialData,
            selectedMoods: initialData.mood ? initialData.mood.split(',') : []
        } : defaults;
    });

    const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showNotificationOptions, setShowNotificationOptions] = useState(false);

    useEffect(() => {
        if (initialData) {
            const defaults: EventFormData = {
                place: '', city: '', date: '', startTime: '', endTime: '', isFree: true, link: '', mood: '', notes: '', imageUrl: '',
                entryType: 'Gratuito', coverFee: '', selectedMoods: [], notifications: []
            };
            const updatedData = { 
                ...defaults, 
                ...initialData,
                selectedMoods: initialData.mood ? initialData.mood.split(',') : [] 
            };
            setFormData(updatedData);
            setImagePreview(initialData.imageUrl || null);
            if (initialData.date) {
                setShowNotificationOptions(true);
            }
        } else {
            setFormData({
                place: '', city: '', date: '', startTime: '', endTime: '', isFree: true, link: '', mood: '', notes: '', imageUrl: '',
                entryType: 'Gratuito', coverFee: '', selectedMoods: [], notifications: []
            });
            setImagePreview(null);
            setShowNotificationOptions(false);
        }
    }, [initialData]);

    // Efecto para mostrar opciones de notificación cuando se selecciona una fecha
    useEffect(() => {
        if (formData.date) {
            setShowNotificationOptions(true);
        } else {
            setShowNotificationOptions(false);
        }
    }, [formData.date]);

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof EventFormData, string>> = {};
        if (!formData.place.trim()) newErrors.place = 'El lugar es requerido';
        if (!formData.city.trim()) newErrors.city = 'La ciudad es requerida';
        if (!formData.date) newErrors.date = 'La fecha es requerida';
        if (!formData.startTime) newErrors.startTime = 'La hora de inicio es requerida';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const eventData: Event = {
                ...formData,
                id: initialData?.id || Date.now().toString(),
                mood: formData.selectedMoods?.join(',') || '',
                notifications: formData.notifications
            };
            onAddEvent(eventData);
        }
    };

    const handleSaveDraft = () => {
        const draftData: Event = {
            ...formData,
            id: initialData?.id || Date.now().toString(),
            isDraft: true,
            mood: formData.selectedMoods?.join(',') || '',
            notifications: formData.notifications
        };
        onSaveDraft(draftData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof EventFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleToggleFree = () => {
        setFormData(prev => {
            const newIsFree = !prev.isFree;
            return { 
                ...prev, 
                isFree: newIsFree,
                coverFee: newIsFree ? '' : prev.coverFee 
            };
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                cropImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const cropImage = (imageSrc: string) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const targetWidth = 1080;
            const targetHeight = 1035;
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const imgAspectRatio = img.width / img.height;
            const targetAspectRatio = targetWidth / targetHeight;

            let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;

            if (imgAspectRatio > targetAspectRatio) {
                sWidth = img.height * targetAspectRatio;
                sx = (img.width - sWidth) / 2;
            } else if (imgAspectRatio < targetAspectRatio) {
                sHeight = img.width / targetAspectRatio;
                sy = (img.height - sHeight) / 2;
            }

            ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
            const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            setImagePreview(croppedDataUrl);
            setFormData(prev => ({ ...prev, imageUrl: croppedDataUrl }));
        };
        img.src = imageSrc;
    };
    
    const toggleMood = (mood: string) => {
        setFormData(prev => {
            const selectedMoods = prev.selectedMoods || [];
            if (selectedMoods.includes(mood)) {
                return { 
                    ...prev, 
                    selectedMoods: selectedMoods.filter((m: string) => m !== mood) 
                };
            } else {
                if (selectedMoods.length >= 5) {
                    return prev; // Max 5 moods
                }
                return { 
                    ...prev, 
                    selectedMoods: [...selectedMoods, mood] 
                };
            }
        });
    };

    const toggleNotification = (option: string) => {
        setFormData((prev: EventFormData) => {
            const notifications = prev.notifications || [];
            if (notifications.includes(option)) {
                return {
                    ...prev,
                    notifications: notifications.filter((n: string) => n !== option)
                };
            } else {
                return {
                    ...prev,
                    notifications: [...notifications, option]
                };
            }
        });
    };
    
    // Función para calcular si una opción de notificación debe estar disponible
    const isNotificationOptionAvailable = (option: string): boolean => {
        if (!formData.date) return false;
        
        const eventDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const timeDiff = eventDate.getTime() - today.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);
        
        if (option === 'En el momento') return true;
        if (option === 'Una hora antes') return daysDiff >= 0;
        if (option === 'Un día antes') return daysDiff >= 1;
        if (option === 'Una semana antes') return daysDiff >= 7;
        
        return false;
    };
    
    return (
        <div className="event-form-container">
            <h2 className="event-form-title">
                {initialData ? 'Editar Evento' : 'Añadir Nuevo Evento'}
            </h2>
            
            <form onSubmit={handleSubmit}>
                <div className="event-form-grid">
                    <div className="event-form-column">
                        <div className="form-group">
                            <label htmlFor="place">Lugar/Nombre:</label>
                            <input
                                type="text"
                                id="place"
                                name="place"
                                value={formData.place}
                                onChange={handleChange}
                                className={errors.place ? "form-input error" : "form-input"}
                            />
                            {errors.place && <p className="error-message">{errors.place}</p>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="city">Ciudad:</label>
                            <select
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={errors.city ? "form-select error" : "form-select"}
                            >
                                <option value="">Seleccionar ciudad</option>
                                <option value="Cali">Cali</option>
                                <option value="Bogotá">Bogotá</option>
                                <option value="Medellín">Medellín</option>
                                <option value="Barranquilla">Barranquilla</option>
                                <option value="Cartagena">Cartagena</option>
                            </select>
                            {errors.city && <p className="error-message">{errors.city}</p>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="notes">Descripción (Opcional):</label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes || ''}
                                onChange={handleChange}
                                rows={5}
                                className="form-textarea"
                            />
                        </div>
                    </div>
                    
                    <div className="event-form-column">
                        <div className="form-group">
                            <label htmlFor="date">Fecha:</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className={errors.date ? "form-input error" : "form-input"}
                                placeholder="mm/dd/yyyy"
                            />
                            {errors.date && <p className="error-message">{errors.date}</p>}
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label htmlFor="startTime">Hora de inicio:</label>
                                <input
                                    type="time"
                                    id="startTime"
                                    name="startTime"
                                    value={formData.startTime || ''}
                                    onChange={handleChange}
                                    className={errors.startTime ? "form-input error" : "form-input"}
                                />
                                {errors.startTime && <p className="error-message">{errors.startTime}</p>}
                            </div>
                            
                            <div className="form-group half">
                                <label htmlFor="endTime">Hora de fin:</label>
                                <input
                                    type="time"
                                    id="endTime"
                                    name="endTime"
                                    value={formData.endTime || ''}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="link">Enlace (Opcional):</label>
                            <input
                                type="text"
                                id="link"
                                name="link"
                                value={formData.link || ''}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="https://..."
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Imagen:</label>
                            <div className="image-upload">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="file-upload-btn"
                                >
                                    Choose File
                                </button>
                                <span className="file-name">
                                    {imagePreview ? 'Imagen seleccionada' : 'No file chosen'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="price-section">
                            <div className="free-toggle">
                                <label className="toggle-label">
                                    <span>Gratuito</span>
                                    <div className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={formData.isFree}
                                            onChange={handleToggleFree}
                                        />
                                        <span className="toggle-slider"></span>
                                    </div>
                                </label>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="coverFee">Precio (COP):</label>
                                <input
                                    type="text"
                                    id="coverFee"
                                    name="coverFee"
                                    value={formData.coverFee || ''}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="0"
                                    disabled={formData.isFree}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="moods-container">
                    <label>Moods (Máx. 5):</label>
                    <div className="moods-selector">
                        <div className="moods-buttons">
                            {allMoods.map(mood => (
                                <button
                                    key={mood}
                                    type="button"
                                    onClick={() => toggleMood(mood)}
                                    className={formData.selectedMoods?.includes(mood) ? "mood-button selected" : "mood-button"}
                                    data-mood={mood}
                                >
                                    {mood}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="notifications-container">
                    <label>Notificaciones:</label>
                    {showNotificationOptions ? (
                        <div className="notifications-options">
                            {isNotificationOptionAvailable('En el momento') && (
                                <label className="notification-option">
                                    <input
                                        type="checkbox"
                                        checked={formData.notifications?.includes('En el momento')}
                                        onChange={() => toggleNotification('En el momento')}
                                    />
                                    <span>En el momento</span>
                                </label>
                            )}
                            {isNotificationOptionAvailable('Una hora antes') && (
                                <label className="notification-option">
                                    <input
                                        type="checkbox"
                                        checked={formData.notifications?.includes('Una hora antes')}
                                        onChange={() => toggleNotification('Una hora antes')}
                                    />
                                    <span>Una hora antes</span>
                                </label>
                            )}
                            {isNotificationOptionAvailable('Un día antes') && (
                                <label className="notification-option">
                                    <input
                                        type="checkbox"
                                        checked={formData.notifications?.includes('Un día antes')}
                                        onChange={() => toggleNotification('Un día antes')}
                                    />
                                    <span>Un día antes</span>
                                </label>
                            )}
                            {isNotificationOptionAvailable('Una semana antes') && (
                                <label className="notification-option">
                                    <input
                                        type="checkbox"
                                        checked={formData.notifications?.includes('Una semana antes')}
                                        onChange={() => toggleNotification('Una semana antes')}
                                    />
                                    <span>Una semana antes</span>
                                </label>
                            )}
                        </div>
                    ) : (
                        <p className="notifications-helper">Selecciona fecha para ver opciones.</p>
                    )}
                </div>
                
                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-cancel"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        className="btn-save-draft"
                    >
                        Guardar Borrador
                    </button>
                    <button
                        type="submit"
                        className="btn-save btn-save-green"
                    >
                        Guardar Evento
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EventForm; 