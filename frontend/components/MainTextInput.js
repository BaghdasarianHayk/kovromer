import { Text, TextInput, useWindowDimensions, View } from "react-native";

const MainTextInput = ({ placeholder, width, SvgIcon, isPassword=false, value, onChangeText, label }) => {
    const vw = useWindowDimensions().width

    return (
        <View style={{width: width, maxWidth: vw - 40}}>
        {label?.length > 0 && <Text style={{width: '100%', fontWeight: '500', marginBottom: 6, opacity: 0.8}} numberOfLines={1}>{label}</Text>}
        <View style={{width: "100%", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 8, backgroundColor: 'white', paddingLeft: 10, borderColor: '#D5D5D5'}}>
            <SvgIcon />
            <TextInput value={value} onChangeText={onChangeText} secureTextEntry={isPassword} placeholderTextColor="#D5D5D5" placeholder={placeholder} style={{width: width-40, maxWidth: vw - 80, paddingVertical: 10, outline: 'none'}} />
        </View>
        </View>
    );
};

export default MainTextInput;
