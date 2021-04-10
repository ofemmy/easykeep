import { useDisclosure } from "@chakra-ui/react";
import { ModalForm } from "@/components/ModalForm";
import { useQuery } from "react-query";
import { useCategory } from "lib/useCategory";
import { Formik } from "formik";
import axios from "axios";
import { Modal } from "../components/Modal";
import useFormConfig from "../lib/useFormConfig";
import RecurringEntryForm from "../components/RecurringEntryForm";
export default function ModalForms() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {isOpen ? (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          Component={() => <EditForm onClose={onClose} />}
        />
      ) : null}
      <div>
        This is a wonderfulk text Lorem ipsum, dolor sit amet consectetur
        adipisicing elit. Quo non voluptatem officia quas, quia delectus illo
        voluptates optio laboriosam omnis nisi similique illum, necessitatibus
        commodi ea, quam sed incidunt nesciunt Lorem ipsum dolor, sit amet
        consectetur adipisicing elit. Recusandae modi impedit beatae voluptas,
        optio laboriosam cumque? Ipsam, aliquam. Quasi fugit mollitia facilis
        velit molestiae magni corporis autem ipsam excepturi saepe?
      </div>
      <button onClick={onOpen} className="p-4 text-white bg-gray-900">
        Show Modal
      </button>
    </>
  );
}
function EditForm({ onClose }) {
  const { initialValues, schema } = useFormConfig("recurringEntryForm");
  return (
    <>
      <div className="px-4 py-6 bg-primary-light sm:px-6 text-white">
        <h2 id="slide-over-heading" className="text-lg font-medium ">
          Edit Recurring Entry
        </h2>
      </div>
      <div className="px-4">
        <Formik
          component={(props) => (
            <RecurringEntryForm
              {...props}
              closeHandler={onClose}
              editMode={true}
            />
          )}
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={(values) => console.log(values)}
        />
      </div>
    </>
  );
}