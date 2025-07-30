import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, {
  Image as SVGImage,
  G,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import OnboardingCircleImg from '../../assets/OnBoardingCircleImg.png';

const size = 350;

const AnimatedG = Animated.createAnimatedComponent(G);

const QuadrantWheelWithImages = () => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 2000 });
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
      <Svg width={size} height={size}>
        <AnimatedG animatedProps={animatedProps}>
          <SVGImage
            width={size}
            height={size}
            href={OnboardingCircleImg}
            preserveAspectRatio="xMidYMid slice"
          />
        </AnimatedG>
      </Svg>
    </View>
  );
};

export default QuadrantWheelWithImages;
