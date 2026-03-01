import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useState } from 'react'

// Component imports
import Button from '../components/Button';
import Divider from '../components/Divider';

// Module imports
import { funnelDisplay } from '../assets/fonts/funnelDisplay';
import colorScheme from '../assets/color/colorScheme';

// Register screen
const Register = () => {
    // Navigation hook
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        // General container with all the screen
        <View style={[
                styles.background,
                {
                    paddingBottom: insets.bottom,
                    paddingTop: insets.top
                }
                ]}>
            {/* Register panel container */}
            <View style={styles.loginContainer}>
                {/* Register header container */}
                <View style={styles.loginHeader}>
                    {/* Logos container */}
                    <View style={styles.loginLogos}>
                        <Image
                            source={require('../assets/icon.png')}
                            style={styles.image}
                        />
                        <Divider
                            orientation='vertical'
                            size={2}
                        />
                        <Image
                            source={require('../assets/universidadLibre.png')}
                            style={styles.image}
                        />
                    </View>
                    <Text style={[
                        funnelDisplay.bold,
                        styles.h1
                    ]}>
                        Welcome!{'\n'}Register to continue...
                    </Text>
                </View>
                {/* Register form container */}
                <View style={styles.loginForm}>
                    <Text style={[
                        funnelDisplay.semibold, 
                        styles.label
                    ]}>
                        Email
                    </Text>
                    <TextInput
                        placeholder='Insert your email...'
                        placeholderTextColor={'gray'}
                        style={[
                            funnelDisplay.medium, 
                            styles.input
                        ]}
                    />
                    <Text style={[
                        funnelDisplay.semibold, 
                        styles.label
                    ]}>
                        Password
                    </Text>
                    <TextInput
                        placeholder='Insert your password...'
                        placeholderTextColor={'gray'}
                        secureTextEntry={true}
                        style={[
                            funnelDisplay.medium, 
                            styles.input
                        ]}
                    />
                    <Text style={[
                        funnelDisplay.semibold, 
                        styles.label
                    ]}>
                        Confirm Password
                    </Text>
                    <TextInput
                        placeholder='Insert your password again...'
                        placeholderTextColor={'gray'}
                        secureTextEntry={true}
                        style={[
                            funnelDisplay.medium, 
                            styles.input
                        ]}
                    />
                    <Button style={styles.loginButton} onPress={() => {}}>
                        <Entypo
                            name='login'    
                            color='white'
                            size={22}
                        />
                        <Text style={[
                            funnelDisplay.bold,
                            styles.buttonText
                        ]}>
                            Register
                        </Text>
                    </Button>
                </View>
                {/* Register footer container */}
                <View style={styles.loginFooter}>
                    <Divider size={2} />
                    <Text style={[
                            funnelDisplay.semibold,
                            styles.footerText
                            ]}>
                        Do you already have an account?{'\n'} 
                        <Text style={
                            {
                                color: colorScheme.lightGreen,
                                textDecorationLine: 'underline'
                            }}
                            onPress={() => {navigation.navigate('Login')}}
                        >
                            Login
                        </Text>
                        {' '}to continue!
                    </Text>
                </View>
           </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // Background style config
    background: {
        flex: 1,
        backgroundColor: colorScheme.darkGreen,
        justifyContent: 'center',
        alignItems: 'center'
    },

    // Register container styles config
    loginContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 350,
        height: 650,
        borderRadius: 25,
        backgroundColor: 'white'
    },

    loginLogos: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 25,
        gap: 20
    },

    image: {
        width: 100,
        height: 100
    },

    h1: {
        fontSize: 32,
        marginTop: 24,
        textAlign: 'center',
        lineHeight: 32
    },

    // Form container styles config
    loginForm: {
        width: '90%',
    },

    label: {
        fontSize: 24,
        marginBottom: 6,
        paddingLeft: 12
    },

    input: {
        backgroundColor: colorScheme.beige,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 8
    },

    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colorScheme.beige,
        borderRadius: 14,
        paddingHorizontal: 16
    },

    passwordInput: {
        flex: 1,
        paddingVertical: 12
    },

    loginButton: {
        marginTop: 24
    },

    buttonText: {
        color: 'white',
        fontSize: 18
    },
    
    // Footer container styles config
    loginFooter: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
        gap: 15
    },

    footerText: {
        opacity: 0.8,
        fontSize: 18,
        textAlign: 'center'
    }
});

export default Register;