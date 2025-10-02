"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Store,
  Globe,
  DollarSign,
  Clock,
  Calendar,
  Edit,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface Shop {
  id: string;
  user_id: string;
  name: string;
  url: string;
  currency: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

interface UpdateShopData {
  name?: string;
  url?: string;
  currency?: string;
  timezone?: string;
}

const fetchShop = async (): Promise<Shop> => {
  const response = await fetch("/api/store");
  if (!response.ok) {
    throw new Error("Failed to fetch shop data");
  }
  return response.json();
};

const updateShop = async (data: UpdateShopData): Promise<Shop> => {
  const response = await fetch("/api/store", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update shop data");
  }
  return response.json();
};

export default function Shop() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateShopData>({});
  const queryClient = useQueryClient();

  const {
    data: shop,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["shop"],
    queryFn: fetchShop,
  });

  const updateMutation = useMutation({
    mutationFn: updateShop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop"] });
      setIsEditing(false);
      setFormData({});
      toast.success("Shop details updated successfully");
    },
    onError: () => {
      toast.error("Failed to update shop details");
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: shop?.name,
      url: shop?.url,
      currency: shop?.currency,
      timezone: shop?.timezone,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof UpdateShopData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Shop Settings</h1>
        <div className="animate-pulse">
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Shop Settings</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load shop data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Store className="w-8 h-8" />
        <h1 className="text-3xl font-bold">Shop Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {shop?.name}
                <Badge variant="secondary">Active</Badge>
              </CardTitle>
              <CardDescription>
                Manage your shop configuration and settings
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  size="sm"
                  disabled={updateMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Store className="w-4 h-4" />
                Shop Name
              </Label>
              {isEditing ? (
                <Input
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter shop name"
                />
              ) : (
                <p className="text-sm">{shop?.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Globe className="w-4 h-4" />
                Shop URL
              </Label>
              {isEditing ? (
                <Input
                  value={formData.url || ""}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                  placeholder="Enter shop URL"
                  type="url"
                />
              ) : (
                <p className="text-sm">{shop?.url}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                Currency
              </Label>
              {isEditing ? (
                <Input
                  value={formData.currency || ""}
                  onChange={(e) =>
                    handleInputChange("currency", e.target.value)
                  }
                  placeholder="Enter currency (e.g., USD)"
                />
              ) : (
                <p className="text-sm">{shop?.currency}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="w-4 h-4" />
                Timezone
              </Label>
              {isEditing ? (
                <Input
                  value={formData.timezone || ""}
                  onChange={(e) =>
                    handleInputChange("timezone", e.target.value)
                  }
                  placeholder="Enter timezone (e.g., UTC)"
                />
              ) : (
                <p className="text-sm">{shop?.timezone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Created
              </Label>
              <p className="text-sm">
                {shop?.created_at
                  ? new Date(shop.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Shop ID
              </Label>
              <p className="text-xs font-mono bg-muted p-2 rounded">
                {shop?.id}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
