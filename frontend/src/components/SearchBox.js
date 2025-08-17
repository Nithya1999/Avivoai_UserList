import React from 'react';
import {
  InputGroup,
  InputLeftElement,
  Input,
  Box,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const SearchBox = ({ searchTerm, onSearchChange, placeholder = "Search users..." }) => {
  const inputBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');

  return (
    <Box>
      <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
        Search by name, company, role, or country
      </Text>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          bg={inputBg}
          borderColor={borderColor}
          _hover={{
            borderColor: 'blue.300',
          }}
          _focus={{
            borderColor: 'blue.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
          }}
        />
      </InputGroup>
    </Box>
  );
};

export default SearchBox;
