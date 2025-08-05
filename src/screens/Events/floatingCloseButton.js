import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { CloseIcon } from './closeIcon';

const FloatingCloseButton = ({ onPress }) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <CloseIcon size={20} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10, // Adjust to float above the sheet
    alignSelf: 'center',
    zIndex: 99,
  },
  button: {
    backgroundColor: '#000000',
    borderRadius: 999,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

export default FloatingCloseButton;
