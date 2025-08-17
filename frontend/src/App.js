import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Button,
  useDisclosure,
  useToast,
  Spinner,
  Text,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { AddIcon, RepeatIcon } from '@chakra-ui/icons';

// Import components
import UserList from './components/UserList';
import SearchBox from './components/SearchBox';
import AddUserModal from './components/AddUserModal';

// Import services
import { fetchUsers, createNewUser } from './services/userService';

function App() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('white', 'gray.800');

  // Fetch users from API
  const loadUsers = async (showToast = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
      
      if (showToast) {
        toast({
          title: 'Success',
          description: 'User list refreshed successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }

    const searchLower = searchTerm.toLowerCase();
    return users.filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const companyName = (user.company?.name || '').toLowerCase();
      const role = (user.company?.title || '').toLowerCase();
      const country = (user.address?.country || '').toLowerCase();

      return (
        fullName.includes(searchLower) ||
        companyName.includes(searchLower) ||
        role.includes(searchLower) ||
        country.includes(searchLower)
      );
    });
  }, [users, searchTerm]);

  // Add new user to local state
  const handleAddUser = async (userData) => {
    const newUser = createNewUser(userData);
    setUsers(prevUsers => [newUser, ...prevUsers]);
    return Promise.resolve(); // Simulate async operation
  };

  // Delete user from local state
  const handleDeleteUser = (userId) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    toast({
      title: 'User Deleted',
      description: 'User has been removed from the list.',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box bg={headerBg} shadow="sm" position="sticky" top={0} zIndex={10}>
        <Container maxW="container.xl" py={4}>
          <VStack spacing={4}>
            <Heading
              as="h1"
              size="xl"
              textAlign="center"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              User List
            </Heading>
            
            <HStack spacing={4} w="100%" justify="space-between" flexWrap="wrap">
              <Box flex={1} minW="300px">
                <SearchBox
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  placeholder="Search users by name, company, role, or country..."
                />
              </Box>
              
              <HStack spacing={3}>
                <Button
                  leftIcon={<RepeatIcon />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => loadUsers(true)}
                  isLoading={isLoading}
                  loadingText="Refreshing..."
                >
                  Refresh
                </Button>
                
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="green"
                  onClick={onOpen}
                  isDisabled={isLoading}
                >
                  Add User
                </Button>
              </HStack>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          {error && (
            <Box
              bg="red.50"
              border="1px"
              borderColor="red.200"
              borderRadius="md"
              p={4}
            >
              <Text color="red.600" textAlign="center">
                {error}
              </Text>
            </Box>
          )}

          {isLoading && users.length === 0 ? (
            <VStack spacing={4} py={12}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
              <Text color="gray.600">Loading users...</Text>
            </VStack>
          ) : (
            <UserList
              users={filteredUsers}
              onDeleteUser={handleDeleteUser}
              searchTerm={searchTerm}
            />
          )}
        </VStack>
      </Container>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isOpen}
        onClose={onClose}
        onAddUser={handleAddUser}
      />
    </Box>
  );
}

export default App;
