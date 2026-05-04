import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

// Module and components imports
import SkeletonCard from './SkeletonCard';
import colorScheme from '../assets/color/colorScheme';
import { funnelDisplay } from '../assets/fonts/funnelDisplay';

const ContentCard = ({ uriSource, onPress, style, title, contentType }) => {
    const [imageError, setImageError] = useState(false);

    if (imageError) {
        return <SkeletonCard style={[{ marginHorizontal: 10 }, style]} />;
    }

    return (
        <View style={[{ marginHorizontal: 10, width: 100, alignItems: 'center', gap: 6 }, style]}>
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    {
                        width: '100%',
                        height: 160,
                        position: 'relative',
                        borderRadius: 10,
                        shadowColor: colorScheme.lightGreen,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.5,
                        shadowRadius: 10,
                        elevation: 8,
                        transform: [{ scale: pressed ? 0.95 : 1 }],
                    }
                ]}
            >
                <Image
                    source={{ uri: uriSource }}
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 10,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                    }}
                    onError={() => setImageError(true)}
                />

                {contentType && (
                    <View style={[
                        styles.typeBadge,
                        contentType === 'series' && styles.typeBadgeSeries
                    ]}>
                        <Text style={[funnelDisplay.semibold, styles.typeBadgeText]}>
                            {contentType === 'movie' ? 'Movie' : 'Series'}
                        </Text>
                    </View>
                )}
            </Pressable>

            {title && (
                <Text
                    style={[funnelDisplay.regular, styles.cardTitle]}
                    numberOfLines={2}
                >
                    {title}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    typeBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(14, 17, 14, 0.82)',
        borderRadius: 4,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: colorScheme.green,
    },
    typeBadgeSeries: {
        borderColor: colorScheme.lightGreen,
    },
    typeBadgeText: {
        color: colorScheme.lightGreen,
        fontSize: 9,
        letterSpacing: 0.5,
    },
    cardTitle: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 12,
        lineHeight: 16,
        textAlign: 'center',
    },
});

export default ContentCard;
