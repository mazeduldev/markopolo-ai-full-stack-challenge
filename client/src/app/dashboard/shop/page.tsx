"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, Globe, DollarSign, Clock, Calendar } from "lucide-react";

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

const fetchShop = async (): Promise<Shop> => {
  const response = await fetch("/api/store");
  if (!response.ok) {
    throw new Error("Failed to fetch shop data");
  }
  return response.json();
};

export default function Shop() {
  const {
    data: shop,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["shop"],
    queryFn: fetchShop,
  });

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
          <CardTitle className="flex items-center gap-2">
            {shop?.name}
            <Badge variant="secondary">Active</Badge>
          </CardTitle>
          <CardDescription>
            Manage your shop configuration and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Globe className="w-4 h-4" />
                Shop URL
              </div>
              <p className="text-sm">{shop?.url}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                Currency
              </div>
              <p className="text-sm">{shop?.currency}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="w-4 h-4" />
                Timezone
              </div>
              <p className="text-sm">{shop?.timezone}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Created
              </div>
              <p className="text-sm">
                {shop?.created_at
                  ? new Date(shop.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Shop ID
              </div>
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
