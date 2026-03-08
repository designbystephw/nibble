import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { dietPresets } from '../data/dietPresets';
import { supabase } from '../lib/supabase';

const ProfileContext = createContext(null);

const STORAGE_KEYS = {
  profiles: 'nibble_profiles',
  activeProfileId: 'nibble_activeProfileId',
  searchHistory: 'nibble_searchHistory',
  favourites: 'nibble_favourites',
  customDiets: 'nibble_customDiets',
  presetCustomisations: 'nibble_presetCustomisations',
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
  // Per-preset avoid list overrides: { [presetId]: string[] }
  const [presetCustomisations, setPresetCustomisations] = useState(() =>
    loadFromStorage(STORAGE_KEYS.presetCustomisations, {})
  );

  // Supabase auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync data from Supabase when user signs in
  useEffect(() => {
    if (!user) return;
    loadUserData(user.id);
  }, [user]);

  async function loadUserData(userId) {
    try {
      // Load profiles
      const { data: dbProfiles } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId);

      if (dbProfiles && dbProfiles.length > 0) {
        const mapped = dbProfiles.map(p => ({
          id: p.profile_id,
          name: p.name,
          presetId: p.preset_id,
          color: p.color,
          avoidList: p.avoid_list,
          customRestrictions: p.custom_restrictions,
        }));
        setProfiles(mapped);
      } else {
        // First sign-in: push local data to Supabase
        await syncProfilesToSupabase(userId, profiles);
      }

      // Load settings
      const { data: settings } = await supabase
        .from('user_settings')
        .select('active_profile_id')
        .eq('user_id', userId)
        .single();

      if (settings) {
        setActiveProfileId(settings.active_profile_id);
      }

      // Load search history
      const { data: dbHistory } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', userId)
        .order('searched_at', { ascending: false })
        .limit(20);

      if (dbHistory && dbHistory.length > 0) {
        setSearchHistory(dbHistory.map(h => ({ ...h.result, searchedAt: h.searched_at })));
      }

      // Load favourites
      const { data: dbFavs } = await supabase
        .from('favourites')
        .select('dish_name')
        .eq('user_id', userId);

      if (dbFavs && dbFavs.length > 0) {
        setFavourites(dbFavs.map(f => f.dish_name));
      }

      // Load custom diets
      const { data: dbDiets } = await supabase
        .from('custom_diets')
        .select('*')
        .eq('user_id', userId);

      if (dbDiets && dbDiets.length > 0) {
        setCustomDiets(dbDiets.map(d => ({
          id: d.diet_id,
          name: d.name,
          avoidList: d.avoid_list,
        })));
      }
    } catch (err) {
      console.error('Failed to load user data from Supabase:', err);
    }
  }

  async function syncProfilesToSupabase(userId, profilesToSync) {
    try {
      const rows = profilesToSync.map(p => ({
        user_id: userId,
        profile_id: p.id,
        name: p.name,
        preset_id: p.presetId,
        color: p.color,
        avoid_list: p.avoidList,
        custom_restrictions: p.customRestrictions,
      }));
      await supabase.from('user_profiles').upsert(rows, { onConflict: 'user_id,profile_id' });
      await supabase.from('user_settings').upsert({
        user_id: userId,
        active_profile_id: activeProfileId,
      });
    } catch (err) {
      console.error('Failed to sync profiles to Supabase:', err);
    }
  }

  // Persist to localStorage on change (always, as offline fallback)
  useEffect(() => { saveToStorage(STORAGE_KEYS.profiles, profiles) }, [profiles]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.activeProfileId, activeProfileId) }, [activeProfileId]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.searchHistory, searchHistory) }, [searchHistory]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.favourites, favourites) }, [favourites]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.customDiets, customDiets) }, [customDiets]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.presetCustomisations, presetCustomisations) }, [presetCustomisations]);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  const switchProfile = useCallback((id) => {
    setActiveProfileId(id);
    if (user) {
      supabase.from('user_settings').upsert({
        user_id: user.id,
        active_profile_id: id,
      }).then();
    }
  }, [user]);

  const updateProfile = useCallback((id, updates) => {
    setProfiles(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      if (user) {
        const profile = updated.find(p => p.id === id);
        if (profile) {
          supabase.from('user_profiles').upsert({
            user_id: user.id,
            profile_id: profile.id,
            name: profile.name,
            preset_id: profile.presetId,
            color: profile.color,
            avoid_list: profile.avoidList,
            custom_restrictions: profile.customRestrictions,
          }, { onConflict: 'user_id,profile_id' }).then();
        }
      }
      return updated;
    });
  }, [user]);

  const addToHistory = useCallback((result) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(r => r.dish.toLowerCase() !== result.dish.toLowerCase());
      return [{ ...result, searchedAt: new Date().toISOString() }, ...filtered].slice(0, 20);
    });
    if (user) {
      supabase.from('search_history').insert({
        user_id: user.id,
        dish: result.dish,
        result,
      }).then();
    }
  }, [user]);

  const toggleFavourite = useCallback((dishName) => {
    setFavourites(prev => {
      const isFav = prev.includes(dishName);
      if (user) {
        if (isFav) {
          supabase.from('favourites').delete()
            .eq('user_id', user.id)
            .eq('dish_name', dishName).then();
        } else {
          supabase.from('favourites').insert({
            user_id: user.id,
            dish_name: dishName,
          }).then();
        }
      }
      return isFav ? prev.filter(d => d !== dishName) : [...prev, dishName];
    });
  }, [user]);

  const isFavourite = useCallback((dishName) => {
    return favourites.includes(dishName);
  }, [favourites]);

  const addCustomDiet = useCallback((diet) => {
    setCustomDiets(prev => [...prev, diet]);
    if (user) {
      supabase.from('custom_diets').insert({
        user_id: user.id,
        diet_id: diet.id,
        name: diet.name,
        avoid_list: diet.avoidList,
      }).then();
    }
  }, [user]);

  const updateCustomDiet = useCallback((id, updates) => {
    setCustomDiets(prev => {
      const updated = prev.map(d => d.id === id ? { ...d, ...updates } : d);
      if (user) {
        const diet = updated.find(d => d.id === id);
        if (diet) {
          supabase.from('custom_diets').upsert({
            user_id: user.id,
            diet_id: diet.id,
            name: diet.name,
            avoid_list: diet.avoidList,
          }, { onConflict: 'user_id,diet_id' }).then();
        }
      }
      return updated;
    });
  }, [user]);

  const savePresetCustomisation = useCallback((presetId, avoidList) => {
    setPresetCustomisations(prev => ({ ...prev, [presetId]: avoidList }));
  }, []);

  const resetPresetCustomisation = useCallback((presetId) => {
    setPresetCustomisations(prev => {
      const next = { ...prev };
      delete next[presetId];
      return next;
    });
  }, []);

  const getPresetCustomisation = useCallback((presetId) => {
    return presetCustomisations[presetId] || null;
  }, [presetCustomisations]);

  const isPresetCustomised = useCallback((presetId) => {
    return presetId in presetCustomisations;
  }, [presetCustomisations]);

  const removeCustomDiet = useCallback((id) => {
    setCustomDiets(prev => prev.filter(d => d.id !== id));
    if (user) {
      supabase.from('custom_diets').delete()
        .eq('user_id', user.id)
        .eq('diet_id', id).then();
    }
  }, [user]);

  // Auth methods using Supabase
  const signUp = useCallback(async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    return data.user;
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  // Build account object from Supabase user for backward compatibility
  const account = user ? {
    email: user.email,
    name: user.user_metadata?.name || user.email?.split('@')[0],
    createdAt: user.created_at,
  } : null;

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
      presetCustomisations,
      savePresetCustomisation,
      resetPresetCustomisation,
      getPresetCustomisation,
      isPresetCustomised,
      account,
      user,
      authLoading,
      signUp,
      signIn,
      signInWithGoogle,
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
