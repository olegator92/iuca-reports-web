import { useLayoutEffect, useState, useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';

export const PageTransition = () => {
    const location = useLocation();
    const currentOutlet = useOutlet();
    const prevLocationRef = useRef(location.pathname);
    const [displayOutlet, setDisplayOutlet] = useState(currentOutlet);
    const [transitionStage, setTransitionStage] = useState<'fade-in' | 'fade-out'>('fade-in');

    useLayoutEffect(() => {
        // If location changed, start fade-out with OLD outlet
        if (location.pathname !== prevLocationRef.current) {
            setTransitionStage('fade-out');
        }
    }, [location.pathname]);

    const handleAnimationEnd = () => {
        if (transitionStage === 'fade-out') {
            // Fade out complete, NOW show new content and fade in
            prevLocationRef.current = location.pathname;
            setDisplayOutlet(currentOutlet);
            setTransitionStage('fade-in');
        }
    };

    return (
        <div
            className={`page-transition ${transitionStage} h-full`}
            onAnimationEnd={handleAnimationEnd}
        >
            {displayOutlet}
        </div>
    );
};
