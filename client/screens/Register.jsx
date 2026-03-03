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
import useFetch from '../hooks/useFetch';
import { funnelDisplay } from '../assets/fonts/funnelDisplay';
import colorScheme from '../assets/color/colorScheme';

// Register screen
const Register = () => {
    // Navigation hook
    const navigation = useNavigation();

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

    // Function to handle the fetch after pressing the button
    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setHasError(true);
            setErrorMessage('The passwords must be the same!');
            return;
        };

        const response = await request(
            '/api/user/register',
            'POST',
            {
                email: email,
                password: password,
                screens: 2
            }
        );

        if (response && response.success) {
            navigation.navigate('Login');
        } else {
            setHasError(true);
            setErrorMessage(response?.msg || 'An error ocurred while registering!');
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
                            color={colorScheme.green}
                        />
                        <Image
                            source={require('../assets/universidadLibre.png')}
                            style={styles.image}
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
                    <TextInput
                        placeholder='Insert your email...'
                        placeholderTextColor={'gray'}
                        value={email}
                        onChangeText={setEmail}
                        style={[funnelDisplay.medium, styles.input]}
                    />
                    <Text style={[
                        funnelDisplay.semibold,
                        styles.label
                    ]}>
                        Password
                    </Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder='Insert your password...'
                            placeholderTextColor={'gray'}
                            value={password}
                            onChangeText={setPassword}
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
                    <Text style={[
                        funnelDisplay.semibold,
                        styles.label
                    ]}>
                        Confirm Password
                    </Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder='Insert your password again...'
                            placeholderTextColor={'gray'}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={secureConfirm}
                            style={[funnelDisplay.medium, styles.passwordInput]}
                        />
                        <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
                            <Ionicons
                                name={secureConfirm ? 'eye-off-outline' : 'eye-outline'}
                                size={22}
                                color='gray'
                            />
                        </TouchableOpacity>
                    </View>
                    <Text
                        style={[
                            funnelDisplay.semibold,
                            styles.errorMessage,
                            {
                                color: (hasError ? '#FF6B6B' : 'black')
                            }
                        ]}
                    >
                        {errorMessage}
                    </Text>
                    <Button onPress={() => { handleRegister() }}>
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
                            onPress={() => { navigation.navigate('Login') }}
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
        shadowColor: 'black',
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
        paddingVertical: 12
    },

    errorMessage: {
        textAlign: 'center',
        paddingTop: 14,
        paddingBottom: 10,
        fontSize: 14,
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