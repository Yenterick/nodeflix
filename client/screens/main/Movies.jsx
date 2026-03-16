import { View, Text, StyleSheet, FlatList, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

// Module and componets imports
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import Movie from '../../components/Movie';
import MovieInfoModal from '../../components/modals/MovieInfoModal';
import InfoModal from '../../components/modals/InfoModal';
import useFetch from '../../hooks/useFetch';

const Movies = () => {
    // Placeholder array in case movies don't charge
    const placeholders = Array.from({ length: 6 });

    // Navigation hook
    const navigation = useNavigation();
    
    // Various hooks
    const insets = useSafeAreaInsets();
    const [ hasError, setHasError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('An error has ocurred while retrieving the movies!');
    const { request, error, loading } = useFetch();

    // Movies hooks
    const [ movies, setMovies ] = useState([]);

    // Movie info modal hooks
    const [ selectedMovie, setSelectedMovie ] = useState(null);
    const [ showMovieInfoModal, setShowMovieInfoModal ] = useState(false);

    const handleSelectMovie = (item) => {
        setSelectedMovie(item);
        setShowMovieInfoModal(true);
    }

    // Load the movies from the backend
    const fetchMovies = async () => {
        try {
            const response = await request(`/movie/`, 'GET');

            console.log(response);
            if (response && response.success) {
                if (!response.data || response.data.length === 0) {
                    setHasError(true);
                    setErrorMessage('An error has ocurred while retrieving the movies!');
                    return;
                }
                setMovies(response.data);
            } else {
                setHasError(true);
                setErrorMessage(error || response?.msg || 'An error has ocurred while retrieving the movies!');
            }
        } catch (error) {
            setHasError(true);
            setErrorMessage(error.message);
        }   
    }

    useEffect(() => {
        fetchMovies();
    }, [])

    return(
        // General container with all the screen
        <View
            style={[
                styles.background,
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom
                }
            ]}
        >
        {/* Error modal */}
        {hasError && 
            <InfoModal text={errorMessage} icon='error-outline' color='#FF6B6B' onExit={() => navigation.reset({ index: 0, routes: [{ name: 'Auth' }] })}/>
        }
            {/* TODO: Implement functionality on all the modal buttons */}
            {showMovieInfoModal && 
                <MovieInfoModal movie={selectedMovie} onClose={() => setShowMovieInfoModal(false)} />
            }
            <ScrollView>
                <Text style={[
                    styles.h1,
                    funnelDisplay.semibold
                    ]}>
                    Trending...
                </Text>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={movies.length ? movies : placeholders}
                    renderItem={({ item, index }) => 
                        movies.length ? (
                            <Movie 
                                uriSource={process.env.EXPO_PUBLIC_CDN_URL + item.thumbnail_url} 
                                onPress={() => handleSelectMovie(item)} 
                            />
                        ) : (
                            <View 
                                style={[
                                    styles.placeholder,
                                    { 
                                        opacity: 1 - index * 0.12 
                                    }
                                ]}
                            />
                        )
                    }
                    keyExtractor={(item, index) => movies.length ? item._id : `placeholder-${index}`}
                />     
                <Text style={[
                    styles.h1,
                    funnelDisplay.semibold
                ]}>
                    What's new?
                </Text>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={movies.length ? movies : placeholders}
                    renderItem={({ item, index }) => 
                        movies.length ? (
                            <Movie 
                                uriSource={process.env.EXPO_PUBLIC_CDN_URL + item.thumbnail_url} 
                                onPress={() => handleSelectMovie(item)} 
                            />
                        ) : (
                            <View 
                                style={[
                                    styles.placeholder,
                                    { 
                                        opacity: 1 - index * 0.12 
                                    }
                                ]}
                            />
                        )
                    }
                    keyExtractor={(item, index) => movies.length ? item._id : `placeholder-${index}`}
                />    
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    // General styles config
    background: {
        flex: 1,
        backgroundColor: colorScheme.darkGreen,
        paddingLeft: 20,
        paddingRight: 20
    },
    
    h1: {
        color: 'white',
        margin: 10,
        fontSize: 24
    },

    // Placeholder style config
    placeholder: {
        width: 120,
        height: 180,
        backgroundColor: colorScheme.bgDarkGreen,
        borderRadius: 10,
        marginHorizontal: 6
    }
});

export default Movies;