import {Text,View, StyleSheet,FlatList,Image} from 'react-native'
import uploadIcon from '../assets/svgs/uploadIcon.svg'
import selectedUploadIcon from '../assets/svgs/selectedUploadIcon.svg'
import themevariable from '../utils/themevariable'

const AdditionalImages = ()=>{
    const data =[
        {
            id:0,
            imageUrl:selectedUploadIcon,
        },
        {
            id:1,
            imageUrl:uploadIcon,
        },
        {
            id:2,
            imageUrl:uploadIcon,
        },
        {
            id:3,
            imageUrl:uploadIcon,
        }
    ]

    const ListItem = ({item}) => {
        return(
            <View style={styles.imageContainer}>
                <item.imageUrl style={item.imageUrl == selectedUploadIcon ? styles.selectedImage : styles.image}/>
            </View>
        )
    }

    return(
        <View style={styles.root}>
            <Text style={styles.title}>Additional Images</Text>
            <Text style={styles.subTitle}>Please add up to 4 images*</Text>
            <FlatList
            data={data}
            renderItem={ListItem}
            keyExtractor={item => item.id}
            horizontal
        />
        </View>
    )
}

export default AdditionalImages

const styles=StyleSheet.create({
    root:{
    },
    title:{
        fontFamily:'ManropeRegular',
        fontWeight:'bold',
        color:themevariable.Color_000000,
        fontSize:18,
        marginLeft:8
    },
    subTitle:{
        fontFamily:'ManropeRegular',
        color:themevariable.Color_000000,
        fontSize:13,
        marginTop:7,
        marginBottom:10,
        marginLeft:8
    },
    imageContainer:{},
    image:{
        marginLeft:15,
        marginRight:7,
        marginTop:5
    },
    selectedImage:{}
})