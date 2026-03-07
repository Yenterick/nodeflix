import { View, Text, StyleSheet, FlatList, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

// Module and componets imports
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import Movie from '../../components/Movie';
import MovieInfoModal from '../../components/modals/MovieInfoModal'

// Debugging mock movies list
// TODO: Implement API fetch
const movieList1 = [
{
    _id: '1',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology.',
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    release_year: 2010,
    duration: 14800,
    thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=1',
    stream_url: 'https://example.com/stream/inception',
    is_for_kids: false,
    created_at: new Date('2024-01-10')
},
{
    _id: '2',
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space.',
    genres: ['Sci-Fi', 'Drama'],
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    release_year: 2014,
    duration: 16900,
    thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=2',
    stream_url: 'https://example.com/stream/interstellar',
    is_for_kids: false,
    created_at: new Date('2024-01-11')
},
{
    _id: '3',
    title: 'The Dark Knight',
    description: 'Batman faces the Joker in Gotham City.',
    genres: ['Action', 'Crime', 'Drama'],
    cast: ['Christian Bale', 'Heath Ledger', 'Gary Oldman'],
    release_year: 2008,
    duration: 15200,
    thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=3',
    stream_url: 'https://example.com/stream/darkknight',
    is_for_kids: false,
    created_at: new Date('2024-01-12')
},
{
    _id: '4',
    title: 'Avengers: Endgame',
    description: 'The Avengers assemble for one final battle against Thanos.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson'],
    release_year: 2019,
    duration: 18100,
    thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=4',
    stream_url: 'https://example.com/stream/endgame',
    is_for_kids: true,
    created_at: new Date('2024-01-13')
},
{
    _id: '5',
    title: 'Joker',
    description: 'The origin story of the infamous Gotham villain.',
    genres: ['Crime', 'Drama', 'Thriller'],
    cast: ['Joaquin Phoenix', 'Robert De Niro'],
    release_year: 2019,
    duration: 12200,
    thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=5',
    stream_url: 'https://example.com/stream/joker',
    is_for_kids: false,
    created_at: new Date('2024-01-14')
}
];

const movieList2 = [
{
    _id: '6',
    title: 'The Matrix',
    description: 'A hacker discovers the true nature of reality.',
    genres: ['Sci-Fi', 'Action'],
    cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    release_year: 1999,
    duration: 13600,
    thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=6',
    stream_url: 'https://example.com/stream/matrix',
    is_for_kids: false,
    created_at: new Date('2024-01-15')
},
{
    _id: '7',
    title: 'Gladiator',
    description: 'A Roman general seeks revenge after betrayal.',
    genres: ['Action', 'Drama', 'History'],
    cast: ['Russell Crowe', 'Joaquin Phoenix'],
    release_year: 2000,
    duration: 15500,
    thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=7',
    stream_url: 'https://example.com/stream/gladiator',
    is_for_kids: false,
    created_at: new Date('2024-01-16')
},
{
    _id: '8',
    title: 'Titanic',
    description: 'A love story aboard the ill-fated RMS Titanic.',
    genres: ['Drama', 'Romance'],
    cast: ['Leonardo DiCaprio', 'Kate Winslet'],
    release_year: 1997,
    duration: 19500,
    thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=8',
    stream_url: 'https://example.com/stream/titanic',
    is_for_kids: true,
    created_at: new Date('2024-01-17')
},
{
    _id: '9',
    title: 'Parasite',
    description: 'A poor family schemes to become employed by a wealthy household.',
    genres: ['Thriller', 'Drama'],
    cast: ['Song Kang-ho', 'Lee Sun-kyun'],
    release_year: 2019,
    duration: 13200,
    thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=9',
    stream_url: 'https://example.com/stream/parasite',
    is_for_kids: false,
    created_at: new Date('2024-01-18')
},
{
    _id: '10',
    title: 'Spider-Man: No Way Home',
    description: 'Spider-Man seeks help from Doctor Strange.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch'],
    release_year: 2021,
    duration: 14800,
    thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=10',
    stream_url: 'https://example.com/stream/spiderman',
    is_for_kids: true,
    created_at: new Date('2024-01-19')
}
];

const Movies = () => {
    // Various hooks
    const insets = useSafeAreaInsets();

    // Movie info modal hooks
    const [ selectedMovie, setSelectedMovie ] = useState(null);
    const [ showMovieInfoModal, setShowMovieInfoModal ] = useState(false);

    const handleSelectMovie = (item) => {
        setSelectedMovie(item);
        setShowMovieInfoModal(true);
    }

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
            {/* TODO: Implement functionality on all the modal buttons */}
            {showMovieInfoModal && 
                <MovieInfoModal movie={selectedMovie} onClose={() => setShowMovieInfoModal(false)} />
            }
            <Text style={[
                styles.h1,
                funnelDisplay.semibold
                ]}>
                Trending...
            </Text>
            <ScrollView>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={movieList1}
                    renderItem={({item}) => <Movie uriSource={item.thumbnail_url} onPress={() => {handleSelectMovie(item)}} />}
                    keyExtractor={item => item._id}
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
                    data={movieList2}
                    renderItem={({item}) => <Movie uriSource={item.thumbnail_url} onPress={() => {handleSelectMovie(item)}} />}
                    keyExtractor={item => item._id}
                />    
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
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
    }
});

export default Movies;