import {useRef, useCallback} from 'react';
import {useScrollContext} from '../context/ScrollContext';

/**
 * Hook to track scroll direction and hide/show tab bar.
 * Use on FlatList: onScroll={handleScroll} scrollEventThrottle={16}
 */
const useScrollDirection = () => {
  const {setTabBarVisible} = useScrollContext();
  const lastOffsetRef = useRef(0);
  const directionRef = useRef('up');

  const handleScroll = useCallback(
    event => {
      const currentOffset = event.nativeEvent.contentOffset.y;
      const direction = currentOffset > lastOffsetRef.current ? 'down' : 'up';

      // Only update if direction changed and we've scrolled more than 5px
      if (direction !== directionRef.current && Math.abs(currentOffset - lastOffsetRef.current) > 5) {
        directionRef.current = direction;
        setTabBarVisible(direction === 'up');
      }

      lastOffsetRef.current = currentOffset;
    },
    [setTabBarVisible],
  );

  return {handleScroll};
};

export default useScrollDirection;
