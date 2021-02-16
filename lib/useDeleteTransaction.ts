import { useMutation } from "react-query";
import axios from "axios";
import { useQueryClient } from "react-query";

export default function useDeleteTransaction() {
    const queryClient = useQueryClient();
  const mutation = useMutation(
    async (trxId) =>
      await axios.delete("/api/transactions", { data: { _id: trxId } }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    }
  );
  return mutation;
}
