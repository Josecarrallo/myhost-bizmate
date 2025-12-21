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

    // Absolute maximum timeout - force loading to false after 3 seconds
    const absoluteTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth check exceeded 3s - forcing loading to false');
        setLoading(false);
      }
    }, 3000);

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
          await fetchUserData(session.user.id);
        }
      } catch (error) {
        console.error('Auth init timeout or error:', error);
        // Don't clear localStorage on timeout - user may still be logged in
        // Only clear if there's a real auth error, not a network timeout
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
          await fetchUserData(session.user.id);
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
        await fetchUserData(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
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
