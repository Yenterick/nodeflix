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
import { ScreenStackHeaderSearchBarView } from 'react-native-screens';

// Register screen
const Register = () => {
    // Navigation hook
    const navigation = useNavigation();

    // Various hooks
    const insets = useSafeAreaInsets();
    const { request, loading, error } = useFetch();
    const [ hasError, setHasError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('An error ocurred while registering!');

    // Form hooks
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    // Function to handle the fetch after pressing the button
    const handleRegister = async () => {
        if ( password !== confirmPassword ) {
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


    // Function to register a new user

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
                        value={email}
                        onChangeText={setEmail}
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
                        value={password}
                        onChangeText={setPassword}
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
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={true}
                        style={[
                            funnelDisplay.medium, 
                            styles.input
                        ]}
                    />
                    <Text
                        style={[
                            funnelDisplay.semibold,
                            styles.errorMessage,
                            {
                                color: (hasError ? 'red' : 'white')
                            }
                        ]}
                    >
                        {errorMessage}
                    </Text>
                    <Button onPress={() => {handleRegister()}}>
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

    errorMessage: {
        textAlign: 'center',
        paddingTop: 8,
        paddingBottom: 6
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