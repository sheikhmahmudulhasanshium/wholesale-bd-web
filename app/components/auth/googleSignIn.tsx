"use client";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { useAuth } from "../contexts/auth-context";

export const SignInWithGoogleButton = () => {
  const router = useRouter();

  const [user, setUser] = useState<string | null>(null);

  //   useEffect(() => {
  //     const unsubscribe = () => {
  //       const token = getCookie(userInfoToken);
  //       if (token) {
  //         setUser(token);
  //       }
  //     };

  //     return () => unsubscribe();
  //   }, []);

  const { login } = useAuth();
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;

    setUser(token ?? "");

    try {
      const credential = GoogleAuthProvider.credential(token);
      await signInWithCredential(auth, credential);

      const res = fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/googles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken: token }),
      });
      const data2 = await (await res).json();
      console.log(data2);
      //   setCookie(userInfoToken, data2.access_token, { path: "/" });
      router.push("/products");
    } catch (error) {
      console.error("Firebase authentication error:", error);
    }
  };

  const handleError = () => {
    console.log("Login Faileds");
  };

  return (
    <div>
      {!user ? (
        <div className="mt-4 flex justify-between">
          <p></p>
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
          <p></p>
        </div>
      ) : (
        <div className="mt-4 flex justify-between p-6">
          <p></p>
          <img src="/icons/siri_loading.gif" alt="siri loading" />
          <p></p>
        </div>
      )}
    </div>
  );
};
