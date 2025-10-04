"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { LoginUserDto, LoginUserZodSchema } from "@/types/auth.type";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/context/user-context";

const LoginPage = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const { setUser } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserDto>({
    resolver: zodResolver(LoginUserZodSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: LoginUserDto) => {
    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Logged in:", data);
        setUser(data); // Store user in global state
        router.push("/dashboard/thread"); // Redirect to dashboard
      } else {
        const errorData = await response.json();
        setServerError(errorData.message || "Login failed");
        console.error("Login failed:", errorData);
      }
    } catch (error) {
      console.error("Login error:", error);
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Log In</CardTitle>
        <CardDescription>
          Welcome back! Please sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg">
            Log In
          </Button>

          {serverError && (
            <p className="text-sm text-destructive text-center">
              {serverError}
            </p>
          )}
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
