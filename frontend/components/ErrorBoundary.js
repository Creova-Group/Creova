// components/ErrorBoundary.js
import { Component } from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <Box textAlign="center" py={10}>
          <Heading as="h2" size="xl" mb={4}>
            Something went wrong.
          </Heading>
          <Text fontSize="lg" mb={4}>
            An unexpected error occurred: {this.state.error?.message || "Unknown error"}
          </Text>
          <Button onClick={() => window.location.reload()} colorScheme="teal">
            Refresh the Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;