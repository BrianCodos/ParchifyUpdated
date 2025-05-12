export interface Event {
    id: string;
    place: string;
    city: string;
    date: string;
    startTime?: string;
    endTime?: string;
    isFree?: boolean;
    link?: string;
    isDraft?: boolean;
    mood?: string;
    notes?: string;
    imageUrl?: string;
    notifications?: string[];
}

export interface EventFormData extends Omit<Event, 'id'> {
    id?: string;
    imageUrl?: string;
    entryType?: string;
    coverFee?: string;
    selectedMoods?: string[];
    notifications?: string[];
}

export type ViewType = 'list-cards' | 'list-table' | 'calendar' | 'saved' | 'dashboard' | 'drafts' | 'form';

export interface EventHandlers {
    onToggleFavorite: (eventId: string) => void;
    onDeleteEvent: (eventId: string) => void;
    onEditEvent: (event: Event) => void;
    onAddEvent: (event: Event) => void;
    onSaveDraft: (draft: Event) => void;
}

export interface MoodHandlers {
    onAddMood: (moodName: string) => void;
    onDeleteMood: (moodName: string) => void;
} 