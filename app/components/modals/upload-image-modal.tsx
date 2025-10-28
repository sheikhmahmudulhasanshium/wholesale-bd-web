"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface UploadImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  uploadType: 'profile' | 'background';
}

export function UploadImageModal({ isOpen, onClose, onUploadSuccess, uploadType }: UploadImageModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUrl(''); // Clear URL if a file is selected
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setFile(null); // Clear file if a URL is entered
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let uploadPromise;
      const uploadFnFile = uploadType === 'profile' ? apiClient.users.uploadProfilePicture : apiClient.users.uploadBackgroundPicture;
      const uploadFnUrl = uploadType === 'profile' ? apiClient.users.setProfilePictureFromUrl : apiClient.users.setBackgroundPictureFromUrl;

      if (file) {
        uploadPromise = uploadFnFile(file);
      } else if (url) {
        uploadPromise = uploadFnUrl(url);
      } else {
        toast.warning("Please select a file or provide a URL.");
        setIsLoading(false);
        return;
      }
      
      await uploadPromise;
      toast.success(`${uploadType === 'profile' ? 'Profile' : 'Background'} picture updated successfully!`);
      onUploadSuccess();
      onClose();
      
      // --- CHANGE ADDED HERE ---
      // Force a full page reload to ensure the new image is displayed
      window.location.reload();
      
    } catch (error) {
      console.error("Upload failed:", error);
      // Global error handler in apiClient will show a toast
    } finally {
      setIsLoading(false);
    }
  };

  const title = uploadType === 'profile' ? 'Update Profile Picture' : 'Update Background Picture';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="picture-file">Upload from your device</Label>
            <Input id="picture-file" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <div className="text-center text-sm text-muted-foreground">OR</div>
          <div>
            <Label htmlFor="picture-url">Import from a URL</Label>
            <Input id="picture-url" type="url" placeholder="https://example.com/image.png" value={url} onChange={handleUrlChange} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Uploading...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}