import {Text,View,StyleSheet} from 'react-native'
import { useState } from 'react'
import ChooseFileField from '../../../commonFields/ChooseFileField'
import themevariable from '../../../utils/themevariable'
import AdditionalImages from '../../../commonFields/AdditionalImages'
import TextField from '../../../commonFields/TextField'
import SelectField from '../../../commonFields/SelectField'

const GeneralDetails = ()=>{
    const [productName,setProductName] = useState('')
    const inputHandler=(value)=>{
        setProductName(value)
        console.log("general details inputhandler",value)
    }
    return(
        <View style={styles.root}>
        <View stye={styles.detailsContainer}>
            <ChooseFileField
                label={'Product Image'}
                isRequired={true}
                placeholder={'Main Image'}
            />
            <AdditionalImages/>
            <TextField 
                label='Product Name'
                placeholder="Select Category"
                value={productName}
                onChangeHandler= {inputHandler}
                keyboardType='default'
                isRequired={true}
            />
            <SelectField/>
        </View>
        </View>
    )
}

export default GeneralDetails

const styles=StyleSheet.create({
    root:{
        backgroundColor:themevariable.Color_FFFFFF,
        paddingVertical:20,
        paddingHorizontal:10,
        borderRadius:6,
        marginTop:15
    },
    detailsContainer:{
        backgroundColor:themevariable.Color_FFFFFF,
        borderRadius:10,

    }
})