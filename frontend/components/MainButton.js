import { TouchableOpacity, Text, useWindowDimensions } from "react-native";

const MainButton = ({ text, type, onPress, defaultWidth }) => {
    
    const { width } = useWindowDimensions()

    return (
        <TouchableOpacity 
            style={{
                width: defaultWidth,
                maxWidth: width - 40,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: type === 'standard' ? "#0065FD" : "#EB0000",
                alignItems: 'center'
            }} 
            onPress={onPress}
        >
            <Text 
                numberOfLines={1} 
                style={{
                    color: 'white',
                    width: '100%',
                    textAlign: 'center'
                }}
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
};

export default MainButton;
