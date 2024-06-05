import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const CategoryFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const newData = [
    { name: 'Tent House', image: require('../assets/categoriesPngs/tenthouse_icon.png') },
    { name: 'Halls', image: require('../assets/categoriesPngs/hall_icon.png') },
    { name: 'Decoration', image: require('../assets/categoriesPngs/decoration_icon.png') },
    { name: 'Catering', image: require('../assets/categoriesPngs/catering_icon.png') },
  ];

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    // Here, you can implement the logic to show the filtered UI based on the selected category
    // For example, fetch filtered data and update the state to display the filtered content
  };

  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        {newData.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryItem,
              selectedCategory === category.name && styles.selectedCategory,
            ]}
            onPress={() => handleCategorySelect(category.name)}
          >
            {selectedCategory === category.name ? (
              <LinearGradient 
                start={{ x: 0, y: 1.2 }} 
                end={{ x: 0, y: 0 }} 
                colors={['#FFDB7E','#FFF3CD']} 
                style={styles.gradient}
              >
                <Image source={category.image} style={styles.categoryIcon} />
                <Text style={[styles.categoryLabel, styles.selectedCategoryLabel]}>
                  {category.name}
                </Text>
                <View style={styles.selectedIndicator} />
              </LinearGradient>
            ) : (
              <>
                <Image source={category.image} style={styles.categoryIcon} />
                <Text style={styles.categoryLabel}>{category.name}</Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.filteredContent}>
        {selectedCategory ? (
          <Text>Showing filtered content for: {selectedCategory}</Text>
        ) : (
          <Text>Please select a category to see the filtered content.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFEFC0',
    paddingHorizontal: 5,
    // paddingTop: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryItem: {
    alignItems: 'center',
    width: Dimensions.get('window').width / 4.1,
  },
  selectedCategory: {
    borderRadius: 10,
  },
  gradient: {
    alignItems: 'center',
    // borderRadius: 10,
    width:Dimensions.get('window').width / 4.1,
    // height:"auto"
    // padding: 5,
  },
  selectedIndicator: {
    width: "100%",
    height: 4,
    backgroundColor: "#D2453B",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    marginTop:10
  },
  categoryLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryLabel: {
    color: '#d32f2f',
  },
  filteredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoryFilter;
