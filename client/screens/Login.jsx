import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';

// Module imports
import Divider from '../components/Divider';
import { funnelDisplay } from '../assets/fonts/funnelDisplay';
import colorScheme from '../assets/color/colorScheme';

// Login screen
const Login = () => {
    const insets = useSafeAreaInsets();
    const [secure, setSecure] = useState(true);

    return (
        // TODO: Refactorize the entire page to make it cleaner
        // General container with all the screen
        <View style={[
                styles.background,
                {
                    paddingBottom: insets.bottom,
                    paddingTop: insets.top
                }
                ]}>
            {/* Login container that has all the login components */}
            <View style={styles.loginContainer}>
                {/* Header container */}
                <View>
                    {/* Logos container */}
                    <View style={styles.logosContainer}>
                        <Image 
                            source={require('../assets/icon.png')} style={styles.image}
                        />
                        <Divider 
                            orientation='vertical'
                            size={2} 
                        />
                        <Image 
                            source={require('../assets/universidadLibre.png')} style={styles.image}
                        />
                    </View>
                    {/* H1 Text */}
                    <Text style={[funnelDisplay.bold, styles.h1]}>
                        Welcome Back!{'\n'}Login to continue...
                    </Text>
                </View>
                {/* Form container */}
                <View style={styles.formContainer}>
                    <Text style={[funnelDisplay.semibold, styles.label]}>
                        Email
                    </Text>
                    <TextInput
                        placeholder='Insert your email...'
                        placeholderTextColor={'gray'}
                        style={[funnelDisplay.medium, styles.input]}
                    />
                    <Text style={[funnelDisplay.semibold, styles.label]}>
                        Password
                    </Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder='Insert your password...'
                            placeholderTextColor={'gray'}
                            secureTextEntry={secure}
                            style={[funnelDisplay.medium, styles.passwordInput]}
                        />
                        <TouchableOpacity onPress={() => setSecure(!secure)}>
                            <Ionicons
                                name={secure ? 'eye-off-outline' : 'eye-outline'}
                                size={22}
                                color='gray'
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* TODO: Make button a component */}
                {/* Button */}
                <Pressable style={styles.button}>
                    <Text style={[
                        funnelDisplay.bold,
                        {
                            color: 'white',
                            fontSize: 20,
                            textAlign: 'center'
                        }
                    ]}>
                        Login
                    </Text>
                </Pressable>
                {/* Footer container */}
                <View style={styles.footer}>
                    <Divider 
                        orientation='horizontal'
                        size={2}
                    />
                    <Text style={[
                            funnelDisplay.semibold,
                            styles.footerText
                            ]}>
                        Don't you have an account yet?{'\n'} 
                        <Text style={
                            {
                                color: colorScheme.lightGreen,
                                textDecorationLine: 'underline'
                            }
                            }>
                            Register
                        </Text>
                        {' '}to create one!
                    </Text>
            </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // General style config
    background: {
        flex: 1,
        backgroundColor: colorScheme.darkGreen,
        justifyContent: 'center',
        alignItems: 'center'
    },

    // Login styles config
    loginContainer: {
        backgroundColor: 'white',
        width: 350,
        height: 650,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    logosContainer: {
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
        fontSize: 34,
        textAlign: 'center',
        paddingTop: 18,
        lineHeight: 36
    },

    // Form styles config
    formContainer: {
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

    // Button style config
    button: {
        backgroundColor: colorScheme.lightGreen,
        width: '90%',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginTop: 24
    },

    // Footer styles config
    footer: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 20,
        gap: 15
    },

    footerText: {
        opacity: 0.8,
        fontSize: 18,
        textAlign: 'center'
    }
});

export default Login;