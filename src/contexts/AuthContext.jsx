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
    // Check active session
    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      // Add 3 second timeout to prevent infinite loading
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Session check timeout')), 3000)
      );

      const sessionCheck = supabase.auth.getSession();

      const { data: { session } } = await Promise.race([sessionCheck, timeout]);

      if (session?.user) {
        setUser(session.user);
        await fetchUserData(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      // If timeout or error, clear stored session and show login
      localStorage.removeItem('supabase.auth.token');
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
    try {
      // Add timeout to prevent hanging
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Sign out timeout')), 2000)
      );

      const signOutPromise = supabase.auth.signOut();

      await Promise.race([signOutPromise, timeout]);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      // Always clear local state and storage, even if Supabase fails
      setUser(null);
      setUserData(null);
      localStorage.clear();
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
