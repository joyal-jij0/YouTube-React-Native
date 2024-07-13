import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase'; 
import { useRouter } from 'expo-router';

interface Video {
  id: string;
  title: string;
  image_url: string;
}

const Home = () => {
  const router = useRouter()
  const [videoContent, setVideoContent] = useState<Video[]>([]);

  useEffect(() => {
    async function fetchVideoContent() {
      let { data: videos, error } = await supabase
        .from('video_content')
        .select('id, title, image_url')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching video content:', error.message);
        return;
      }

      setVideoContent(videos as Video[]);
    }

    fetchVideoContent();
  }, []);


  const renderItem = ({ item }: {item: Video}) => (
      <TouchableOpacity className='p-2' onPress={() => router.push(`playback/${item.id}`)}>
        <Image source={{ uri: item.image_url }} className='h-60' />
        <Text className='text-white text-xl'>{item.title}</Text>
      </TouchableOpacity>
  );

  return (
    <SafeAreaView className='flex-1 bg-[#1d1e24]'>
      <View className='flex-row justify-between p-2 mt-8'>
        <Text className='text-[#C8C8C8] text-2xl'>ReoTube</Text>
        <TouchableOpacity onPress={() => router.push('/search')}>
          <Feather name="search" size={28} color="#C8C8C8" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={videoContent}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
  },
});

export default Home;