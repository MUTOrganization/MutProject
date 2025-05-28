import { useMediaQuery } from "react-responsive";

export function useResponsive() {
    const isSmall = useMediaQuery({ query: '(max-width: 640px)' });
    const isMedium = useMediaQuery({ query: '(min-width: 641px) and (max-width: 768px)' });
    const isLarge = useMediaQuery({ query: '(min-width: 769px) and (max-width: 1024px)' });
    const isExtraLarge = useMediaQuery({ query: '(min-width: 1025px) and (max-width: 1536px)' });

    const screen = isSmall ? 'sm' : isMedium ? 'md' : isLarge ? 'lg' : isExtraLarge ? 'xl' : '2xl';
    const screenInt = isSmall ? 0 : isMedium ? 1 : isLarge ? 2 : isExtraLarge ? 3 : 4;

    return {
        screen,
        screenInt
    }
}

export const Screen = {
    sm: 0,
    md: 1,
    lg: 2,
    xl: 3,
    "2xl": 4
}