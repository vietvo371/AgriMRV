import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, NavigationProp } from '@react-navigation/native';
import api from "./Api";
import Toast from "react-native-toast-message";

export const saveToken = async (token: string) => {
    await AsyncStorage.setItem('token', token);
}

export const getToken = async () => {
    return await AsyncStorage.getItem('token');
}

export const removeToken = async () => {
    await AsyncStorage.removeItem('token');
}

export const checkToken = async (navigation: NavigationProp<any>) => {
    try {
        const token = await getToken();
        if (token) {
            const res = await api.get('/check-login');
            if (res.data?.status) {
                const newToken = res.data?.token ?? res.data?.data?.token;
                if (newToken && newToken !== null) {
                    await saveToken(newToken);
                }
                return true;
            } else {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "Login" }],
                    })
                );
                Toast.show({
                    text1: 'Vui lòng đăng nhập hệ thống!',
                    type: 'error',
                });
                return false;
            }
        }
        return false;
    } catch (error) {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Login" }],
            })
        );
        Toast.show({
            text1: 'Vui lòng đăng nhập hệ thống!',
            type: 'error',
        });
        return false;
    }
}