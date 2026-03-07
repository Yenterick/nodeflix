import { View, Text, StyleSheet, FlatList, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

// Module and componets imports
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import Series from '../../components/Series';
import SeriesInfoModal from '../../components/modals/SeriesInfoModal';

// Debugging mock movies list
// TODO: Implement API fetch
const seriesList1 = [
    {
        _id: '1',
        title: 'Stranger Things',
        description: 'A group of kids uncover supernatural mysteries in their town.',
        genres: ['Sci-Fi', 'Horror', 'Drama'],
        cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'David Harbour'],
        release_year: 2016,
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=1',
        is_for_kids: false,
        created_at: new Date('2024-02-01'),
        seasons: [
            {
                season_number: 1,
                episodes: [
                    {
                        episode_number: 1,
                        title: 'The Vanishing of Will Byers',
                        description: 'A boy mysteriously disappears.',
                        duration: 47,
                        thumbnail_url: 'https://placeholdpicsum.dev/photo/300/200?random=101',
                        stream_url: 'https://example.com/stream/st-s1-e1'
                    },
                    {
                        episode_number: 2,
                        title: 'The Weirdo on Maple Street',
                        description: 'The boys meet a mysterious girl.',
                        duration: 50,
                        thumbnail_url: 'https://placeholdpicsum.dev/photo/300/200?random=102',
                        stream_url: 'https://example.com/stream/st-s1-e2'
                    }
                ]
            },
            {
                season_number: 2,
                episodes: [
                    {
                        episode_number: 1,
                        title: 'The Vanishing of Will Byer232',
                        description: 'A boy mysteriously disappears.',
                        duration: 47,
                        thumbnail_url: 'https://placeholdpicsum.dev/photo/300/200?random=101',
                        stream_url: 'https://example.com/stream/st-s1-e1'
                    },
                    {
                        episode_number: 2,
                        title: 'The Weirdo on Maple Street2323',
                        description: 'The boys meet a mysterious girl.',
                        duration: 50,
                        thumbnail_url: 'https://placeholdpicsum.dev/photo/300/200?random=102',
                        stream_url: 'https://example.com/stream/st-s1-e2'
                    }
                ]
            },

        ]
    },
    {
        _id: '2',
        title: 'Breaking Bad',
        description: 'A chemistry teacher turns to making meth.',
        genres: ['Crime', 'Drama', 'Thriller'],
        cast: ['Bryan Cranston', 'Aaron Paul'],
        release_year: 2008,
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=2',
        is_for_kids: false,
        created_at: new Date('2024-02-02'),
        seasons: [
            {
                season_number: 1,
                episodes: [
                    {
                        episode_number: 1,
                        title: 'Pilot',
                        description: 'Walter White begins his journey.',
                        duration: 58,
                        thumbnail_url: 'https://placeholdpicsum.dev/photo/300/200?random=103',
                        stream_url: 'https://example.com/stream/bb-s1-e1'
                    }
                ]
            }
        ]
    },
    {
        _id: '3',
        title: 'The Mandalorian',
        description: 'A bounty hunter travels across the galaxy.',
        genres: ['Sci-Fi', 'Adventure'],
        cast: ['Pedro Pascal'],
        release_year: 2019,
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=3',
        is_for_kids: true,
        created_at: new Date('2024-02-03'),
        seasons: [
            {
                season_number: 1,
                episodes: [
                    {
                        episode_number: 1,
                        title: 'Chapter 1: The Mandalorian',
                        description: 'The Mandalorian accepts a bounty.',
                        duration: 39,
                        thumbnail_url: 'https://placeholdpicsum.dev/photo/300/200?random=104',
                        stream_url: 'https://example.com/stream/mando-s1-e1'
                    }
                ]
            }
        ]
    },
    {
        _id: '4',
        title: 'Game of Thrones',
        description: 'Noble families fight for control of the Iron Throne.',
        genres: ['Fantasy', 'Drama'],
        cast: ['Emilia Clarke', 'Kit Harington', 'Peter Dinklage'],
        release_year: 2011,
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=4',
        is_for_kids: false,
        created_at: new Date('2024-02-04'),
        seasons: [
            {
                season_number: 1,
                episodes: [
                    {
                        episode_number: 1,
                        title: 'Winter Is Coming',
                        description: 'The Stark family receives a royal visit.',
                        duration: 62,
                        thumbnail_url: 'https://placeholdpicsum.dev/photo/300/200?random=105',
                        stream_url: 'https://example.com/stream/got-s1-e1'
                    }
                ]
            }
        ]
    },
    {
        _id: '5',
        title: 'The Office',
        description: 'Mockumentary about office workers.',
        genres: ['Comedy'],
        cast: ['Steve Carell', 'John Krasinski'],
        release_year: 2005,
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=5',
        is_for_kids: true,
        created_at: new Date('2024-02-05'),
        seasons: [
            {
                season_number: 1,
                episodes: [
                    {
                        episode_number: 1,
                        title: 'Pilot',
                        description: 'A look inside Dunder Mifflin.',
                        duration: 23,
                        thumbnail_url: 'https://placeholdpicsum.dev/photo/300/200?random=106',
                        stream_url: 'https://example.com/stream/office-s1-e1'
                    }
                ]
            }
        ]
    }
];

const seriesList2 = [
    {
        _id: '6',
        title: 'Loki',
        description: 'The god of mischief alters timelines.',
        genres: ['Sci-Fi', 'Fantasy'],
        cast: ['Tom Hiddleston'],
        release_year: 2021,
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=6',
        is_for_kids: true,
        created_at: new Date('2024-02-06'),
        seasons: [
            {
                season_number: 1,
                episodes: [
                    {
                        episode_number: 1,
                        title: 'Glorious Purpose',
                        description: 'Loki is captured by the TVA.',
                        duration: 52,
                        thumbnail_url: 'https://placeholdpicsum.dev/photo/300/200?random=107',
                        stream_url: 'https://example.com/stream/loki-s1-e1'
                    }
                ]
            }
        ]
    },
    {
        _id: '7',
        title: 'The Witcher',
        description: 'A monster hunter struggles to find his place.',
        genres: ['Fantasy', 'Action'],
        cast: ['Henry Cavill'],
        release_year: 2019,
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=7',
        is_for_kids: false,
        created_at: new Date('2024-02-07'),
        seasons: [
            {
                season_number: 1,
                episodes: [
                    {
                        episode_number: 1,
                        title: 'The End’s Beginning',
                        description: 'Geralt hunts a monster.',
                        duration: 61,
                        thumbnail_url: 'https://placeholdpicsum.dev/photo/300/200?random=108',
                        stream_url: 'https://example.com/stream/witcher-s1-e1'
                    }
                ]
            }
        ]
    },
    {
        _id: '8',
        title: 'Dark',
        description: 'A time-travel mystery in a German town.',
        genres: ['Sci-Fi', 'Thriller'],
        cast: ['Louis Hofmann'],
        release_year: 2017,
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=8',
        is_for_kids: false,
        created_at: new Date('2024-02-08'),
        seasons: [
            {
                season_number: 1,
                episodes: [
                    {
                        episode_number: 1,
                        title: 'Secrets',
                        description: 'A child disappears.',
                        duration: 52,
                        thumbnail_url: 'https://placeholdpicsum.dev/photo/300/200?random=109',
                        stream_url: 'https://example.com/stream/dark-s1-e1'
                    }
                ]
            }
        ]
    },
    {
        _id: '9',
        title: 'Wednesday',
        description: 'Wednesday Addams solves mysteries at school.',
        genres: ['Comedy', 'Mystery'],
        cast: ['Jenna Ortega'],
        release_year: 2022,
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=9',
        is_for_kids: true,
        created_at: new Date('2024-02-09'),
        seasons: [
            {
                season_number: 1,
                episodes: [
                    {
                        episode_number: 1,
                        title: 'Wednesday’s Child',
                        description: 'Wednesday joins Nevermore Academy.',
                        duration: 50,
                        thumbnail_url: 'https://placeholdpicsum.dev/photo/300/200?random=110',
                        stream_url: 'https://example.com/stream/wed-s1-e1'
                    }
                ]
            }
        ]
    },
    {
        _id: '10',
        title: 'The Boys',
        description: 'A group fights corrupt superheroes.',
        genres: ['Action', 'Drama'],
        cast: ['Karl Urban', 'Jack Quaid'],
        release_year: 2019,
        thumbnail_url: 'https://placeholdpicsum.dev/photo/150/250?random=10',
        is_for_kids: false,
        created_at: new Date('2024-02-10'),
        seasons: [
            {
                season_number: 1,
                episodes: [
                    {
                        episode_number: 1,
                        title: 'The Name of the Game',
                        description: 'Hughie joins The Boys.',
                        duration: 60,
                        thumbnail_url: 'https://placeholdpicsum.dev/photo/300/200?random=111',
                        stream_url: 'https://example.com/stream/boys-s1-e1'
                    }
                ]
            }
        ]
    }
];

const SeriesP = () => {
    // Various hooks
    const insets = useSafeAreaInsets();

    // Series info modal hooks
    const [ selectedSeries, setSelectedSeries ] = useState(null);
    const [ showSeriesInfoModal, setShowSeriesInfoModal ] = useState(false);

    const handleSelectSeries = (item) => {
        setSelectedSeries(item);
        setShowSeriesInfoModal(true);
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
            {showSeriesInfoModal && 
                <SeriesInfoModal series={selectedSeries} onClose={() => setShowSeriesInfoModal(false)} />
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
                    data={seriesList1}
                    renderItem={({item}) => <Series uriSource={item.thumbnail_url} onPress={() => handleSelectSeries(item)} />}
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
                    data={seriesList2}
                    renderItem={({item}) => <Series uriSource={item.thumbnail_url} onPress={() => handleSelectSeries(item)} />}
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

export default SeriesP;