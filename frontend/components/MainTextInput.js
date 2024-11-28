import { TextInput, useWindowDimensions, View } from "react-native";

const MainTextInput = ({ placeholder, width, SvgIcon, isPassword=false, value, onChangeText }) => {
    const vw = useWindowDimensions().width

    return (
        <View style={{width: width, maxWidth: vw - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 8, backgroundColor: 'white', paddingLeft: 10, borderColor: '#D5D5D5'}}>
            <SvgIcon />
            <TextInput value={value} onChangeText={onChangeText} secureTextEntry={isPassword} placeholderTextColor="#D5D5D5" placeholder={placeholder} style={{width: width-40, maxWidth: vw - 80, paddingVertical: 10, outline: 'none'}} />
        </View>
    );
};

export default MainTextInput;
