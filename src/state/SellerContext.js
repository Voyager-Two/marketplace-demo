import React, { createContext, useContext, useEffect, useReducer } from "react";

// Create a context
const SellerContext = createContext();

// Define initial state
const initialState = {
  listings: [], // Initialize with an empty array
  loading: true, // Add a loading state to track initial data fetching
};

// Define actions
const ADD_LISTING = "ADD_LISTING";
const UPDATE_LISTING = "UPDATE_LISTING";
const DELETE_LISTING = "DELETE_LISTING";
const SET_LISTINGS = "SET_LISTINGS"; // New action type to set initial listings

// Reducer function
const sellerReducer = (state, action) => {
  switch (action.type) {
    case ADD_LISTING:
      return {
        ...state,
        // Add the new listing to the beginning
        listings: [action.payload, ...state.listings],
      };
    case UPDATE_LISTING:
      return {
        ...state,
        listings: state.listings.map((listing) =>
          listing.id === action.payload.id ? action.payload : listing
        ),
      };
    case DELETE_LISTING:
      return {
        ...state,
        listings: state.listings.filter(
          (listing) => listing.id !== action.payload
        ),
      };
    case SET_LISTINGS:
      return {
        ...state,
        listings: action.payload,
        loading: false, // Set loading to false after fetching initial data
      };
    default:
      return state;
  }
};

// SellerProvider component
const SellerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sellerReducer, initialState);

  // Define actions to be used by components
  const addListing = (listing) => {
    dispatch({ type: ADD_LISTING, payload: listing });
  };

  const updateListing = (listing) => {
    dispatch({ type: UPDATE_LISTING, payload: listing });
  };

  const deleteListing = (listingId) => {
    dispatch({ type: DELETE_LISTING, payload: listingId });
  };

  useEffect(() => {
    // Fetch initial data from the API
    console.log("Fetching initial data...");
    fetchSellerListings()
      .then((data) => {
        const listings = Object.values(data.data);
        // Dispatch an action to set the initial listings in the state
        dispatch({ type: SET_LISTINGS, payload: listings });
      })
      .catch((error) => {
        console.error("Error fetching initial data:", error);
      });
  }, []);

  return (
    <SellerContext.Provider
      value={{ state, addListing, updateListing, deleteListing }}
    >
      {children}
    </SellerContext.Provider>
  );
};

const fetchSellerListings = async () => {
  try {
    const response = await fetch(`/api/seller-listings`);

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error fetching seller listings: " + error.message);
  }
};

// Custom hook to access the context
const useSellerContext = () => {
  const context = useContext(SellerContext);
  if (!context) {
    throw new Error("useSellerContext must be used within a SellerProvider");
  }
  return context;
};

export { SellerProvider, useSellerContext };
