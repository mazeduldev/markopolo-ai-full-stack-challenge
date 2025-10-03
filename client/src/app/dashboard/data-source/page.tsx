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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const dataSourceTypes = [
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

const getAvailableFeatures = (type: DataSourceConnection["type"]) => {
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
  return features[type] || [];
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

export default function DataSource() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [formData, setFormData] = useState<any>({});
  const queryClient = useQueryClient();

  const { data: connections = [], isLoading } = useQuery({
    queryKey: ["connections"],
    queryFn: fetchConnections,
  });

  const createMutation = useMutation({
    mutationFn: createConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      setIsDialogOpen(false);
      setSelectedType("");
      setFormData({});
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
    const connectionData: CreateConnectionData = {
      type: selectedType,
      credentials: formData.credentials || {},
      config: {
        sync_frequency: formData.sync_frequency || "daily",
        enabled_features: formData.enabled_features || [],
      },
    };
    createMutation.mutate(connectionData);
  };

  const renderCredentialFields = () => {
    switch (selectedType) {
      case "website_analytics":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api_key">
                API Key <span className="text-red-500">*</span>
              </Label>
              <Input
                id="api_key"
                placeholder="Enter Google Analytics API Key"
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    credentials: {
                      ...formData.credentials,
                      api_key: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="access_token">
                Access Token <span className="text-red-500">*</span>
              </Label>
              <Input
                id="access_token"
                placeholder="Enter Access Token"
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    credentials: {
                      ...formData.credentials,
                      access_token: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        );
      case "google_ads":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer_id">
                Customer ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customer_id"
                placeholder="123-456-7890"
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    credentials: {
                      ...formData.credentials,
                      customer_id: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="access_token">
                Access Token <span className="text-red-500">*</span>
              </Label>
              <Input
                id="access_token"
                placeholder="Enter Access Token"
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    credentials: {
                      ...formData.credentials,
                      access_token: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        );
      case "shopify":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shop_domain">
                Shop Domain <span className="text-red-500">*</span>
              </Label>
              <Input
                id="shop_domain"
                placeholder="my-store.myshopify.com"
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    credentials: {
                      ...formData.credentials,
                      shop_domain: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="access_token">
                Access Token <span className="text-red-500">*</span>
              </Label>
              <Input
                id="access_token"
                placeholder="Enter Shopify Access Token"
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    credentials: {
                      ...formData.credentials,
                      access_token: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        );
      default:
        return null;
    }
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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
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
                          <div className="space-y-2">
                            <Label htmlFor="sync_frequency">
                              Sync Frequency
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                setFormData({
                                  ...formData,
                                  sync_frequency: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Feature Selection */}
                          <div className="space-y-4 mt-6">
                            <Label className="text-base font-medium">
                              Enabled Features{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                              {selectedType &&
                                getAvailableFeatures(
                                  selectedType as DataSourceConnection["type"],
                                ).map((feature) => (
                                  <div
                                    key={feature.id}
                                    className="flex items-center space-x-2"
                                  >
                                    <input
                                      type="checkbox"
                                      id={feature.id}
                                      checked={
                                        formData.enabled_features?.includes(
                                          feature.id,
                                        ) || false
                                      }
                                      onChange={(e) => {
                                        const updatedFeatures = e.target.checked
                                          ? [
                                              ...(formData.enabled_features ||
                                                []),
                                              feature.id,
                                            ]
                                          : formData.enabled_features?.filter(
                                              (f: any) => f !== feature.id,
                                            ) || [];
                                        setFormData({
                                          ...formData,
                                          enabled_features: updatedFeatures,
                                        });
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
                          </div>

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
    </div>
  );
}
