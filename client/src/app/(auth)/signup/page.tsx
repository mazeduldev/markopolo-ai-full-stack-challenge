"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  RegisterUserFormSchemaType,
  RegisterUserFormZodSchema,
  RegisterUserZodSchema,
} from "@/types/auth.type";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const SignupPage = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserFormSchemaType>({
    resolver: zodResolver(RegisterUserFormZodSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      store: {
        name: "",
        url: "",
      },
    },
  });

  const onSubmit = async (formData: RegisterUserFormSchemaType) => {
    try {
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(RegisterUserZodSchema.parse(formData)),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Account created:", data);
        // todo: store user in global state
        router.push("/dashboard"); // Redirect to dashboard
      } else {
        const errorData = await response.json();
        setServerError(errorData.message || "Sign up failed");
        console.error("Sign up failed:", errorData);
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create a new account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="name"
              {...register("name")}
              placeholder="Enter your name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeName">Shop Name</Label>
            <Input
              id="storeName"
              type="name"
              {...register("store.name")}
              placeholder="Enter your store name"
              className={errors.store?.name ? "border-red-500" : ""}
            />
            {errors.store?.name && (
              <p className="text-sm text-red-500">
                {errors.store?.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeUrl">Shop URL</Label>
            <Input
              id="storeUrl"
              type="url"
              {...register("store.url")}
              placeholder="Enter your store URL"
              className={errors.store?.url ? "border-red-500" : ""}
            />
            {errors.store?.url && (
              <p className="text-sm text-red-500">
                {errors.store?.url.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Sign Up
          </Button>

          {serverError && (
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          )}
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupPage;
