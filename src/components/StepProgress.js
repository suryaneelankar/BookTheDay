import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';

const StepProgress = ({ status }) => {
    const isActive = (step) => {
        const steps = ['requested', 'approved', 'rejected'];
        return steps.indexOf(step) <= steps.indexOf(status.toLowerCase());
    };

    return (
        <View style={styles.container}>
            <View style={styles.stepContainer}>
                {/* Confirmation Step */}
                <View style={styles.step}>
                    <View
                        style={[
                            styles.circle,
                            isActive('requested') ? styles.activeCircle : styles.inactiveCircle,
                        ]}
                    >
                        <Icon
                            name="check"
                            size={10}
                            color={isActive('requested') ? '#FD813B' : '#A9A9A9'}
                        />
                    </View>

                </View>

                {/* Line between steps */}
                <View style={isActive('approved') ? styles.approveActiveLine : styles.approveInactiveLine} />


                {/* In Progress Step */}
                <View style={styles.step}>
                    <View
                        style={[
                            styles.circle,
                            isActive('approved') ? styles.activeCircle : styles.inactiveCircle,
                        ]}
                    >
                        <Icon
                            name="leaf"
                            size={10}
                            color={isActive('approved') ? '#FD813B' : '#A9A9A9'}
                        />
                    </View>

                </View>

                {/* Line between steps */}
                <View style={isActive('rejected') ? styles.activeLine : styles.inactiveLine} />


                {/* Payment Step */}
                <View style={styles.step}>
                    <View
                        style={[
                            styles.circle,
                            isActive('rejected') ? styles.activeCircle : styles.inactiveCircle,
                        ]}
                    >
                        <Icon
                            name="dollar"
                            size={10}
                            color={isActive('rejected') ? '#FD813B' : '#A9A9A9'}
                        />
                    </View>

                </View>
            </View>
            
            <View style={styles.stepTextContainer}>
                    <Text
                        style={[
                            styles.label,
                            isActive('requested') ? styles.activeLabel : styles.inactiveLabel,
                        ]}
                    >
                        Initiated
                    </Text>
                    <Text
                        style={[
                            styles.lableprogess,
                            isActive('approved') ? styles.activeLabel : styles.inactiveLabel,
                        ]}
                    >
                        Confirmed
                    </Text>
                    <Text
                        style={[
                            styles.paymentLabel,
                            isActive('rejected') ? styles.activeLabel : styles.inactiveLabel,
                        ]}
                    >
                        Payment
                    </Text>
                </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      width:"100%",
      alignSelf:"center",
      alignItems:"center"
    },
    approveActiveLine: {
        width: 90,
        borderWidth: 1,
        borderColor: '#FD813B',
        marginHorizontal: 5,
        borderStyle:"dashed"
    },
    approveInactiveLine: {
        width: 90,
        borderWidth: 1,
        borderColor: '#A9A9A9',
        marginHorizontal: 5,
        borderStyle:'dashed'
    },
    activeLine: {
        width: 90,
        borderWidth: 1,
        borderColor: '#FD813B',
        marginHorizontal: 5,
        borderStyle:'dashed'
    },
    inactiveLine: {
        width: 90,
        borderWidth: 2,
        borderColor: '#A9A9A9',
        marginHorizontal: 5,
        borderStyle:'dashed'

    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width:"90%",
        justifyContent:"center"
    },
    stepTextContainer: {
        flexDirection: 'row',
        
    },
    
    step: {
        alignItems: 'center',
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    activeCircle: {
        borderColor: '#FD813B',
    },
    inactiveCircle: {
        borderColor: '#A9A9A9',
    },
    label: {
        marginTop: 5,
        fontWeight: '600', 
    },
    lableprogess: {
        marginTop: 5,
        fontWeight: '600',
    
    },
    paymentLabel: {
        marginTop: 5,
        fontWeight: '600',
      
    },
    activeLabel: {
        color: '#FD813B',
    },
    inactiveLabel: {
        color: '#A9A9A9',
    },
});

export default StepProgress;
