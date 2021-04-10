import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useCategory } from "lib/useCategory";
import axios from "axios";
export function ModalForm({ isOpen, onClose }) {
  //   const {
  //     result,
  //     isLoading: isLoadingCategories,
  //     isError,
  //     error,
  //   } = useCategory();
  const fetchCat = async () => {
    const result = await axios.get("api/test");
    return result;
  };
  const { data, isLoading, isError, error } = useQuery("category", fetchCat);
  if (isLoading) {
    return <span>Loading....</span>;
  }
  if (isError) {
    return <span>Error: {error}</span>;
  }
  let categories = [];
  console.log(data);
  return (
    <div>{JSON.stringify(data)}</div>
    // <Modal isOpen={isOpen} onClose={onClose}>
    //   <ModalOverlay />
    //   <ModalContent>
    //     <ModalHeader>Modal Title</ModalHeader>
    //     <ModalCloseButton />
    //     <ModalBody>
    //       <p>Hi There</p>
    //       <select name="category" id="">
    //         {categories.map((cat) => (
    //           <option>{cat.title}</option>
    //         ))}
    //       </select>
    //     </ModalBody>

    //     <ModalFooter>
    //       <Button colorScheme="blue" mr={3} onClick={onClose}>
    //         Close
    //       </Button>
    //       <Button variant="ghost">Secondary Action</Button>
    //     </ModalFooter>
    //   </ModalContent>
    // </Modal>
  );
}
