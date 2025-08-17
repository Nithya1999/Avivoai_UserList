import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Text,
  Badge,
  HStack,
  VStack,
  IconButton,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const UserCard = ({ user, onDelete }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const fullName = `${user.firstName} ${user.lastName}`;
  const companyName = user.company?.name || 'N/A';
  const role = user.company?.title || 'N/A';
  const country = user.address?.country || 'N/A';

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      shadow="sm"
      transition="all 0.2s"
      _hover={{
        shadow: 'md',
        transform: 'translateY(-2px)',
      }}
      position="relative"
    >
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between" align="flex-start">
            <VStack align="flex-start" spacing={1} flex={1}>
              <Text fontSize="lg" fontWeight="bold" color="blue.500">
                {fullName}
              </Text>
              {user.email && (
                <Text fontSize="sm" color={textColor}>
                  {user.email}
                </Text>
              )}
            </VStack>
            <IconButton
              aria-label="Delete user"
              icon={<DeleteIcon />}
              size="sm"
              colorScheme="red"
              variant="ghost"
              onClick={() => onDelete(user.id)}
              _hover={{
                bg: 'red.100',
                color: 'red.600',
              }}
            />
          </HStack>

          <Divider />

          <VStack align="stretch" spacing={2}>
            <HStack>
              <Text fontSize="sm" fontWeight="medium" minW="70px">
                Company:
              </Text>
              <Text fontSize="sm" color={textColor}>
                {companyName}
              </Text>
            </HStack>

            <HStack>
              <Text fontSize="sm" fontWeight="medium" minW="70px">
                Role:
              </Text>
              <Badge colorScheme="green" variant="subtle" borderRadius="md">
                {role}
              </Badge>
            </HStack>

            <HStack>
              <Text fontSize="sm" fontWeight="medium" minW="70px">
                Country:
              </Text>
              <Badge colorScheme="blue" variant="outline" borderRadius="md">
                {country}
              </Badge>
            </HStack>
          </VStack>

          {user.isLocal && (
            <Badge
              colorScheme="purple"
              variant="solid"
              size="sm"
              position="absolute"
              top={2}
              right={2}
              borderRadius="full"
            >
              Local
            </Badge>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default UserCard;
