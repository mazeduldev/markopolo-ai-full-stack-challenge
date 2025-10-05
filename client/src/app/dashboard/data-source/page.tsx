"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Database,
  Globe,
  ShoppingBag,
  Megaphone,
  Plus,
  Power,
  PowerOff,
} from "lucide-react";
import { toast } from "sonner";
import { DataSummary } from "@/components/data-summary/DataSummary";
import { DataSummaryResponse } from "@/types/data-summary";

interface DataSourceConnection {
  id: string;
  type: "website_analytics" | "google_ads" | "shopify";
  status: "connected" | "disconnected";
}

interface CreateConnectionData {
  type: string;
  credentials: Record<string, any>;
  config: {
    sync_frequency: string;
    enabled_features: string[];
  };
}

const dataSourceTypes: Array<{
  type: DataSourceConnection["type"];
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}> = [
  {
    type: "website_analytics",
    label: "Website Analytics",
    icon: Globe,
    description: "Connect Google Analytics to track website performance",
  },
  {
    type: "google_ads",
    label: "Google Ads",
    icon: Megaphone,
    description: "Connect Google Ads to manage advertising campaigns",
  },
  {
    type: "shopify",
    label: "Shopify",
    icon: ShoppingBag,
    description: "Connect Shopify to sync products and orders",
  },
];

const getAvailableFeatures = (
  type: DataSourceConnection["type"] | undefined,
) => {
  const features = {
    website_analytics: [
      { id: "page_views", label: "Page Views" },
      { id: "user_sessions", label: "User Sessions" },
      { id: "conversion_tracking", label: "Conversion Tracking" },
      { id: "audience_insights", label: "Audience Insights" },
    ],
    google_ads: [
      { id: "campaign_performance", label: "Campaign Performance" },
      { id: "keyword_analysis", label: "Keyword Analysis" },
      { id: "ad_spend_tracking", label: "Ad Spend Tracking" },
      { id: "audience_targeting", label: "Audience Targeting" },
    ],
    shopify: [
      { id: "sales_data", label: "Sales Data" },
      { id: "inventory_tracking", label: "Inventory Tracking" },
      { id: "customer_analytics", label: "Customer Analytics" },
      { id: "product_performance", label: "Product Performance" },
    ],
  };
  return type ? features[type] : [];
};

const fetchConnections = async (): Promise<DataSourceConnection[]> => {
  const response = await fetch("/api/data-source-connection");
  if (!response.ok) {
    throw new Error("Failed to fetch connections");
  }
  return response.json();
};

const createConnection = async (
  data: CreateConnectionData,
): Promise<DataSourceConnection> => {
  const response = await fetch("/api/data-source-connection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create connection");
  }
  return response.json();
};

const toggleConnection = async (id: string): Promise<DataSourceConnection> => {
  const response = await fetch(
    `/api/data-source-connection/${id}/toggle-connection`,
    {
      method: "PATCH",
    },
  );
  if (!response.ok) {
    throw new Error("Failed to toggle connection");
  }
  return response.json();
};

// Define validation schemas for each data source type
const websiteAnalyticsSchema = z.object({
  api_key: z.string().min(1, "API Key is required"),
  access_token: z.string().min(1, "Access Token is required"),
  sync_frequency: z.string().min(1, "Sync frequency is required"),
  enabled_features: z
    .array(z.string())
    .min(1, "At least one feature must be enabled"),
});

const googleAdsSchema = z.object({
  customer_id: z.string().min(1, "Customer ID is required"),
  access_token: z.string().min(1, "Access Token is required"),
  sync_frequency: z.string().min(1, "Sync frequency is required"),
  enabled_features: z
    .array(z.string())
    .min(1, "At least one feature must be enabled"),
});

const shopifySchema = z.object({
  shop_domain: z.string().url().min(1, "Shop Domain is required"),
  access_token: z.string().min(1, "Access Token is required"),
  sync_frequency: z.string().min(1, "Sync frequency is required"),
  enabled_features: z
    .array(z.string())
    .min(1, "At least one feature must be enabled"),
});

type WebsiteAnalyticsForm = z.infer<typeof websiteAnalyticsSchema>;
type GoogleAdsForm = z.infer<typeof googleAdsSchema>;
type ShopifyForm = z.infer<typeof shopifySchema>;

export default function DataSource() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] =
    useState<DataSourceConnection["type"]>();
  const queryClient = useQueryClient();

  // Forms for each connection type
  const websiteAnalyticsForm = useForm<WebsiteAnalyticsForm>({
    resolver: zodResolver(websiteAnalyticsSchema),
    defaultValues: {
      api_key: "",
      access_token: "",
      sync_frequency: "daily",
      enabled_features: [],
    },
  });

  const googleAdsForm = useForm<GoogleAdsForm>({
    resolver: zodResolver(googleAdsSchema),
    defaultValues: {
      customer_id: "",
      access_token: "",
      sync_frequency: "daily",
      enabled_features: [],
    },
  });

  const shopifyForm = useForm<ShopifyForm>({
    resolver: zodResolver(shopifySchema),
    defaultValues: {
      shop_domain: "",
      access_token: "",
      sync_frequency: "daily",
      enabled_features: [],
    },
  });

  const isWebsiteAnalyticsForm = (
    form: any,
  ): form is typeof websiteAnalyticsForm => {
    return selectedType === "website_analytics";
  };

  const isGoogleAdsForm = (
    form: any,
  ): form is ReturnType<typeof useForm<GoogleAdsForm>> => {
    return selectedType === "google_ads";
  };

  const isShopifyForm = (
    form: any,
  ): form is ReturnType<typeof useForm<ShopifyForm>> => {
    return selectedType === "shopify";
  };

  const getCurrentForm = () => {
    switch (selectedType) {
      case "website_analytics":
        return websiteAnalyticsForm;
      case "google_ads":
        return googleAdsForm;
      case "shopify":
        return shopifyForm;
      default:
        return null;
    }
  };

  const { data: connections = [], isLoading } = useQuery({
    queryKey: ["connections"],
    queryFn: fetchConnections,
  });

  const { data: dataSummary, isLoading: dataSummaryLoading } =
    useQuery<DataSummaryResponse>({
      queryKey: ["data-summary"],
      queryFn: async () => {
        const response = await fetch(`/api/data-summary`);
        if (!response.ok) {
          throw new Error("Failed to fetch data summary");
        }
        return response.json();
      },
    });

  const createMutation = useMutation({
    mutationFn: createConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      queryClient.invalidateQueries({ queryKey: ["data-summary"] });
      setIsDialogOpen(false);
      setSelectedType(undefined);
      toast.success("Data source connected successfully");
    },
    onError: () => {
      toast.error("Failed to connect data source");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      queryClient.invalidateQueries({ queryKey: ["data-summary"] });
      toast.success("Connection status updated");
    },
    onError: () => {
      toast.error("Failed to update connection status");
    },
  });

  const getConnectionForType = (type: string) => {
    return connections.find((conn) => conn.type === type);
  };

  const handleCreateConnection = () => {
    const currentForm = getCurrentForm();
    if (!currentForm || !selectedType) return;

    currentForm.handleSubmit((data) => {
      const { enabled_features, sync_frequency, ...credentials } = data;

      const connectionData: CreateConnectionData = {
        type: selectedType,
        credentials,
        config: {
          sync_frequency,
          enabled_features,
        },
      };

      createMutation.mutate(connectionData);
    })();
  };

  const renderCredentialFields = () => {
    const currentForm = getCurrentForm();
    if (!currentForm) return null;

    if (isWebsiteAnalyticsForm(currentForm)) {
      const {
        register,
        formState: { errors },
        watch,
        setValue,
      } = currentForm;

      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api_key">
              API Key <span className="text-red-500">*</span>
            </Label>
            <Input
              id="api_key"
              placeholder="Enter Google Analytics API Key"
              {...register("api_key")}
            />
            {errors.api_key && (
              <p className="text-sm text-red-500">{errors.api_key.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="access_token">
              Access Token <span className="text-red-500">*</span>
            </Label>
            <Input
              id="access_token"
              placeholder="Enter Access Token"
              {...register("access_token")}
            />
            {errors.access_token && (
              <p className="text-sm text-red-500">
                {errors.access_token.message}
              </p>
            )}
          </div>
          {renderCommonFields(register, errors, watch, setValue)}
        </div>
      );
    }

    if (isGoogleAdsForm(currentForm)) {
      const {
        register,
        formState: { errors },
        watch,
        setValue,
      } = currentForm;

      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer_id">
              Customer ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customer_id"
              placeholder="123-456-7890"
              {...register("customer_id")}
            />
            {errors.customer_id && (
              <p className="text-sm text-red-500">
                {errors.customer_id.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="access_token">
              Access Token <span className="text-red-500">*</span>
            </Label>
            <Input
              id="access_token"
              placeholder="Enter Access Token"
              {...register("access_token")}
            />
            {errors.access_token && (
              <p className="text-sm text-red-500">
                {errors.access_token.message}
              </p>
            )}
          </div>
          {renderCommonFields(register, errors, watch, setValue)}
        </div>
      );
    }

    if (isShopifyForm(currentForm)) {
      const {
        register,
        formState: { errors },
        watch,
        setValue,
      } = currentForm;

      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shop_domain">
              Shop Domain <span className="text-red-500">*</span>
            </Label>
            <Input
              id="shop_domain"
              placeholder="https://my-store.myshopify.com"
              {...register("shop_domain")}
            />
            {errors.shop_domain && (
              <p className="text-sm text-red-500">
                {errors.shop_domain.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="access_token">
              Access Token <span className="text-red-500">*</span>
            </Label>
            <Input
              id="access_token"
              placeholder="Enter Shopify Access Token"
              {...register("access_token")}
            />
            {errors.access_token && (
              <p className="text-sm text-red-500">
                {errors.access_token.message}
              </p>
            )}
          </div>
          {renderCommonFields(register, errors, watch, setValue)}
        </div>
      );
    }
  };

  const renderCommonFields = (
    register: any,
    errors: any,
    watch: any,
    setValue: any,
  ) => {
    const watchedFeatures = watch("enabled_features") || [];

    return (
      <>
        {/* Sync Frequency */}
        <div className="space-y-2">
          <Label htmlFor="sync_frequency">
            Sync Frequency <span className="text-red-500">*</span>
          </Label>
          <select
            id="sync_frequency"
            {...register("sync_frequency")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          {errors.sync_frequency && (
            <p className="text-sm text-red-500">
              {errors.sync_frequency.message}
            </p>
          )}
        </div>

        {/* Feature Selection */}
        <div className="space-y-2">
          <Label className="text-base font-medium">
            Enabled Features <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {getAvailableFeatures(selectedType).map((feature: any) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={feature.id}
                  checked={watchedFeatures.includes(feature.id)}
                  onChange={(e) => {
                    const updatedFeatures = e.target.checked
                      ? [...watchedFeatures, feature.id]
                      : watchedFeatures.filter((f: string) => f !== feature.id);
                    setValue("enabled_features", updatedFeatures);
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label
                  htmlFor={feature.id}
                  className="text-sm font-normal cursor-pointer"
                >
                  {feature.label}
                </Label>
              </div>
            ))}
          </div>
          {errors.enabled_features && (
            <p className="text-sm text-red-500">
              {errors.enabled_features.message}
            </p>
          )}
        </div>
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Data Sources</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-2/3"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col flex-1 h-full">
      <div className="flex items-center space-x-2">
        <Database className="w-8 h-8" />
        <h1 className="text-3xl font-bold">Data Sources</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dataSourceTypes.map((source) => {
          const Icon = source.icon;
          const connection = getConnectionForType(source.type);
          const isConnected = connection?.status === "connected";

          return (
            <Card key={source.type}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {source.label}
                  {connection && (
                    <Badge variant={isConnected ? "default" : "secondary"}>
                      {connection.status}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>{source.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {!connection ? (
                    <Dialog
                      open={isDialogOpen && selectedType === source.type}
                      onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (open) setSelectedType(source.type);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Connect {source.label}</DialogTitle>
                          <DialogDescription>
                            Enter your credentials to connect {source.label}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {renderCredentialFields()}
                          <Button
                            onClick={handleCreateConnection}
                            disabled={createMutation.isPending}
                            className="w-full"
                          >
                            {createMutation.isPending
                              ? "Connecting..."
                              : "Connect"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button
                      variant={isConnected ? "destructive" : "default"}
                      onClick={() => toggleMutation.mutate(connection.id)}
                      disabled={toggleMutation.isPending}
                      className="w-full"
                    >
                      {isConnected ? (
                        <>
                          <PowerOff className="w-4 h-4 mr-2" />
                          Disconnect
                        </>
                      ) : (
                        <>
                          <Power className="w-4 h-4 mr-2" />
                          Reconnect
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="flex-1">
        {!dataSummaryLoading && <DataSummary data={dataSummary} />}
      </div>
    </div>
  );
}
