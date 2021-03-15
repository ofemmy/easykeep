import { useMutation, useQueryClient } from "react-query";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
export default function useSettings(type: string) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const mutation = useMutation(
    async ({ newData, action }: any) => {
      const response = await axios.patch(`/api/profile?type=${type}`, {
        payload: { newData },
        action,
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("profile");
        toast({
          description: data.msg,
          status: "success",
          duration: 2000,
          position: "top",
        });
      },
    }
  );
  return { mutation };
}
