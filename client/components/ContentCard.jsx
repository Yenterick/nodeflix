import { useState } from 'react';
import { Pressable, Image } from 'react-native';

// Module and components imports
import SkeletonCard from './SkeletonCard';

const ContentCard = ({ uriSource, onPress, style }) => {
    const [imageError, setImageError] = useState(false);

    if (imageError) {
        return <SkeletonCard style={[{ marginHorizontal: 10 }, style]} />;
    }

    return (
        <Pressable
            onPress={onPress}
            style={[
                {
                    width: 120,
                    height: 180,
                    marginHorizontal: 10
                }
                , style]}
        >
            <Image
                source={{ uri: uriSource }}
                style={
                    {
                        width: '100%',
                        height: '100%',
                        borderRadius: 10
                    }
                }
                onError={() => setImageError(true)}
            />
        </Pressable>
    );
};

export default ContentCard;
