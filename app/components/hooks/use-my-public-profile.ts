"use client";

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { PublicUserProfile } from '@/lib/types';
import { useAuth } from '../contexts/auth-context';
import axios from 'axios'; // <-- 1. Import axios to use its helper function

export const useMyPublicProfile = () => {
  const { user } = useAuth();
  const [publicProfile, setPublicProfile] = useState<PublicUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  useEffect(() => {
    if (!user?._id) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.users.getPublicProfileById(user._id, controller.signal);
        setPublicProfile(response.data);
      } catch (err) {
        // --- vvvvvvvvvv FIX APPLIED HERE vvvvvvvvvv ---
        // 2. Check if the error is an Axios cancellation error.
        // If it is, we silently ignore it because it's expected behavior.
        if (!axios.isCancel(err)) {
          console.error(`Failed to fetch public profile for current user.`, err);
        }
        // --- ^^^^^^^^^^ FIX APPLIED HERE ^^^^^^^^^^ ---
      } finally {
        // This check is important to prevent a state update on an unmounted component
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    return () => controller.abort();
  }, [user?._id]);

  return { publicProfile, isLoading };
};