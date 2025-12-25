import { Link } from "react-router-dom";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-5xl font-bold text-gray-900">
            404
          </CardTitle>
          <CardDescription className="text-3xl font-semibold text-gray-800 mt-4">
            Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-600">
            Oops! The page you're looking for doesn't exist.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild size="lg" variant="outline">
            <Link to="/">Go Back Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
