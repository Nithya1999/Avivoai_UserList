import React from 'react';
import {
  SimpleGrid,
  Text,
  VStack,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import UserCard from './UserCard';

const UserList = ({ users, onDeleteUser, searchTerm }) => {
  const emptyStateColor = useColorModeValue('gray.500', 'gray.400');

  if (users.length === 0) {
    return (
      <VStack spacing={4} py={8}>
        <Text fontSize="lg" color={emptyStateColor} textAlign="center">
          {searchTerm ? 
            `No users found matching "${searchTerm}"` : 
            'No users available'
          }
        </Text>
        {searchTerm && (
          <Text fontSize="sm" color={emptyStateColor} textAlign="center">
            Try adjusting your search terms or clear the search to see all users.
          </Text>
        )}
      </VStack>
    );
  }

  return (
    <Box>
      <Text fontSize="sm" color="gray.600" mb={4}>
        Showing {users.length} user{users.length !== 1 ? 's' : ''}
        {searchTerm && ` matching "${searchTerm}"`}
      </Text>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing={6}
        w="100%"
      >
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onDelete={onDeleteUser}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default UserList;
