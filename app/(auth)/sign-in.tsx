import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { signIn } from "@/lib/appwrite";
import * as Sentry from "@sentry/react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    const { email, password } = form;

    if (!email || !password)
      return Alert.alert("Error", "Please fill all fields");

    setIsSubmitting(true);

    try {
      await signIn({ email, password });

      router.replace("/");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "An error occurred while signing in"
      );
      Sentry.captureEvent(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter your email"
        label="Email"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Enter your password"
        label="Password"
        value={form.password}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        secureTextEntry={true}
      />
      <CustomButton title="Sign In" isLoading={isSubmitting} onPress={submit} />

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-primary base-bold">
            Sign Up
          </Link>
        </Text>
      </View>
    </View>
  );
};

export default SignIn;
