import { TouchableOpacity, Text, useWindowDimensions } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

const CheckBox = ({ text, checked, onPress, width }) => {
    const vw = useWindowDimensions().width

    return (
        <TouchableOpacity 
            style={{
                width: width,
                maxWidth: vw - 40,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: checked === true ? "rgba(0,101,253,0.15)" : "transparent",
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                borderWidth: 1,
                borderColor: checked ? 'rgba(0,101,253,1)' : 'rgba(0,0,0,0.2)'
            }} 
            onPress={onPress}
        >
            
            {checked ?
                <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <Rect width="14" height="14" rx="2" fill="#0065FD"/>
                    <Path fillRule="evenodd" clipRule="evenodd" d="M10.8709 5.1136C11.0439 5.26432 11.0429 5.50785 10.8687 5.65753L5.94565 9.88829C5.77234 10.0372 5.49262 10.0372 5.31931 9.88829L3.13127 8.00795C2.9571 7.85827 2.95612 7.61475 3.12908 7.46402C3.30204 7.3133 3.58345 7.31245 3.75762 7.46213L5.63248 9.07334L10.2424 5.11171C10.4166 4.96203 10.698 4.96288 10.8709 5.1136Z" fill="white" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                </Svg>
                :             
                <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <Rect x="0.5" y="0.5" width="13" height="13" rx="1.5" stroke="black" strokeOpacity="0.6"/>
                </Svg>
            }

            <Text 
                numberOfLines={1} 
                style={{
                    fontWeight: '500',
                    color: checked === true ? "rgba(0,101,253,1)" : "rgba(0,0,0,0.6)",
                    width: 'calc(100% - 60px)',
                }}
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
};

export default CheckBox;
