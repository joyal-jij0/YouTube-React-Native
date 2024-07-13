import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

const Search = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = async () => {
    // Convert searchTerm to lowercase for case insensitive search
    const searchTermLower = searchTerm.toLowerCase();
  
    // Perform a query to check if the title exists in Supabase (case insensitive)
    const { data, error } = await supabase
      .from('video_content')
      .select('id')
      .ilike('title', `%${searchTermLower}%`)
      .single();
  
    if (error) {
      console.error('Error searching:', error.message);
      return;
    }
  
    // If title exists, navigate to playback screen
    if (data) {
      const videoId = data.id;
      router.replace(`/playback/${videoId}`);
    } else {
      console.log('Title not found');

    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1d1e24' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, marginTop: 24 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={28} color="#C8C8C8" />
        </TouchableOpacity>

        <View >
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#C8C8C8"
            style={{
              backgroundColor: '#2b2c32',
              color: '#fff',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              fontSize: 18,
              minWidth: 200,
            }}
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
          />
        </View>

        <TouchableOpacity onPress={handleSearch}>
          <Feather name="search" size={28} color="#C8C8C8" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Search;