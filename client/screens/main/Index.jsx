import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeIn } from 'react-native-reanimated';

// Module and components imports
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import ContentCard from '../../components/ContentCard';
import InfoModal from '../../components/modals/InfoModal';
import ContentInfoModal from '../../components/modals/ContentInfoModal';
import useFetch from '../../hooks/useFetch';

const Index = () => {
    // Hooks
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { request, loading } = useFetch();

    // Data States
    const [startedContent, setStartedContent] = useState([]);
    const [listContent, setListContent] = useState([]);
    const [recommendedContent, setRecommendedContent] = useState([]);
    const [tendencies, setTendencies] = useState([]);

    // UI States
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleSelectContent = (item) => {
        setSelectedItem(item);
        setShowInfoModal(true);
    };

    const fetchHomePageData = async () => {
        try {
            const profileId = await AsyncStorage.getItem('profileId');
            const isKid = await AsyncStorage.getItem('isKid') === 'true';

            if (!profileId) {
                router.replace('/(auth)/profile-selector');
                return;
            }

            const [startedRes, listRes, recommendedRes, tendenciesRes] = await Promise.all([
                request(`/profile/${profileId}/started?isKid=${isKid}`, 'GET'),
                request(`/profile/${profileId}/list?isKid=${isKid}`, 'GET'),
                request(`/profile/${profileId}/recommendedContent?isKid=${isKid}`, 'GET'),
                request(`/movie/tendencies?isKid=${isKid}`, 'GET')
            ]);

            if (startedRes?.success) setStartedContent(startedRes.data || []);
            if (listRes?.success) setListContent(listRes.data || []);
            if (recommendedRes?.success) setRecommendedContent(recommendedRes.data || []);
            setTendencies((tendenciesRes?.success ? tendenciesRes.data : []).slice(0, 10));

        } catch (error) {
            setHasError(true);
            setErrorMessage('An error occurred while loading your home page.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchHomePageData();
        }, [])
    );

    const renderContentRow = (title, data) => {
        if (!data || data.length === 0) return null;

        return (
            <View style={styles.rowContainer}>
                <Text style={[funnelDisplay.semibold, styles.rowTitle]}>{title}</Text>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={Platform.OS === 'web'}
                    data={data}
                    keyExtractor={(item, index) => `${item._id}-${index}`}
                    contentContainerStyle={styles.rowList}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeIn.delay(index * 40).duration(400)}>
                            <ContentCard
                                uriSource={process.env.EXPO_PUBLIC_CDN_URL + item.thumbnail_url}
                                onPress={() => handleSelectContent(item)}
                                title={item.title}
                                contentType={item.seasons ? 'series' : 'movie'}
                            />
                        </Animated.View>
                    )}
                />
            </View>
        );
    };

    return (
        <View style={[styles.background, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            {Platform.OS === 'ios' && (
                <TouchableOpacity
                    style={[styles.logoutButton, { top: insets.top + 10 }]}
                    onPress={() => router.replace('/(auth)/profile-selector')}
                >
                    <MaterialIcons name="logout" size={36} color="#FF6B6B" />
                </TouchableOpacity>
            )}

            {hasError && (
                <InfoModal
                    text={errorMessage}
                    icon='error-outline'
                    color='#FF6B6B'
                    onExit={() => setHasError(false)}
                />
            )}

            {showInfoModal && selectedItem && (
                <ContentInfoModal
                    item={selectedItem}
                    contentType={selectedItem.episodes ? 'series' : 'movie'}
                    onClose={() => setShowInfoModal(false)}
                />
            )}

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            ) : (
                <ScrollView
                    style={{ flex: 1, width: '100%' }}
                    contentContainerStyle={{ paddingVertical: 20 }}
                    showsVerticalScrollIndicator={false}
                >
                    {renderContentRow("Continue Watching", startedContent)}
                    {renderContentRow("My List", listContent)}
                    {renderContentRow("Recommended for You", recommendedContent)}
                    {renderContentRow("Top 10 Trending", tendencies)}

                    {!startedContent.length && !listContent.length && !recommendedContent.length && !tendencies.length && (
                        <Text style={[funnelDisplay.medium, { color: 'gray', textAlign: 'center', marginTop: 50 }]}>
                            No content available right now.
                        </Text>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: colorScheme.darkGreen,
        position: 'relative',
    },
    logoutButton: {
        position: 'absolute',
        right: 20,
        zIndex: 10,
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 4,
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderRadius: 50,
    },
    mainTitle: {
        color: 'white',
        fontSize: 32,
        textAlign: 'center',
        marginBottom: 30,
        letterSpacing: 0,
    },
    rowContainer: {
        marginBottom: 24,
    },
    rowTitle: {
        color: 'white',
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 10,
        letterSpacing: 0.5,
    },
    rowList: {
        paddingHorizontal: 10,
        paddingVertical: 15,
    }
});

export default Index;