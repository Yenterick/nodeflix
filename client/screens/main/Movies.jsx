import { View, Text, StyleSheet, FlatList, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Module and componets imports
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import Movie from '../../components/Movie';

// Debugging mock movies list
// TODO: Implement API fetch
const movieList1 = [
    {
        id: '1',
        title: 'Inception',
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=1'
    },
    {
        id: '2',
        title: 'Interstellar',
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=2'
    },
    {
        id: '3',
        title: 'The Dark Knight',
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=3'
    },
    {
        id: '4',
        title: 'Avengers: Endgame',
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=4'
    },
    {
        id: '5',
        title: 'Joker',
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=5'
    }
];

const movieList2 = [
    {
        id: '6',
        title: 'The Matrix',
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=6'
    },
    {
        id: '7',
        title: 'Gladiator',
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=7'
    },
    {
        id: '8',
        title: 'Titanic',
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=8'
    },
    {
        id: '9',
        title: 'Parasite',
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=9'
    },
    {
        id: '10',
        title: 'Spider-Man: No Way Home',
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=10'
    }
];

const Movies = () => {
    // Various hooks
    const insets = useSafeAreaInsets();

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
                    renderItem={({item}) => <Movie uriSource={item.thumbnail_url}/>}
                    keyExtractor={item => item.id}
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
                    renderItem={({item}) => <Movie uriSource={item.thumbnail_url}/>}
                    keyExtractor={item => item.id}
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