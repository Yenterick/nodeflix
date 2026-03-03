import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useState } from 'react';

// Component imports
import Button from '../components/Button';
import Divider from '../components/Divider';

// Module imports
import useFetch from '../hooks/useFetch';
import { funnelDisplay } from '../assets/fonts/funnelDisplay';
import colorScheme from '../assets/color/colorScheme';

// Login screen
const Login = () => {
    // Navigation hook
    const navigation = useNavigation();

    // Various hooks
    const insets = useSafeAreaInsets();

    const { request, loading, error } = useFetch();
    const [ hasError, setHasError ] = useState(false);
    const [ secure, setSecure ] = useState(true);
    const [ errorMessage, setErrorMessage ] = useState('An error has ocurred while logging in!');

    // Form hooks
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    // Function to handle the login when pressing the button
    const handleLogin = async () => {    
        const response = await request(
            '/api/user/login', 
            'POST', 
            {
                email: email,
                password: password
            }
        );
        
        if (response && response.success) {
            navigation.navigate('ProfileSelector');
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
            {/* Login panel container */}
            <View style={styles.loginContainer}>
                {/* Login header container */}
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
                        Welcome back!{'\n'}Login to continue...
                    </Text>
                </View>
                {/* Login form container */}
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
                    <Button onPress={() => {handleLogin()}}>
                        <Entypo
                            name='login'    
                            color='white'
                            size={22}
                        />
                        <Text style={[
                            funnelDisplay.bold,
                            styles.buttonText
                        ]}>
                            Login
                        </Text>
                    </Button>
                </View>
                {/* Login footer config */}
                <View style={styles.loginFooter}>
                    <Divider 
                        size={2} 
                        color={colorScheme.green}    
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
                            }}
                            onPress={() => {navigation.navigate('Register')}}
                        >
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
        backgroundColor: 'black',
        paddingVertical: 20,
        shadowColor: '#000',
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
        marginTop: 40,
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
        paddingHorizontal: 16
    },

    passwordInput: {
        flex: 1,
        paddingVertical: 12
    },

    errorMessage: {
        textAlign: 'center',
        paddingTop: 18,
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

export default Login;