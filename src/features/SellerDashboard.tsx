import { Card, CardBody, Image, Button, Input, Badge } from "@nextui-org/react";
import React, { useState } from "react";
import { useSellerContext } from "@app/state/SellerContext";
import EditListingModal from "@feature/EditListingModal";
import DefaultLayout from "@app/layouts/default";
import NewListingModal from "@feature/NewListingModal";

const SellerDashboard = () => {

  const { state, deleteListing } = useSellerContext();

  const { listings } = state;

  console.log({ listings });

  const [deleteListingLoading, setDeleteListingLoading] = useState(false);

  // On delete listing
  const onDeleteListing = async (listingId: number) => {
    try {
      setDeleteListingLoading(true);

      const response = await fetch("/api/delete-listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listingId }),
      });

      console.log({ response });

      if (response.ok) {
        // Handle success
        console.log("Listing deleted successfully");
        deleteListing(listingId);
      }
    } catch (error) {
      console.error("Error deleting listing: ", error);
    }
    setDeleteListingLoading(false);
  };

  // TODO: nice to have: display image to the right of the form when user enters image URL
  //       of course ideally it would be file upload

  return (
    <DefaultLayout>
      <div className="space-y-8 mb-20">
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-2xl mt-10 my-1 mb-5 p-0 font-semibold font-main tracking-normal leading-relaxed text-center whitespace-normal">
            Marketplace Demo
          </h1>

          <NewListingModal />
        </div>

        <div className="flex justify-center w-full">
          <div className="flex flex-col w-[90%] items-center inline-flex mt-1 space-y-6">
            {listings &&
              listings.map((listing: any, idx: number) => (
                <Card key={idx} className="border-none bg-background/60 max-w-[710px]">
                  <CardBody>
                    <div className="grid grid-cols-3 md:grid-cols-12 gap-6 md:gap-6 items-center justify-center">
                      <div className="relative col-span-6 md:col-span-4 ml-3">
                        <Image
                          alt="Album cover"
                          className="object-cover"
                          height={200}
                          src={listing?.image_url}
                          width="100%"
                        />
                      </div>

                      <div className="flex flex-col col-span-6 md:col-span-8">
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col gap-0 space-y-3">
                            <h3 className="text-2xl font-semibold text-foreground/90">
                              {listing.item_name}
                            </h3>
                            <h5 className="italic font-semibold text-foreground/90">
                              {listing.artist_name}
                            </h5>
                            <p className="text-md text-foreground/80">
                              <b>Price:</b> ${listing?.price}
                            </p>
                          </div>
                          <div className="space-y-3 mr-3">
                            <EditListingModal listing={listing} />
                            <Button
                              color="warning"
                              variant="bordered"
                              className="text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2"
                              disabled={deleteListingLoading}
                              isLoading={deleteListingLoading}
                              onClick={() => onDeleteListing(listing.id)}
                            >
                              Delist
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-col mt-0 gap-1">
                          <div className="flex justify-between">
                            <p className="text-small"></p>
                            <p className="text-small text-foreground/50"></p>
                          </div>
                        </div>

                        <div className="flex w-full items-center justify-center"></div>
                      </div>
                    </div>
                    {/*<div className="">*/}
                    {/*  <Badge*/}
                    {/*    color="primary"*/}
                    {/*    className="mt-3 ml-3 flex flex-col justify-between space-x-2"*/}
                    {/*  >*/}
                    {/*    <span className="font-normal text-base text-primary px-4 py-4">*/}
                    {/*      acooluser@example.com bid for <b>${listing?.price}</b>*/}
                    {/*    </span>*/}
                    {/*    <div className="flex flex-row pr-4">*/}
                    {/*      <Button*/}
                    {/*        variant="bordered"*/}
                    {/*        type="submit"*/}
                    {/*        color="success"*/}
                    {/*        size="md"*/}
                    {/*        className="ml-4 mt-0 w-10 text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2"*/}
                    {/*      >*/}
                    {/*        Accept*/}
                    {/*      </Button>*/}
                    {/*      <Button*/}
                    {/*        variant="bordered"*/}
                    {/*        type="submit"*/}
                    {/*        color="danger"*/}
                    {/*        size="md"*/}
                    {/*        className="ml-4 mt-0 w-10 text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2"*/}
                    {/*      >*/}
                    {/*        Decline*/}
                    {/*      </Button>*/}
                    {/*    </div>*/}
                    {/*  </Badge>*/}
                    {/*</div>*/}
                  </CardBody>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SellerDashboard;
