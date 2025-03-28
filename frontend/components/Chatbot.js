// components/Chatbot.js
import { useState } from "react";
import { Box, Button, VStack, Text, Input, useColorMode, useToast, IconButton } from "@chakra-ui/react";
import { FaComments, FaTimes } from "react-icons/fa"; // Icons for toggle and close

export default function Chatbot() {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false); // State to toggle chat visibility
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Temporary placeholder since OpenAI quota is exceeded
  const handleSend = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    toast({
      title: "Processing...",
      status: "info",
      duration: null,
      isClosable: false,
      position: "bottom-right",
      containerStyle: { bg: "teal.500", color: "white" },
    });

    try {
      // Placeholder response (replace with OpenAI call after quota fix)
      const mockResponse = { content: "Hi! This feature is coming soon. The Creova chatbot will soon support smart, AI-driven support powered by OpenAI." };
      setMessages([...messages, { role: "user", content: input }, { role: "assistant", content: mockResponse.content }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
        containerStyle: { bg: "red.500", color: "white" },
      });
    } finally {
      setInput("");
      setIsLoading(false);
      toast.closeAll();
    }
  };

  return (
    <Box
      position="fixed"
      right="0"
      top="50%"
      transform="translateY(-50%)"
      zIndex={1000}
      transition="all 0.3s ease-in-out"
      w={isOpen ? { base: "300px", md: "400px" } : "60px"} // Width changes based on open/closed state
      h={isOpen ? "400px" : "60px"} // Height changes based on open/closed state
      bg={colorMode === "light" ? "white" : "gray.800"}
      borderRadius={isOpen ? "xl" : "full"} // Rounded when closed, box when open
      boxShadow="0 12px 32px rgba(0, 0, 0, 0.2)"
    >
      {isOpen ? (
        // Open state: Full chat window
        <VStack spacing={4} align="stretch" h="100%" p={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Text fontWeight="bold" color={colorMode === "light" ? "teal.600" : "teal.200"}>
              Creova Assistant (Beta Preview)
            </Text>
            <IconButton
              icon={<FaTimes />}
              size="sm"
              variant="ghost"
              colorScheme="teal"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            />
          </Box>
          <Box flex="1" overflowY="auto">
            {messages.map((msg, idx) => (
              <Text key={idx} color={msg.role === "user" ? "gray.700" : "teal.500"}>
                {msg.role === "user" ? "You: " : "Assistant: "} {msg.content}
              </Text>
            ))}
            {isLoading && <Text color="gray.500">Loading...</Text>}
          </Box>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything!"
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            colorScheme="teal"
            size="md"
            borderRadius="full"
            onClick={handleSend}
            isLoading={isLoading}
            _hover={{ transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)" }}
          >
            Send
          </Button>
        </VStack>
      ) : (
        // Closed state: Vertical bar with toggle button
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          w="100%"
          bgGradient="linear(to-b, teal.500, teal.600)" // Matches your theme (#14B8A6)
          borderRadius="full"
          cursor="pointer"
          onClick={() => setIsOpen(true)}
        >
          <IconButton
            icon={<FaComments />}
            size="lg"
            variant="ghost"
            color="white"
            aria-label="Open chat"
            _hover={{ color: "whiteAlpha.800" }}
          />
        </Box>
      )}
    </Box>
  );
}