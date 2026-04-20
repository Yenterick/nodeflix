import { createContext, useContext, useState, useRef } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Platform } from 'react-native';

const OrientationTransitionContext = createContext({
    showBlack: false,
    startExitTransition: () => { },
});

// Hook to use the context of orientation transition
export const useOrientationTransition = () => useContext(OrientationTransitionContext);

// Provider for the orientation transition context
export const OrientationTransitionProvider = ({ children }) => {
    const [showBlack, setShowBlack] = useState(false);
    const listenerRef = useRef(null);
    const fallbackRef = useRef(null);

    const cleanup = () => {
        if (listenerRef.current) {
            ScreenOrientation.removeOrientationChangeListener(listenerRef.current);
            listenerRef.current = null;
        }
        if (fallbackRef.current) {
            clearTimeout(fallbackRef.current);
            fallbackRef.current = null;
        }
    };

    // Function to start the exit transition
    const startExitTransition = async () => {
        if (Platform.OS === 'web') return;

        cleanup();
        setShowBlack(true);

        try {
            await ScreenOrientation.unlockAsync();
        } catch (e) { }

        // Listen for the actual portrait orientation event
        listenerRef.current = ScreenOrientation.addOrientationChangeListener((event) => {
            const o = event.orientationInfo.orientation;
            const isPortrait =
                o === ScreenOrientation.Orientation.PORTRAIT_UP ||
                o === ScreenOrientation.Orientation.PORTRAIT_DOWN;
            if (isPortrait) {
                cleanup();
                setShowBlack(false);
            }
        });

        fallbackRef.current = setTimeout(() => {
            cleanup();
            setShowBlack(false);
        }, 1500);
    };

    return (
        <OrientationTransitionContext.Provider value={{ showBlack, startExitTransition }}>
            {children}
        </OrientationTransitionContext.Provider>
    );
};
