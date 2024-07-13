import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Session } from '@supabase/supabase-js';

export default function ProfileManager() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Initial session from getSession:", session);
      if (mounted) {
        setSession(session);
        if (session) getProfile(session);
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session ? "User logged in" : "User logged out");
      console.log("New session:", session);
      if (mounted) {
        setSession(session);
        if (session) getProfile(session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function getProfile(currentSession: Session) {
    try {
      setLoading(true);
      console.log("Getting profile. Session:", currentSession);
      if (!currentSession?.user) {
        console.log("No user on session. Current session state:", currentSession);
        throw new Error('No user on the session!');
      }

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username`)
        .eq('id', currentSession.user.id)
        .single();

      console.log("Profile data:", data);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session.user.id,
        username,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Profile updated successfully');
      getProfile(session);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  }

  if (!session) {
    return (
      <View className='flex-col h-full  p-5 pt-12 bg-[#1d1e24]'>
        <Button title="Sign In" onPress={() => router.navigate('/')} />
      </View>
    );
  }

  return (
    <View className='flex-col h-full  p-5 pt-12 bg-[#1d1e24]'>
      <View className='mt-14'>
        <Input labelStyle={{color: '#C8C8C8'}} inputStyle={{color: '#C8C8C8'}} label="Email" value={session?.user?.email} disabled />
      </View>
      <View >
        <Input
        labelStyle={{color: '#C8C8C8'}} inputStyle={{color: '#C8C8C8'}} 
          label="Username"
          value={username || ''}
          onChangeText={setUsername}
        />
      </View>
      <View className='mt-10 mb-3'>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={updateProfile}
          disabled={loading}
        />
      </View>
      <View>
        <Button
          title="Sign Out"
          onPress={() => supabase.auth.signOut()}
        />
      </View>
    </View>
  );
}