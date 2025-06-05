import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';

import MapComponent from './components/MapComponent';
import EmergencyButton from './components/EmergencyButton';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';
import FAB from './components/FAB';
import WelcomeScreen from './screens/WelcomeScreen';
import EmergencyScreen from './screens/EmergencyScreen';
import TrustedContactsScreen from './screens/TrustedContactsScreen';
import SOSMapScreen from './screens/SOSMapScreen';
import ReportHistoryScreen from './screens/ReportHistoryScreen'; 
import CustomTabBarBackground from './components/CustomTabBarBackground';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Bem-vindo ao Reage+</Text>
  </View>
);

const MapScreen = () => <MapComponent />;
const ReportScreen = () => <ReportForm />;
const ListScreen = () => <ReportList />;

const MainTabs = ({ navigation }) => (
  <View style={{ flex: 1 }}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarBackground: () => <CustomTabBarBackground />,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#1e88e5',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 2,
          fontWeight: '600',
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          backgroundColor: 'transparent',
          borderRadius: 40,
          height: 80,
          elevation: 0,
          borderTopWidth: 0,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Mapa':
              iconName = 'map-pin';
              break;
            case 'Reportar':
              iconName = 'edit';
              break;
            case 'Ocorrências':
              iconName = 'list';
              break;
            default:
              iconName = 'circle';
          }

          return (
            <Feather
              name={iconName}
              size={focused ? 28 : 22}
              color={color}
              style={focused ? styles.iconFocused : {}}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Mapa" component={MapScreen} />
      <Tab.Screen name="Reportar" component={ReportScreen} />
      <Tab.Screen name="Ocorrências" component={ListScreen} />
    </Tab.Navigator>

    <View style={styles.fabWrapper}>
      <FAB onPress={() => navigation.navigate('Emergency')} />
    </View>
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ animation: 'fade' }}
        />
         <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Emergency"
          component={EmergencyScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="TrustedContacts"
          component={TrustedContactsScreen}
          options={{ animation: 'fade_from_bottom' }}
        />
        <Stack.Screen
          name="SOSMap"
          component={SOSMapScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="ReportHistory"
          component={ReportHistoryScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  fabWrapper: {
    position: 'absolute',
    bottom: 45,
    alignSelf: 'center',
    zIndex: 99,
  },
  iconFocused: {
    transform: [{ scale: 1.1 }],
  },
});









