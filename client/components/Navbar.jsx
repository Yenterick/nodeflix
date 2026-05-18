import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

// Module imports
import colorScheme from '../assets/color/colorScheme';
import { funnelDisplay } from '../assets/fonts/funnelDisplay';

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [profilePic, setProfilePic] = useState(null);
    const [tabLayouts, setTabLayouts] = useState({});

    // Fetch profile picture from storage
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const pic = await AsyncStorage.getItem('profilePic');
                if (pic) {
                    setProfilePic(pic);
                }
            } catch (error) {
                console.error("Failed to load profile pic", error);
            }
        };
        fetchProfileData();
    }, []);

    const navLinks = [
        { name: 'Home', path: '/', icon: 'home' },
        { name: 'Movies', path: '/movies', icon: 'local-movies' },
        { name: 'Series', path: '/series', icon: 'smart-display' },
        { name: 'Search', path: '/search', icon: 'search' },
    ];

    const activeIndex = navLinks.findIndex(link => pathname === link.path || (link.path === '/' && pathname === '/(main)'));

    const indicatorX = useSharedValue(0);
    const indicatorWidth = useSharedValue(0);

    useEffect(() => {
        if (activeIndex !== -1 && tabLayouts[activeIndex]) {
            indicatorX.value = withTiming(tabLayouts[activeIndex].x, { duration: 250 });
            indicatorWidth.value = withTiming(tabLayouts[activeIndex].width, { duration: 250 });
        }
    }, [activeIndex, tabLayouts]);

    const animatedIndicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: indicatorX.value }],
        width: indicatorWidth.value,
    }));

    return (
        <Animated.View
            style={styles.navbar}
            entering={FadeInUp.duration(300)}
        >
            {/* Logo */}
            <View style={styles.brandContainer}>
                <Image
                    source={require('../assets/icon.png')}
                    style={styles.brandImage}
                    resizeMode="contain"
                />
            </View>

            {/* Navigation Links */}
            <View style={[styles.linksContainer, { position: 'relative' }]}>
                {Object.keys(tabLayouts).length > 0 && activeIndex !== -1 && (
                    <Animated.View style={[styles.navIndicator, animatedIndicatorStyle]} />
                )}
                {navLinks.map((link, index) => {
                    const isFocused = pathname === link.path || (link.path === '/' && pathname === '/(main)');
                    return (
                        <TouchableOpacity
                            key={link.name}
                            style={styles.navLink}
                            onPress={() => router.navigate(link.path)}
                            onLayout={(e) => {
                                const { x, width } = e.nativeEvent.layout;
                                setTabLayouts(prev => ({ ...prev, [index]: { x, width } }));
                            }}
                        >
                            <MaterialIcons
                                name={link.icon}
                                size={20}
                                color={isFocused ? colorScheme.green : 'white'}
                            />
                            <Text
                                style={[
                                    funnelDisplay.semibold,
                                    styles.navLinkText,
                                    { color: isFocused ? colorScheme.green : 'white' }
                                ]}
                            >
                                {link.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Profile and Logout */}
            <View style={styles.profileContainer}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => router.replace('/(auth)/profile-selector')}
                    accessible={true}
                    accessibilityLabel="logout"
                    accessibilityRole="button"
                >
                    <MaterialIcons name="logout" size={24} color="#FF6B6B" />
                </TouchableOpacity>
                <View style={styles.profilePicWrapper}>
                    {profilePic ? (
                        <Image
                            source={{ uri: `${process.env.EXPO_PUBLIC_CDN_URL}${profilePic}` }}
                            style={styles.profilePic}
                        />
                    ) : (
                        <MaterialIcons name="account-circle" size={32} color={colorScheme.lightGreen} />
                    )}
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colorScheme.bgDarkGreen,
        height: 60,
        paddingHorizontal: 30,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(98, 129, 65, 0.2)',
        zIndex: 100,
    },
    brandContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    brandImage: {
        width: 40,
        height: 40,
    },
    linksContainer: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
    },
    navLink: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 10,
        gap: 6,
    },
    navIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 2,
        backgroundColor: colorScheme.green,
    },
    navLinkText: {
        fontSize: 16,
    },
    profileContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 20,
    },
    logoutButton: {
        padding: 5,
    },
    profilePicWrapper: {
        width: 36,
        height: 36,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: colorScheme.green,
    },
    profilePic: {
        width: '100%',
        height: '100%',
    },
});

export default Navbar;
