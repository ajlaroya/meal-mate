import { CreateUserParams, SignInParams } from "@/type";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform: "com.mealmate",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) {
      throw new Error("User creation failed");
    }

    await signIn({ email, password });

    const avatarUrl = await avatars.getInitialsURL(name);

    return await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollectionId!,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        name,
        avatar: avatarUrl,
      }
    );
  } catch (error) {
    throw new Error(`Failed to create user: ${error}`);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    if (!session) {
      throw new Error("Sign in failed");
    }

    return session;
  } catch (error) {
    throw new Error(`Failed to sign in: ${error}`);
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();

    if (!user) {
      throw new Error("User not found");
    }
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollectionId!,
      [Query.equal("accountId", user.$id)]
    );

    if (!currentUser.documents.length) {
      throw new Error("User document not found");
    }

    return currentUser.documents[0];
  } catch (error) {
    throw new Error(`Failed to get current user: ${error}`);
  }
};

// 1:55:05