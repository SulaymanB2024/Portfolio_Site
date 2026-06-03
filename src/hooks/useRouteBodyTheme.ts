import { useEffect } from 'react';

type UseRouteBodyThemeOptions = {
  currentPath: string;
  isDarkRoute: (path: string) => boolean;
  darkBackground?: string;
  darkColor?: string;
  lightBackground?: string;
  lightColor?: string;
};

export function useRouteBodyTheme({
  currentPath,
  isDarkRoute,
  darkBackground = '#080807',
  darkColor = '#f1efe8',
  lightBackground = '#f1efe8',
  lightColor = '#080807',
}: UseRouteBodyThemeOptions) {
  useEffect(() => {
    const isDark = isDarkRoute(currentPath);

    document.body.style.backgroundColor = isDark ? darkBackground : lightBackground;
    document.body.style.color = isDark ? darkColor : lightColor;
  }, [currentPath, darkBackground, darkColor, isDarkRoute, lightBackground, lightColor]);
}
