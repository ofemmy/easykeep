import { useToast } from "@chakra-ui/react";
import { useMutation } from "react-query";
import axios from "axios";
import { useQueryClient } from "react-query";
import { Toast } from "@/components/Toast";
export default function useDeleteTransaction() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (trxId) => await axios.delete(`/api/transactions?id=${trxId}`),
    {
      onSuccess: () => {
        toast({
          duration: 3000,
          position: "top",
          title: "Success",
          status: "success",
          description: "Entry deleted successfully",
        });
        queryClient.invalidateQueries();
      },
    }
  );
  return mutation;
}
