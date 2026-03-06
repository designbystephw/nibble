import { createContext, useContext, useState, useCallback } from 'react';
import { dietPresets } from '../data/dietPresets';

const ProfileContext = createContext(null);

const DEFAULT_PROFILE = {
  id: 'default',
  name: 'My Diet',
  presetId: 'tcm-damp-heat',
  color: '#D4A039',
  avoidList: dietPresets.find(p => p.id === 'tcm-damp-heat').avoidList,
  customRestrictions: [],
};

export function ProfileProvider({ children }) {
  const [profiles, setProfiles] = useState([DEFAULT_PROFILE]);
  const [activeProfileId, setActiveProfileId] = useState('default');
  const [searchHistory, setSearchHistory] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [customDiets, setCustomDiets] = useState([]);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  const switchProfile = useCallback((id) => {
    setActiveProfileId(id);
  }, []);

  const updateProfile = useCallback((id, updates) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const addToHistory = useCallback((result) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(r => r.dish.toLowerCase() !== result.dish.toLowerCase());
      return [{ ...result, searchedAt: new Date().toISOString() }, ...filtered].slice(0, 20);
    });
  }, []);

  const toggleFavourite = useCallback((dishName) => {
    setFavourites(prev =>
      prev.includes(dishName)
        ? prev.filter(d => d !== dishName)
        : [...prev, dishName]
    );
  }, []);

  const isFavourite = useCallback((dishName) => {
    return favourites.includes(dishName);
  }, [favourites]);

  const addCustomDiet = useCallback((diet) => {
    setCustomDiets(prev => [...prev, diet]);
  }, []);

  const updateCustomDiet = useCallback((id, updates) => {
    setCustomDiets(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  }, []);

  const removeCustomDiet = useCallback((id) => {
    setCustomDiets(prev => prev.filter(d => d.id !== id));
  }, []);

  return (
    <ProfileContext.Provider value={{
      profiles,
      activeProfile,
      switchProfile,
      updateProfile,
      searchHistory,
      addToHistory,
      favourites,
      toggleFavourite,
      isFavourite,
      customDiets,
      addCustomDiet,
      updateCustomDiet,
      removeCustomDiet,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
