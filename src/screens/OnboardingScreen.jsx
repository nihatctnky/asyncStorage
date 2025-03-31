import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Onboarding from "react-native-onboarding-swiper"
import Lottie from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';  // AsyncStorage importu
import SCREENS from '../utils/router';

const { width, height } = Dimensions.get('window')
const { HOME, ONBOARDING, TODOS } = SCREENS;

const OnboardingScreens = () => {
  const navigation = useNavigation();

  const handleDone = async () => {
    await AsyncStorage.setItem("onboarded", "1");  // AsyncStorage'da değer kaydet
    navigation.navigate(HOME); // Home sayfasına git
  }

  const doneButton = ({ ...props }) => {
    return (
      <TouchableOpacity style={styles.doneButton} {...props}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}  // Onboarding bittiğinde handleDone fonksiyonunu çalıştır
        onSkip={handleDone}  // Skip yapıldığında handleDone fonksiyonunu çalıştır
        DoneButtonComponent={doneButton}  // Custom done butonu
        pages={[
          {
            backgroundColor: "#a7f3da",
            image: (
              <View style={styles.lottie}>
                <Lottie
                  style={{ flex: 1 }}
                  source={require("../assets/animations/boost.json")}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: "Boost Your Productivity",
            subtitle: "Join our Udemig courses to enhance your skills"
          },
          {
            backgroundColor: "#fef3ce",
            image: (
              <View style={styles.lottie}>
                <Lottie
                  style={{ flex: 1 }}
                  source={require("../assets/animations/achieve.json")}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: "Work Without Interruptions",
            subtitle: "Complete your tasks smoothly with our Productivity tips"
          },
          {
            backgroundColor: "#a78bfa",
            image: (
              <View style={styles.lottie}>
                <Lottie
                  style={{ flex: 1 }}
                  source={require("../assets/animations/work.json")}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: "React Higher Goals",
            subtitle: "Utilize our platform to achieve your professional aspirations"
          }
        ]}
      />
    </View>
  );
}

export default OnboardingScreens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  lottie: {
    width: width * 0.9,
    height: width,
  },
  doneButton: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  doneButtonText: { 
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  }
});
