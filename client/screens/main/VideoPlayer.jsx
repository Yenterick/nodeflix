import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';

// Module and components imports
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import colorScheme from '../../assets/color/colorScheme';
import useFetch from '../../hooks/useFetch';

const VideoPlayer = ({ contentId, contentType }) => {
    // Navigation hook
    const navigation = useNavigation();

    // Insets hook
    const insets = useSafeAreaInsets();

    // Various hooks
    const [ hasError, setHasError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('An error has ocurred while playing the content!');
    const [ content, setContent ] = useState(undefined);
    const [ season, setSeason ] = useState(1);
    const [ episode, setEpisode ] = useState(1);
    const { request, loading, error } = useFetch();

    // Screen orientation config
    useEffect(() => {
        // Orientation Lock
        const lockOrientation = async () => {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.LANDSCAPE
            );
        };

        lockOrientation();

        // Content getter
        const getContent = async () => {
            try {
                const response = await request(contentType == 'movie' ? `/movie/${contentId}` : `/series/${contentId}`);
                if (response && response.success) {
                    setContent(response.data);
                } else {
                    setHasError(true);
                    setErrorMessage(error || response?.msg || 'An error has ocurred while playing the content!');
                } 
            } catch (error) {
                setHasError(true);
                setErrorMessage(error.message);
            }
        }

        getContent();
        // Free screens orientation again
        return () => {
            ScreenOrientation.unlockAsync();
        };

    }, [season, episode]);

    // TODO: Maybe change the episode finder later :D
    // Video player creation
    const videoUrl =
        contentType === 'movie'
            ? content?.stream_url
            : content?.seasons
                ?.find(s => s.season_number === season)
                ?.episodes
                ?.find(e => e.episode_number === episode)
                ?.stream_url;

    const player = useVideoPlayer(videoUrl ? `${process.env.EXPO_PUBLIC_CDN_URL}${videoUrl}` : null, player => {
        player.loop = false;
        player.play();
    }); 

    return(
        // General container with all the screen
        <View 
            style={[
                styles.background,
                {
                    paddingLeft: insets.left,
                    paddingRight: insets.right
                }
            ]}
        >
        {/* Error modal */}
        {hasError && 
            <InfoModal text={errorMessage} icon='error-outline' color='#FF6B6B' onExit={() => navigation.navigate('Index')}/>
        }
        {player &&
            <VideoView 
                style={styles.video}
                player={player}
                fullscreenOptions={{ allowFullscreen: false }}
                nativeControls={false}
                contentFit='contain'
            />
        }
        </View>
    );
}

const styles = StyleSheet.create({
    // Background style config
    background: {
        flex: 1,
        backgroundColor: colorScheme.darkGreen
    },

    // Video style config
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
});

export default VideoPlayer;

