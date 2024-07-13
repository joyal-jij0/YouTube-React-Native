import { supabase } from '@/lib/supabase';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Dimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

interface VideoDetails {
  id: string;
  title: string;
  video_url: string;
}

export default function Playback() {
  const params = useLocalSearchParams();
  const { id } = params;
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    async function fetchVideoDetails() {
      let { data, error } = await supabase
        .from("video_content")
        .select("id, video_url")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching video details:", error.message);
        return;
      }

      setVideoDetails(data as VideoDetails);
      setLoading(false);
    }

    fetchVideoDetails();
  }, [id]);

  const handleFullscreenButtonPress = async () => {
    if (!isFullscreen) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
      await videoRef.current?.presentFullscreenPlayer();
    } else {
      await videoRef.current?.dismissFullscreenPlayer();
      await ScreenOrientation.unlockAsync();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      return;
    }

    if (status.didJustFinish && !status.isPlaying) {
      setIsFullscreen(false);
      ScreenOrientation.unlockAsync();
    }
  };

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-[#1d1e24]'>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!videoDetails) {
    return (
      <View className='flex-1 justify-center items-center bg-[#1d1e24]'>
        <Text className='text-1xl text-[#fff]'>Error: Video not found</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 justify-center items-center bg-[#1d1e24]' >
      <Video
        ref={videoRef}
        source={{ uri: videoDetails.video_url }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        shouldPlay
        onFullscreenUpdate={handleFullscreenButtonPress}
        resizeMode={ResizeMode.CONTAIN}
        style={styles.video}
        useNativeControls
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: Dimensions.get('window').height / 2,
  },
});