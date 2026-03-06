import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { dietPresets } from '../data/dietPresets';

const ProfileContext = createContext(null);

const STORAGE_KEYS = {
  profiles: 'nibble_profiles',
  activeProfileId: 'nibble_activeProfileId',
  searchHistory: 'nibble_searchHistory',
  favourites: 'nibble_favourites',
  customDiets: 'nibble_customDiets',
  account: 'nibble_account',
};

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota exceeded — silently fail */ }
}

const DEFAULT_PROFILE = {
  id: 'default',
  name: 'My Diet',
  presetId: 'tcm-damp-heat',
  color: '#D4A039',
  avoidList: dietPresets.find(p => p.id === 'tcm-damp-heat').avoidList,
  customRestrictions: [],
};

export function ProfileProvider({ children }) {
  const [profiles, setProfiles] = useState(() =>
    loadFromStorage(STORAGE_KEYS.profiles, [DEFAULT_PROFILE])
  );
  const [activeProfileId, setActiveProfileId] = useState(() =>
    loadFromStorage(STORAGE_KEYS.activeProfileId, 'default')
  );
  const [searchHistory, setSearchHistory] = useState(() =>
    loadFromStorage(STORAGE_KEYS.searchHistory, [])
  );
  const [favourites, setFavourites] = useState(() =>
    loadFromStorage(STORAGE_KEYS.favourites, [])
  );
  const [customDiets, setCustomDiets] = useState(() =>
    loadFromStorage(STORAGE_KEYS.customDiets, [])
  );
  const [account, setAccount] = useState(() =>
    loadFromStorage(STORAGE_KEYS.account, null)
  );

  // Persist to localStorage on change
  useEffect(() => { saveToStorage(STORAGE_KEYS.profiles, profiles) }, [profiles]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.activeProfileId, activeProfileId) }, [activeProfileId]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.searchHistory, searchHistory) }, [searchHistory]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.favourites, favourites) }, [favourites]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.customDiets, customDiets) }, [customDiets]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.account, account) }, [account]);

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

  // Account methods
  const signUp = useCallback((email, name) => {
    const newAccount = { email, name, createdAt: new Date().toISOString() };
    setAccount(newAccount);
    return newAccount;
  }, []);

  const signIn = useCallback((email) => {
    // Check if account exists in localStorage
    const stored = loadFromStorage(STORAGE_KEYS.account, null);
    if (stored && stored.email === email) {
      setAccount(stored);
      return stored;
    }
    return null;
  }, []);

  const signOut = useCallback(() => {
    setAccount(null);
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
      account,
      signUp,
      signIn,
      signOut,
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
