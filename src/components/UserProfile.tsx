import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { User, useAuth } from "@/services/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ open, onOpenChange }) => {
  const { currentUser, updateUserProfile, updateUserPreferences } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<User>>(
    currentUser
      ? {
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone || "",
          department: currentUser.department || "",
        }
      : {},
  );

  const [preferences, setPreferences] = useState(
    currentUser?.preferences || {
      theme: "light" as const,
      notifications: true,
      dashboardLayout: "default",
    },
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;

    try {
      // Update profile information
      await updateUserProfile(currentUser.id, formData);

      // Update preferences
      await updateUserPreferences(currentUser.id, preferences);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!currentUser) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-4 py-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
              alt={currentUser.name}
            />
            <AvatarFallback>
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{currentUser.name}</h3>
            <p className="text-sm text-muted-foreground">{currentUser.role}</p>
            <p className="text-xs text-muted-foreground">
              {currentUser.department}
            </p>
          </div>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="col-span-3"
              disabled
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>

          <div className="border-t pt-4 mt-2">
            <h4 className="font-medium mb-3">Preferences</h4>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="theme" className="text-right">
                Theme
              </Label>
              <Select
                value={preferences.theme}
                onValueChange={(value: "light" | "dark" | "system") =>
                  setPreferences({ ...preferences, theme: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mt-4">
              <Label htmlFor="notifications" className="text-right">
                Notifications
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="notifications"
                  checked={preferences.notifications}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      notifications: checked,
                    })
                  }
                />
                <Label htmlFor="notifications">
                  {preferences.notifications ? "Enabled" : "Disabled"}
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mt-4">
              <Label htmlFor="layout" className="text-right">
                Dashboard Layout
              </Label>
              <Select
                value={preferences.dashboardLayout}
                onValueChange={(value) =>
                  setPreferences({ ...preferences, dashboardLayout: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="expanded">Expanded</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveProfile}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;
