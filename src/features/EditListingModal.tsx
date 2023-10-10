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
import { Controller, useForm } from "react-hook-form";
import { useSellerContext } from "@app/state/SellerContext";

const EditListingModal = ({ listing }: any) => {
  const { updateListing } = useSellerContext();

  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const modalHandler = () => setModalIsOpen(!modalIsOpen);

  const formValidation = Yup.object().shape({
    item_name: Yup.string().required("Item name is required"),
    artist_name: Yup.string().required("Artist name is required"),
    price: Yup.number().required("Price is required"),
    image_url: Yup.string().required("Image URL is required"),
  });

  const { register, control, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(formValidation),
    defaultValues: {
      item_name: listing.item_name,
      artist_name: listing.artist_name,
      price: listing.price,
      image_url: listing.image_url,
    },
  });
  const { errors } = formState;

  // A state to handle when new listing form is shown or hidden
  const [editListingLoading, setEditListingLoading] = useState(false);

  const onSubmit = async (formData: any) => {
    try {
      setEditListingLoading(true);
      const submitData = {
        ...formData,
        id: listing.id,
      };
      const response = await fetch("/api/edit-listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log({ responseData });
        setModalIsOpen(false);
        updateListing(responseData.data.listing);
        // TODO: show success message
        console.log("Form submitted successfully");
      } else {
        // Handle error, e.g., show an error message
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setEditListingLoading(false);
  };

  return (
    <div>
      <Button
        size="md"
        color="warning"
        className="text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2"
        onPress={modalHandler}
      >
        Edit
      </Button>
      <Modal isOpen={modalIsOpen} onClose={modalHandler}>
        <ModalContent>
          <ModalHeader>
            <h3 id="modal-title" className="font-semibold">
              Edit Listing
            </h3>
          </ModalHeader>
          <ModalBody>
            <form
              id="edit-listing-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col mb-0 gap-1 mx-3"
            >
              <div className="flex flex-col w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                <Controller
                  name="item_name"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      size="lg"
                      type="text"
                      label="Item name"
                      isInvalid={Boolean(errors.item_name)}
                      {...register("item_name")}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                ></Controller>
                <Controller
                  name="artist_name"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      size="lg"
                      type="text"
                      label="Artist name"
                      isInvalid={Boolean(errors.artist_name)}
                      {...register("artist_name")}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                ></Controller>
                <Controller
                  name="price"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      size="lg"
                      type="number"
                      label="Price"
                      isInvalid={Boolean(errors.price)}
                      {...register("price")}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                ></Controller>
                <Controller
                  name="image_url"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      size="lg"
                      type="text"
                      label="Image URL"
                      isInvalid={Boolean(errors.image_url)}
                      {...register("image_url")}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                ></Controller>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              size="md"
              className="mt-5 text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2"
              onPress={modalHandler}
            >
              Cancel
            </Button>
            <Button
              form="edit-listing-form"
              type="submit"
              color="warning"
              size="md"
              className="mt-5 text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2"
              disabled={editListingLoading}
              isLoading={editListingLoading}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditListingModal;
