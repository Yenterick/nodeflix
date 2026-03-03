import { View, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Module and components imports 
import colorScheme from '../assets/color/colorScheme';
import { funnelDisplay } from '../assets/fonts/funnelDisplay';
import Button from './Button';

const MainLayout = ({ children }) => {
    // Navigation hook
    const navigation = useNavigation();

    // Various hooks
    const insets = useSafeAreaInsets();

    return(
        // General container with all the screen
        <View
            style={[
                styles.background,
                {
                    paddingTop: insets.top,
                }
            ]}
        >
            {/* Screen content */}
            {children}
            {/* Footer */}
            <View style={[
                styles.footer,
                {
                    paddingBottom: insets.bottom
                }
            ]}>
                <TouchableOpacity style={styles.footerButton}>
                    <MaterialIcons 
                        name="home" 
                        size={36} 
                        color="white" 
                    />
                    <Text
                        style={[
                            funnelDisplay.semibold,
                            styles.footerButtonText
                        ]}
                    >
                        Home
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton}>
                    <MaterialIcons 
                        name="local-movies" 
                        size={36} 
                        color="white" 
                    />
                    <Text
                        style={[
                            funnelDisplay.semibold,
                            styles.footerButtonText
                        ]}
                    >
                        Movies
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton}>
                    <MaterialIcons 
                        name="smart-display" 
                        size={36} 
                        color="white" 
                    />
                    <Text
                        style={[
                            funnelDisplay.semibold,
                            styles.footerButtonText
                        ]}
                    >
                        Series
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton}>
                    <MaterialIcons 
                        name="logout" 
                        size={36} 
                        color="white" 
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
        </View>
    )
}

const styles = StyleSheet.create({
    // General background config
    background: {
        flex: 1,
        backgroundColor: colorScheme.darkGreen
    },

    // Footer styles config
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        height: 100,
        backgroundColor: colorScheme.bgDarkGreen,
        alignSelf: 'flex-end'
    },

    footerButton: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    footerButtonText: {
        textAlign: 'center',
        color: 'white'
    }
});

export default MainLayout;

