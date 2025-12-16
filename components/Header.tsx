import { createHomeStyles } from "@/assets/styles/home.styles";
import useTheme from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View, Image } from "react-native";

const Header = () => {
  const { colors } = useTheme();
  const homeStyles = createHomeStyles(colors);

  return (
    <View style={homeStyles.header}>
      <View style={homeStyles.titleContainer}>
        <Image 
            source={require('@/assets/images/icon.png')} 
            style={{ width: 50, height: 45 }}
            resizeMode="contain"
          />

        <View style={homeStyles.titleTextContainer}>
          <Text style={homeStyles.title}>TaskHero</Text>
        </View>
      </View>
    </View>
  );
};

export default Header;