import React, { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalContent,
} from "@nextui-org/react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSellerContext } from "@app/state/SellerContext";
import clsx from "clsx";

const NewListingModal = () => {
  const { addListing } = useSellerContext();

  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const modalHandler = () => setModalIsOpen(!modalIsOpen);

  const formValidation = Yup.object().shape({
    item_name: Yup.string().required("Item name is required"),
    artist_name: Yup.string().required("Artist name is required"),
    price: Yup.number().required("Price is required"),
    image_url: Yup.string().required("Image URL is required"),
  });
  const formOptions = { resolver: yupResolver(formValidation) };

  const { register, handleSubmit, formState, reset } = useForm(formOptions);
  const { errors } = formState;

  // A state to handle when new listing form is shown or hidden
  const [newListingLoading, setNewListingLoading] = useState(false);

  const onModalClose = () => {
    reset();
  }

  const onSubmit = async (formData: any) => {
    try {
      setNewListingLoading(true);
      const response = await fetch("/api/new-listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log({ responseData });
        // Handle success, e.g., show a success message
        reset();
        addListing(responseData.data.listing);
        setModalIsOpen(false);
        // TODO: show success message
        console.log("Form submitted successfully");
      } else {
        // Handle error, e.g., show an error message
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setNewListingLoading(false);
  };

  return (
    <div>
      <Button
        color="warning"
        size="lg"
        className={clsx(
          `mt-4 text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2`,
        )}
        onPress={modalHandler}
      >
        Create a new listing
      </Button>
      <Modal isOpen={modalIsOpen} onClose={modalHandler} onOpenChange={onModalClose}>
        <ModalContent>
          <ModalHeader>
            <h3 id="modal-title" className="font-semibold">
              Create a new listing
            </h3>
          </ModalHeader>
          <ModalBody>
            <form id="form-new-listing" onSubmit={handleSubmit(onSubmit)} className="flex flex-col mb-3 gap-1 mx-3">
              <div className="flex flex-col w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                <Input
                  size="lg"
                  type="text"
                  label="Item name"
                  isInvalid={Boolean(errors.item_name)}
                  {...register("item_name")}
                />
                <Input
                  size="lg"
                  type="text"
                  label="Artist name"
                  isInvalid={Boolean(errors.artist_name)}
                  {...register("artist_name")}
                />
                <Input
                  size="lg"
                  type="number"
                  label="Price"
                  isInvalid={Boolean(errors.price)}
                  {...register("price")}
                />
                <Input
                  size="lg"
                  type="text"
                  label="Image URL"
                  isInvalid={Boolean(errors.image_url)}
                  {...register("image_url")}
                />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              size="md"
              className="mt-5 w-10 text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2"
              onClick={modalHandler}
            >
              Cancel
            </Button>
            <Button
              form="form-new-listing"
              type="submit"
              color="warning"
              size="md"
              className="mt-5 text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2"
              disabled={newListingLoading}
              isLoading={newListingLoading}
            >
              Create new listing
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default NewListingModal;
