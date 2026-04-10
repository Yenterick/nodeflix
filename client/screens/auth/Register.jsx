import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useState } from 'react'

// Component imports
import InfoModal from '../../components/modals/InfoModal';
import Button from '../../components/Button';
import Divider from '../../components/Divider';

// Module imports
import useFetch from '../../hooks/useFetch';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import colorScheme from '../../assets/color/colorScheme';

// Register screen
const Register = () => {
    // Navigation hook
    const router = useRouter();

    // Various hooks
    const insets = useSafeAreaInsets();
    const { request, loading, error } = useFetch();
    const [hasError, setHasError] = useState(false);
    const [secure, setSecure] = useState(true);
    const [secureConfirm, setSecureConfirm] = useState(true);
    const [errorMessage, setErrorMessage] = useState('An error ocurred while registering!');

    // Form hooks
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Scale shared values
    const emailScale = useSharedValue(1);
    const passwordScale = useSharedValue(1);
    const confirmPasswordScale = useSharedValue(1);

    // Animated styles
    const emailAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withSpring(emailScale.value) }]
    }));

    const passwordAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withSpring(passwordScale.value) }]
    }));

    const confirmPasswordAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withSpring(confirmPasswordScale.value) }]
    }));

    const [showInfoModal, setShowInfoModal] = useState(false);

    // Function to handle the fetch after pressing the button
    const handleRegister = async () => {
        if (!email.trim() || !password.trim()) {
            setHasError(true);
            setErrorMessage("You can't send empty values!");
            return;
        }

        if (password !== confirmPassword) {
            setHasError(true);
            setErrorMessage('The passwords must be the same!');
            return;
        };

        try {
            const response = await request(
                '/user/register',
                'POST',
                {
                    email: email,
                    password: password,
                    screens: 2
                }
            );

            if (response && response.success) {
                setShowInfoModal(true);
            } else {
                setHasError(true);
                setErrorMessage(error || response?.msg || 'An error ocurred while registering!');
            }
        } catch (error) {
            setHasError(true);
            setErrorMessage(error.message);
        }
    }

    return (
        // General container with all the screen
        <View style={[
            styles.background,
            {
                paddingBottom: insets.bottom,
                paddingTop: insets.top
            }
        ]}>
            {/* Succesfully register modal */}
            {showInfoModal &&
                <InfoModal text='Succesfully registered! Please log in...' icon='check' onExit={() => {
                    setShowInfoModal(false);
                    router.push('/(auth)/login');
                }} />
            }

            {/* Error modal */}
            {hasError &&
                <InfoModal text={errorMessage} icon='error-outline' color='#FF6B6B' onExit={() => setHasError(false)} />
            }

            {/* Register panel container */}
            <Animated.View 
                style={styles.loginContainer}
                entering={FadeInRight
                    .springify()
                    .duration(2000)
                    .delay(250)
                }    
            >
                {/* Register header container */}
                <View style={styles.loginHeader}>
                    {/* Logos container */}
                    <View style={styles.loginLogos}>
                        <Animated.Image
                            source={require('../../assets/icon.png')}
                            style={styles.image}   
                            entering={FadeInUp
                                .springify()
                                .duration(2000)
                                .delay(300)
                            }         
                        />
                        <Divider
                            orientation='vertical'
                            size={2}
                            color={colorScheme.green}
                        />
                        <Animated.Image
                            source={require('../../assets/universidadLibre.png')}
                            style={styles.image}
                            entering={FadeInUp
                                .springify()
                                .duration(2000)
                                .delay(300)
                            }   
                        />
                    </View>
                    <Text style={[
                        funnelDisplay.semibold,
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
                    <Animated.View style={emailAnimatedStyle}>
                        <TextInput
                            placeholder='Insert your email...'
                            placeholderTextColor={'gray'}
                            value={email}
                            maxLength={64}
                            onChangeText={setEmail}
                            keyboardAppearance='dark'
                            style={[funnelDisplay.medium, styles.input]}
                            onFocus={() => { emailScale.value = 1.03 }}
                            onBlur={() => { emailScale.value = 1 }}
                        />
                    </Animated.View>
                    <Text style={[
                        funnelDisplay.semibold,
                        styles.label
                    ]}>
                        Password
                    </Text>
                    <Animated.View style={[styles.passwordContainer, passwordAnimatedStyle]}>
                        <TextInput
                            placeholder='Insert your password...'
                            placeholderTextColor={'gray'}
                            value={password}
                            maxLength={24}
                            onChangeText={setPassword}
                            secureTextEntry={secure}
                            keyboardAppearance='dark'
                            style={[funnelDisplay.medium, styles.passwordInput]}
                            onFocus={() => { passwordScale.value = 1.03 }}
                            onBlur={() => { passwordScale.value = 1 }}
                        />
                        <TouchableOpacity onPress={() => setSecure(!secure)}>
                            <Ionicons
                                name={secure ? 'eye-off-outline' : 'eye-outline'}
                                size={22}
                                color='gray'
                            />
                        </TouchableOpacity>
                    </Animated.View>
                    <Text style={[
                        funnelDisplay.semibold,
                        styles.label
                    ]}>
                        Confirm Password
                    </Text>
                    <Animated.View style={[styles.passwordContainer, confirmPasswordAnimatedStyle]}>
                        <TextInput
                            placeholder='Insert your password again...'
                            placeholderTextColor={'gray'}
                            value={confirmPassword}
                            maxLength={24}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={secureConfirm}
                            keyboardAppearance='dark'
                            style={[funnelDisplay.medium, styles.passwordInput]}
                            onFocus={() => { confirmPasswordScale.value = 1.03 }}
                            onBlur={() => { confirmPasswordScale.value = 1 }}
                        />
                        <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
                            <Ionicons
                                name={secureConfirm ? 'eye-off-outline' : 'eye-outline'}
                                size={22}
                                color='gray'
                            />
                        </TouchableOpacity>
                    </Animated.View>
                    <Button
                        onPress={() => { handleRegister() }}
                        style={styles.button}
                    >
                        {loading ?
                            <ActivityIndicator
                                size="small"
                                color="white"
                            />
                            :
                            <View style={styles.buttonContent}>
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
                            </View>
                        }
                    </Button>
                </View>
                {/* Register footer container */}
                <View style={styles.loginFooter}>
                    <Divider
                        size={2}
                        color={colorScheme.green}
                    />
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
                            onPress={() => { router.push('/(auth)/login') }}
                        >
                            Login
                        </Text>
                        {' '}to continue!
                    </Text>
                </View>
            </Animated.View>
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

    // Login container styles config
    loginContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 360,
        height: 680,
        borderRadius: 30,
        backgroundColor: colorScheme.bgDarkGreen,
        paddingVertical: 20,
        shadowColor: colorScheme.green,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
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
        fontSize: 28,
        marginTop: 24,
        textAlign: 'center',
        lineHeight: 32,
        color: 'white',
        letterSpacing: 0.5
    },

    // Form container styles config
    loginForm: {
        width: '90%',
    },

    label: {
        fontSize: 20,
        marginBottom: 6,
        paddingLeft: 12,
        color: 'white'
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
        paddingHorizontal: 16,
        marginBottom: 8
    },

    passwordInput: {
        flex: 1,
        paddingVertical: 12,
    },

    // Button styles config
    button: {
        marginTop: 24
    },

    buttonContent: {
        flexDirection: 'row',
        gap: 10
    },

    buttonText: {
        color: 'white',
        fontSize: 18
    },

    // Footer container styles config
    loginFooter: {
        width: '100%',
        alignItems: 'center',
        gap: 15
    },

    footerText: {
        opacity: 0.8,
        fontSize: 18,
        textAlign: 'center',
        color: 'white'
    }
});

export default Register;