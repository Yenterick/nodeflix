import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Module and components imports 
import colorScheme from '../assets/color/colorScheme';
import { funnelDisplay } from '../assets/fonts/funnelDisplay';

const Footer = ({ state, navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.footer,
                {
                    paddingBottom: insets.bottom
                }
            ]}
        >
            {/* Home Button */}
            <TouchableOpacity
                style={styles.footerButton}
                onPress={() => navigation.navigate('Index')}
            >
                <MaterialIcons
                    name="home"
                    size={36}
                    color={state.index === 0 ? 'white' : 'gray'}
                />
                <Text
                    style={[
                        funnelDisplay.semibold,
                        styles.footerButtonText,
                        { color: state.index === 0 ? 'white' : 'gray' }
                    ]}
                >
                    Home
                </Text>
            </TouchableOpacity>

            {/* Movies Button */}
            <TouchableOpacity
                style={styles.footerButton}
                onPress={() => navigation.navigate('Movies')}
            >
                <MaterialIcons
                    name="local-movies"
                    size={36}
                    color={state.index === 1 ? 'white' : 'gray'}
                />
                <Text
                    style={[
                        funnelDisplay.semibold,
                        styles.footerButtonText,
                        { color: state.index === 1 ? 'white' : 'gray' }
                    ]}
                >
                    Movies
                </Text>
            </TouchableOpacity>

            {/* Series Button */}
            <TouchableOpacity
                style={styles.footerButton}
                onPress={() => navigation.navigate('Series')}
            >
                <MaterialIcons
                    name="smart-display"
                    size={36}
                    color={state.index === 2 ? 'white' : 'gray'}
                />
                <Text
                    style={[
                        funnelDisplay.semibold,
                        styles.footerButtonText,
                        { color: state.index === 2 ? 'white' : 'gray' }
                    ]}
                >
                    Series
                </Text>
            </TouchableOpacity>

            {/* Exit Button */}
            <TouchableOpacity
                style={styles.footerButton}
                onPress={() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Auth' }],
                    });
                }}
            >
                <MaterialIcons
                    name="logout"
                    size={36}
                    color='#FF6B6B'
                />
                <Text
                    style={[
                        funnelDisplay.semibold,
                        styles.footerButtonText
                    ]}
                >
                    Exit
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({

    // Footer styles config
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        height: 100,
        backgroundColor: colorScheme.bgDarkGreen,
    },

    footerButton: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    footerButtonText: {
        textAlign: 'center',
        color: 'white',
        color: '#FF6B6B'
    }
});

export default Footer;

