import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Absolute maximum timeout - force loading to false after 20 seconds
    // (Increased to 20s to accommodate 15s timeout + 3 retries with 2s delays)
    const absoluteTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth check exceeded 20s - forcing loading to false');
        setLoading(false);
      }
    }, 20000);

    const initAuth = async () => {
      try {
        // Add timeout to getSession call (5s to handle slow Supabase)
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Session check timeout')), 5000)
        );

        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]);

        if (!mounted) return;

        clearTimeout(absoluteTimeout);

        if (error) {
          console.error('Session error:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          // Fetch user data in background - don't block loading
          fetchUserData(session.user.id);
        } else {
          // No session - clear everything
          setUser(null);
          setUserData(null);
        }
      } catch (error) {
        console.error('Auth init timeout or error:', error);
        // On timeout or error, clear session to force re-login
        setUser(null);
        setUserData(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Check active session
    initAuth();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        clearTimeout(absoluteTimeout);
        if (session?.user) {
          setUser(session.user);
          // Fetch user data in background - don't block
          fetchUserData(session.user.id);
        } else {
          setUser(null);
          setUserData(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      clearTimeout(absoluteTimeout);
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Session error:', error);
        setUser(null);
        setUserData(null);
        setLoading(false);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        // Fetch user data in background - don't block
        fetchUserData(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (userId, retryCount = 0) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000; // 2 seconds between retries
    const TIMEOUT = 15000; // 15 seconds timeout (increased from 3s)

    try {
      // Add timeout to prevent hanging
      const dataPromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('User data fetch timeout')), TIMEOUT)
      );

      const { data, error } = await Promise.race([dataPromise, timeoutPromise]);

      if (error) {
        console.warn('User data not found, continuing without it');
        return; // Continue without user data - not critical
      }
      setUserData(data);
      console.log('✅ User data loaded successfully');
    } catch (error) {
      console.warn(`⚠️ Error fetching user data (attempt ${retryCount + 1}/${MAX_RETRIES}):`, error.message);

      // Retry logic with exponential backoff
      if (retryCount < MAX_RETRIES - 1) {
        console.log(`🔄 Retrying in ${RETRY_DELAY / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchUserData(userId, retryCount + 1);
      } else {
        // All retries exhausted - auto cleanup and force re-authentication
        console.error('❌ All retry attempts failed. Auto-cleanup initiated...');
        console.error('🔧 Clearing corrupted session data and forcing re-login...');

        // Clear all storage
        sessionStorage.clear();
        localStorage.clear();

        // Clear auth state
        setUser(null);
        setUserData(null);

        // Force sign out from Supabase (best effort)
        try {
          await supabase.auth.signOut();
        } catch (signOutError) {
          console.warn('Sign out during cleanup failed (non-critical):', signOutError.message);
        }

        // Redirect to login after a short delay to show error message
        setTimeout(() => {
          console.log('🔄 Redirecting to login page...');
          window.location.href = '/';
        }, 1500);
      }
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    // Clear state and storage FIRST, before calling Supabase
    setUser(null);
    setUserData(null);
    localStorage.clear();

    try {
      // Then try to sign out from Supabase (with timeout)
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Sign out timeout')), 2000)
      );

      const signOutPromise = supabase.auth.signOut();
      await Promise.race([signOutPromise, timeout]);
    } catch (error) {
      console.error('Error signing out from Supabase:', error);
      // Don't worry if Supabase fails - we already cleared localStorage
    } finally {
      // Reload to reset all state
      window.location.reload();
    }
  };

  const value = {
    user,
    userData,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
